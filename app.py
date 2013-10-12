from flask import Flask
from flask.ext import restful
from api import db
app = Flask(__name__)
api = restful.Api(app)
		
api.add_resource(db.db_list, '/api/db_list')

if __name__ == '__main__':
    app.run(debug=True) 