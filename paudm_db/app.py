from flask import Flask, render_template
from flask.ext import restful
from api import db
from paudm_db import model
import jinja2
app = Flask(__name__,static_path="/static", template_folder="static")
api = restful.Api(app)
#the static foleder is a symbolic link to ../client/app folder

api.add_resource(db.db_list, '/api/db_list')
api.add_resource(db.tb_list, '/api/tb/<tb_name>')
@app.route('/')
def home_page():
    return render_template('index.html') 
if __name__ == '__main__':
	model.init('sqlite:///paudm_db.db')
	model.recreate()
	app.run(debug=True) 