from paudm_db import app, model

model.init('sqlite:///prova.db')
model.recreate()
test_app = app.app.test_client()

	
def teardown():
	print "TearDown"
	model.metadata.drop_all()