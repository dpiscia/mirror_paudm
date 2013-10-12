from flask.ext import restful
from paudm_db import model #in the future it will be imported by other packages


class db_list(restful.Resource):
	"""It defines a rest api to get all tables present in db """
	def get(self):
		return { 'list' : model.metadata.tables.keys() }