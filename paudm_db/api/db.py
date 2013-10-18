from flask.ext import restful
from paudm_db import model #in the future it will be imported by other packages
from sqlalchemy import Table

class db_list(restful.Resource):
	"""It defines a rest api to get all tables present in db """
	def get(self):
		tables = model.metadata.tables.keys()
		result = []
		for table in tables:
			result.append({"name" : table})
		return  result
		
class tb_list(restful.Resource):
	"""It defines a rest api to get all tables present in db
	the syntax is the following api/tb/<tb_name> """
	def get(self,tb_name):
		self.items = []
		table = Table(tb_name, model.metadata, autoload=True)	
		return  {'list' : [c.name for c in table.columns] } 
#		self.items = []
#		tb_object = getattr(model,tb_name.title())
#		items = model.session.query(tb_object).all()
#		for item in items:
#			self.items.append(row2dict(item))
#		return { 'list' : self.items }
		
#def row2dict(row):
#    d = {}
#    for column in row.__table__.columns:
#        d[column.name] = getattr(row, column.name)

#    return d