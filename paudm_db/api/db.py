from flask.ext import restful
from paudm_db import model #in the future it will be imported by other packages

model.init('sqlite:///test/prova.db')
class db_list(restful.Resource):
	"""It defines a rest api to get all tables present in db """
	def get(self):
		return { 'list' : model.metadata.tables.keys() }
		
class tb_list(restful.Resource):
	"""It defines a rest api to get all tables present in db """
	def get(self,tb_name):
		tb_object = getattr(model,tb_name)
		self.items = model.session.query(tb_object).all()
		return { 'list' : self.items }