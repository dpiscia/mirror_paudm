import jsondate as json
import psycopg2
import psycopg2.extras
import threading
from urlparse import urlparse
from sqlalchemy import create_engine
from sqlalchemy.exc import DBAPIError
from pyramid.httpexceptions import HTTPFound
from pyramid.view import view_config
from cornice import Service
from psycopg2.extensions import QueryCanceledError
from server_python.lib.security.api import generate_user_pwd_context, get_mapped_array, get_group_mapped
from server_python.lib.helpers import _create_token, valid_token, _USERS
from server_python import model

run_query  = Service(name='catalog_query', path='api_python/query', description="raw query against catalog")
check_query  = Service(name='check_query', path='api_python/check_query', description="raw query against catalog")

@run_query.post(validators=valid_token)
def post(request):

	user_id = request.validated['user_id']
	query = request.json_body['query']
	groups = request.db.query(model.Group).order_by(model.Group.name).filter(model.User.id == user_id).order_by(model.Group.id).all()
   
   
	
	def changed_user(groups,request):

		context_user, context_password = generate_user_pwd_context(get_mapped_array(groups,get_group_mapped(request.db)), request.db,'prova')
		url = urlparse(request.registry.settings['sqlalchemy.url'])
		conn_string = "host="+url.hostname+" port="+str(url.port)+" dbname="+url.path.replace('/', '')+" user="+context_user+" password="+context_password+" options = '-c statement_timeout=1000' "
		return psycopg2.connect(conn_string)

	conn = changed_user(groups,request)
	cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
	seconds = 1
	t = threading.Timer(seconds, conn.cancel)
	t.start()
	try:
            #cursor.execute("select pg_sleep(0.9)")
             cursor.execute(query+' ;')



	except DBAPIError, e:
		print "timeoute error"
		error = 'Query was cancelled, because it exceeded maximum time available for realtime query'
		request.response.status = 400
		return {'message' :error}
            
	except QueryCanceledError, e:
		print "timeout error"
		error = 'Timeout;'+e[0]
		request.response.status = 400
		return {'message' :error}
	except Exception , e:
		print e
		error =  e[0]
		request.response.status = 400
		return {'message' :error}

            	
    	
	t.cancel()
	records = cursor.fetchall()
	records.insert(0,[key for key in records[0].keys()])

   
	conn.close()    
    

	return {
        'result' : json.dumps(records)
        
     }
 
@check_query.post(validators=valid_token)
def post(request):


	user_id = request.validated['user_id']
	
	
	
	query = request.json_body['query']
	
	result = []
	try:
		db_result = request.db.execute('explain '+query+' ;')
	
	except Exception , e:
		print e
		request.response.status = 400
		return {'message' : e.orig[0]}
	#print request.db.execute(query).keys()
	
		
	for row in db_result.fetchall():
	    for col in row:
	    	result.append(json.dumps(col))
	return {
	    'result' : result
        
    }