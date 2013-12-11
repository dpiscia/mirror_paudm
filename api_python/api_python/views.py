""" Cornice services.
"""
from cornice import Service
from paudm.tools.db import model #in the future it will be imported by other packages
from sqlalchemy import Table

tb_list = Service(name='db_list', path='/db_list', description="Simplest app")
fields_list = Service(name='fields_list', path='/tb/{table}', description="Simplest app")

@tb_list.get()
def get(request):
	tables = model.metadata.tables.keys()
	result = []
	for table in tables:
		for_keys = []
		for c in Table(table,model.metadata, autoload=True).foreign_keys:
			 for_keys.append(c.target_fullname)
		result.append({"name" : table, "foreign_keys" : for_keys })
	return   result
	
@fields_list.get()
def get(request):
	"""It defines a rest api to get all tables present in db
	the syntax is the following /tb/{tb_name} """
	#def get(self,tb_name):
	tb_name = request.matchdict['table']
	
	table = Table(tb_name, model.metadata, autoload=True)	
	return  {'list' : [c.name for c in table.columns] } 