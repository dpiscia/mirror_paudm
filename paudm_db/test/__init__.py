from paudm_db import app, model

model.init('sqlite:///prova.db')
model.recreate()
test_app = app.app.test_client()
model.session.add((model.User("prova@gmail.com","Piscia","pssw",1,1)))
model.session.commit()
	
def teardown():
	print "TearDown"
	model.metadata.drop_all()