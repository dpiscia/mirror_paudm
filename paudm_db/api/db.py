from flask.ext import restful
from paudm_db import model #in the future it will be imported by other packages

class db_list(restful.Resource):
	"""It defines a rest api to get all tables present in db """
	def get(self):
		return  model.metadata.tables.keys() 
		
class tb_list(restful.Resource):
	"""It defines a rest api to get all tables present in db
	the syntax is the following api/tb/<tb_name> """
	def get(self,tb_name):
		self.items = []
		tb_object = getattr(model,tb_name.title())
		items = model.session.query(tb_object).all()
		for item in items:
			self.items.append(row2dict(item))
		return { 'list' : self.items }
		
def row2dict(row):
    d = {}
    for column in row.__table__.columns:
        d[column.name] = getattr(row, column.name)

    return d