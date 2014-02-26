

import sys
import random
from sqlalchemy import update
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server_python import model
from server_python.lib.security.db_query import create_psql_user_psw, grant_permissions_to_table, revoke_permissions_from_table, delete_user
from server_python.lib.security.private_api import combination, getBin, generate_hash, bit_map, generate_name, get_password

def get_group_mapped(connection):
	''' return a dict [{'name': name, 'bit': 1}] '''
	groups = connection.query(model.Group).order_by(model.Group.id).all()	
	return bit_map([group.name for group in groups])
	
def get_mapped_array(subgroup,group):
	
	array = []
	mask = {}
	for x in group: mask.update({x['name']:x['bit']})
	for el in subgroup:
		 array.append({'name' : el.name, 'bit' :mask[el.name]})	
	return array

def create_session(url):
	'''create an sqlalchemy session'''
	some_engine = create_engine(url)
	
	# create a configured "Session" class
	Session = sessionmaker(bind=some_engine)
	
	# create a Session
	session = Session()
	return session
	

def create_all_user(array,connection,salt):
	'''create for each combination  of groups ,a postgres user with the corresponding permissions'''
	for sub in combination(array):
		try:
			print sub
			user,pwd = generate_user_pwd_context(sub,connection,'salt')
			create_psql_user_psw(user,pwd,['cat_'+x['name'] for x in array],connection)
			
		except:	
			connection.rollback()
			raise
			
def grant_all_permissions_tables(groups,tables,connection):
	for i,group in enumerate(groups):
		grant_permissions_to_table(group,tables[i],connection)
		

def remove_all_user(array,connection):
	for sub in combination(array):
		delete_user(generate_user_pwd_context( sub,connection,'salt')[0], connection)
		
def grant_all_tables(groups,connection):
	for group in groups:
		table = connection.query(model.Catalog).select_from(model.Group).join(model.Group.catalogs).filter(model.Group.name == group['name']).one().view
		grant_permissions_to_table(group['name'],table,connection)

def revoke_all_tables(groups,connection):
	for group in groups:
		table = connection.query(model.Catalog).select_from(model.Group).join(model.Group.catalogs).filter(model.Group.name == group['name']).one().view
		revoke_permissions_from_table(group['name'],table,connection)

	
def generate_user_pwd_context(array, connection, salt):
	'''given an array of type [{'name': name, 'bit': 1}] return the username and password
	'''
	context_user = "user_"+getBin(generate_name([x['bit'] for x in array]))
	context_password = get_password([x['name'] for x in array],connection,salt)
	return context_user, context_password
	
def create_group_pwd_roles(groups,connection,salt):
	'''create standard group roles
	'''
	for group in groups:
		pwd= generate_hash(str(random.random()))
		try:
			
			print "trace"
			import pdb; pdb.set_trace()
			connection.query(model.Group).filter_by(name = group['name']).update({"password":pwd})
			connection.commit()
			print "CREATE PASSWORD "+pwd+" for user "+group['name']
			#create_psql_user_psw(group['name'],pwd,['cat_'+group['name']],connection)
		except:
			connection.rollback()
			raise
def remove_group_pwd_roles(groups,connection):
	''' remove group roles'''
	for group in groups:
		try:
			connection.query(model.Group).filter_by(name = group['name']).update({"password":""})
			connection.commit()
			print "remove password from group "+group['name']
			#delete_user(group['name'],connection)
		except:
			connection.rollback()
			raise		

	
