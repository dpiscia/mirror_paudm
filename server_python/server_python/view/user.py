#! /usr/bin/env python
# -*- coding: utf-8 -*-

import colander
from colander import Mapping

import textwrap
import transaction
import jsondate as json

from sqlalchemy import and_
from cornice import Service
from server_python import model

from server_python.lib.helpers import _create_token, valid_token, _USERS

from pyramid_mailer import get_mailer
from pyramid_mailer.message import Message
from pyramid_simpleform import Form
from pyramid_simpleform.renderers import FormRenderer
from pyramid.httpexceptions import HTTPFound
from pyramid.security import authenticated_userid, forget, remember
from pyramid.view import forbidden_view_config, view_config





groups_info = Service(name='get groups filtered by User id', path='api_python/groups', description="get groups list filtered by user id")
public_groups_info = Service(name='get groups', path='api_python_public/groups', description="get groups list")
register = Service(name='register', path='api_python/register', description="register")
users = Service(name='user list', path='api_python/user', description="get user list from admin view")
users_number = Service(name='user numbers', path='api_python/users_counter', description="get user number")
personal_area = Service(name='user data', path='api_python/personal_area', description="get user data list from user view")

class InvalidPassword(Exception):
    pass

class UserNotEnabled(Exception):
    pass




 
@register.post()
def post_user(request):
    

	class Group(colander.MappingSchema):
	    name = colander.SchemaNode(colander.String())
	class Groups(colander.SequenceSchema):
		group = Group()
	class User(colander.MappingSchema):
	    email = colander.SchemaNode(colander.String())
	    name = colander.SchemaNode(colander.String())
	    password = colander.SchemaNode(colander.String())
	    verification = colander.SchemaNode(colander.String())
	    groups = Groups()
	    
	schema = User()
       
    
    
	# FIXME: Group checkboxes are not filled correctly on form error
	# FIXME: Throw 400 if any group name does not exist.
	try:  
		
		
		deserialized = schema.deserialize(request.json_body) 
	    
	except Exception:
		request.response.status = 400
		return {'error': 'error'}
	try:	
		email = deserialized['email']
		if (len(request.db.query(model.User).filter_by(email=email).all())>0):
			request.response.status = 400
			return {'error' :'Username already exists, please choose another one'}
	        
	        # Insert a new user with only public access
		user = model.User(
	            email    = email,
	            name     = deserialized['name'],
	            password = deserialized['password'],
	            enabled  = True,
	        )
		acl = request.db.query(model.Group).filter(model.Group.name.in_([group['name'] for group in deserialized['groups']])).all()
		request.db.add(user)
		
		admins = request.db.query(model.User).filter_by(
		    is_admin = True,
		    enabled  = True,
		)
		request.response.status = 201
		return {'OK' :'OK'}
	        
	except Exception:
		transaction.doom()
		error = 'Failed to register.'
		request.response.status = 403
		return {'error' :error}
     
@groups_info.get(validators=valid_token)
def get_groups(request):
	"""Returns groups in JSON."""
	user_id = request.validated['user_id']    
	groups_dict = []
	groups = request.db.query(model.Group).order_by(model.Group.name).all()
        # Retrieve public catalogs
	groups_dict.append({'name' : 'public', 'nbr' : len(request.db.query(model.Catalog).filter(~model.Catalog.groups.any()).all())})
    	
	for group in groups:
		query = request.db.query(model.Catalog).select_from(model.User).join(model.User.groups).join(model.Group.catalogs).filter(model.Group.id==group.id)
		#import ipdb; ipdb.set_trace()
		nbr = len(group.catalogs)
		access = len(query.filter(model.User.id == user_id).all()) > 0
		groups_dict.append({'name' : group.name, 'nbr' : nbr, 'access' : access})
	return {'groups': groups_dict}
 

@public_groups_info.get()
def get_groups(request):
	"""Returns groups in JSON."""
	
	groups_dict = []
	groups = request.db.query(model.Group).order_by(model.Group.name).all()
        # Retrieve public catalogs
	groups_dict.append({'name' : 'public'})
    	
	for group in groups:
		groups_dict.append({'name' : group.name })
	return {'groups': groups_dict}
    

