from paudm_db import app, model

model.init('sqlite:///test.sql')
model.recreate()
test_app = app.app.test_client()

def teardown():
	model.metadata.drop_all()