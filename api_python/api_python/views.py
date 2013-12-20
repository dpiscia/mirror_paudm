""" Cornice services.
"""
from cornice import Service
from sqlalchemy import inspect, create_engine
import api_python 
tb_list = Service(name='db_list', path='/db_list', description="Simplest app")
fields_list = Service(name='fields_list', path='/tb/{table}', description="Simplest app")

        
        
@tb_list.get()
def get(request):
	#import pdb;  pdb.set_trace()
	tables = api_python.insp.get_table_names()
	result = []
	for table in tables:
		for_keys = []
		for c in api_python.insp.get_foreign_keys(table):
			 for_keys.append(c)
		result.append({"name" : table, "foreign_keys" : for_keys })
	return   result
	
@fields_list.get()
def get(request):
	"""It defines a rest api to get all tables present in db
	the syntax is the following api/tb/{tb_name} """
	#def get(self,tb_name):
	tb_name = request.matchdict['table']
	
		
	return  {'list' :  {'columns' : [c['name'] for c in api_python.insp.get_columns(tb_name)], 
						'indexes' : {'name' :[c['name'] for c in api_python.insp.get_indexes(tb_name)] , 'column_names' :[c['column_names'] for c in api_python.insp.get_indexes(tb_name)]}, 
						'pr_keys' : [c for c in api_python.insp.get_primary_keys(tb_name)]} } 