@users.get(validators=valid_token)
def user_get(request):
	user_id = request.validated['user_id']
	
	if not request.user.is_admin:
		request.response.status = 400
		return {'error':'You are not allowed to access this resource'}
	dict = []
	try:
		users = request.db.query(model.User).all()
		groups_all = request.db.query(model.Group).order_by(model.Group.name).all()
	
		for user in users:
			dict_groups = {}
			for group in groups_all:
				dict_groups.update({group.name : group.name in [user_group.name for user_group in user.groups]})
			dict.append({'_id' : user.id, 'name' : user.name, 'email' : user.email , 'is_admin' :user.is_admin, 'enabled' :user.enabled, 'groups' : dict_groups})
		request.response.status = 200
		return dict
	except Exception:
		request.response.status = 400
		return {'error' : 'failed to retrieve user list'}


		
@users.put(validators=valid_token)
def user_post(request):
	
	user_id = request.validated['user_id']
	#we need all groups to build the schema
	
	groups_all = request.db.query(model.Group).order_by(model.Group.name).all()
	
	#colander schema defined imperatevely rather than declarative to accomodate dynamic creation needs
	
	groups = colander.SchemaNode(Mapping(),name='groups')
	
	for group_el in groups_all:
		groups.add(colander.SchemaNode(colander.Bool(), name=group_el.name))
	schema = colander.SchemaNode(Mapping())
	schema.add(colander.SchemaNode(colander.Int(), name='_id'))
	schema.add(colander.SchemaNode(colander.String(), name='email'))
	schema.add(colander.SchemaNode(colander.String(), name='name'))
	schema.add(colander.SchemaNode(colander.Bool(), name='is_admin'))
	schema.add(colander.SchemaNode(colander.Bool(), name='enabled'))
	schema.add( groups)
	try:    
		
		deserialized = schema.deserialize(request.json_body) 
	    
	except Exception:
		request.response.status = 400
		return {'error': 'error'}	

	try:
		


		
		#groups_sel = []
		
		#request.db.query(model.Group).filter(model.Group.id.in_(form_data['groups'])).all()
		user   = request.db.query(model.User).filter_by(id = deserialized['_id']).one()
		user.email = deserialized['email']
		user.name = deserialized['name']
		user.enabled  = deserialized['enabled']
		user.is_admin = deserialized['is_admin']
		
		groups_sel = []
		for group_el in groups_all:
			if (deserialized['groups'][group_el.name]):
				groups_sel.append(group_el)
		print groups_sel
		user.groups   = set(groups_sel)
		request.response.status = 200
		return request.json_body 
	except Exception:
		request.response.status = 400
		return {'error': 'error'}	

		
@users.delete(validators=valid_token)
def user_post(request):
	
	user_id = int(request.params.get('id'))

	try:

		user   = request.db.query(model.User).filter_by(id = user_id).one()
		request.db.delete(user)
		request.response.status = 200
		return {'OK':'OK'}
	except Exception:
		request.response.status = 400
		return {'error': 'error'}	
		

@personal_area.get(validators=valid_token)
def user_get(request):
	user_id = request.validated['user_id']

	dict = {}
	try:

		dict = {'_id' : request.user.id, 'name' : request.user.name, 'email' : request.user.email }
		request.response.status = 200
		return dict
	except Exception:
		request.response.status = 400
		return {'error' : 'failed to retrieve user list'}
		
@personal_area.put(validators=valid_token)
def user_put(request):


	class User(colander.MappingSchema):
	    email = colander.SchemaNode(colander.String())
	    name = colander.SchemaNode(colander.String())
	    password = colander.SchemaNode(colander.String(), missing=None)
	    verification = colander.SchemaNode(colander.String(), missing=None)
	    
	schema = User()

	try:  
		
		import ipdb; ipdb.set_trace()
		deserialized = schema.deserialize(request.json_body) 
	    
	except Exception:
		request.response.status = 400
		return {'error': 'error'}
	try:	

		
		request.user.email = deserialized['email']
		request.user.name = deserialized['name']
		if not (deserialized['password'] == None):
			if (deserialized['password'] == deserialized['verification']):
				request.user.password  = password = deserialized['password']
			else:
				raise


		request.response.status = 201
		return request.json_body
	        
	except Exception:
		transaction.doom()
		error = 'Failed to update data.'
		request.response.status = 403
		return {'error' :error}


@users_number.get(validators=valid_token)
def users_number_get(request):

	try:
		
		users_nbr = len(request.db.query(model.User).all())
		request.stauts = 200
		return {'users_nbr' : users_nbr}
	except Exception:

		error = 'Failed to retrieve data'
		request.response.status = 403
		return {'error' :error}	