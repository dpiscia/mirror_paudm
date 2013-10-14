from flask import Flask
from flask.ext import restful
from api import db
app = Flask(__name__)
api = restful.Api(app)
		
api.add_resource(db.db_list, '/api/db_list')
api.add_resource(db.tb_list, '/api/tb/<tb_name>')
if __name__ == '__main__':
	model.init('sqlite:///paudm_db/test/prova.db')
	model.recreate()
	app.run(debug=True) 