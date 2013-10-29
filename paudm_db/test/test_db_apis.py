import json
import nose
from nose.tools import *
from paudm_db.test import test_app

def check_content_type(headers):
  eq_(headers['Content-Type'], 'application/json')

def test_db_routes():
  rv = test_app.get('/api/db_list')
  check_content_type(rv.headers)
  resp = json.loads(rv.data)
  #import pdb; pdb.set_trace() 
  #make sure we get a response
  eq_(rv.status_code,200)
  #make sure tit gets one list
  eq_(len(resp), 19)
  
  

def test_db_ites_routes():
  rv = test_app.get('/api/tb/user')
  check_content_type(rv.headers)
  resp = json.loads(rv.data)
  #import pdb; pdb.set_trace() 
  #make sure we get a response
  eq_(rv.status_code,200)
  #make sure tit gets one list
  eq_(len(resp['list']), 7)
  
def test_db_ites_routes_empty():
  rv = test_app.get('/api/tb/production')
  check_content_type(rv.headers)
  resp = json.loads(rv.data)
  #import pdb; pdb.set_trace() 
  #make sure we get a response
  eq_(rv.status_code,200)
  #make sure tit gets one list
  
  eq_(len(resp['list']), 6)
  
    
if __name__ == '__main__':
   test_me()
  