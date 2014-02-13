""" Cornice services.
"""
from cornice import Service


tb_list = Service(name='db_list', path='api_python/db_list', description="Simplest app")
fields_list = Service(name='fields_list', path='api_python/tb/{table}', description="Simplest app")

        
        
@tb_list.get()
def get(request):
	
	tables = request.registry.settings['model.insp'].get_table_names()
	result = []
	for table in tables:
		for_keys = []
		for c in request.registry.settings['model.insp'].get_foreign_keys(table):
			 for_keys.append(c)
		result.append({"name" : table, "foreign_keys" : for_keys })
	return   result
	
@fields_list.get()
def get(request):
	"""It defines a rest api to get all tables present in db
	the syntax is the following api/tb/{tb_name} """
	#def get(self,tb_name):
	tb_name = request.matchdict['table']
	
		
	return  {'list' :  {'columns' : [c['name'] for c in request.registry.settings['model.insp'].get_columns(tb_name)], 
						'indexes' : {'name' :[c['name'] for c in request.registry.settings['model.insp'].get_indexes(tb_name)] , 'column_names' :[c['column_names'] for c in request.registry.settings['model.insp'].get_indexes(tb_name)]}, 
						'pr_keys' : [c for c in request.registry.settings['model.insp'].get_primary_keys(tb_name)]} } 