import jsondate as json
import psycopg2
import psycopg2.extras
import threading
import yaml
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
import datetime
from task import create_catalog
from brownthrower.interface import constants

import brownthrower.api

run_query  = Service(name='catalog_query', path='api_python/query', description="raw query against catalog")
check_query  = Service(name='check_query', path='api_python/check_query', description="raw query against catalog")
batch_query  = Service(name='batch query', path='api_python/batch_query', description="run a batch query through bt")


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
    
    
@batch_query.post(validators=valid_token)
def batch_query_put(request):
	try:
		import ipdb; ipdb.set_trace()
		#to be added file_format = form_data['file_format']
		file_format = 'csv'
		sql = query = request.json_body['query']
		task_config = yaml.safe_load(brownthrower.api.task.get_dataset('config', 'sample')(create_catalog.create_catalog_from_query))
		task_config.update({'format' : file_format})  
		task_config.update({'db_url' : request.registry.settings['sqlalchemy.url']})
		query = model.Query(
		    task      = create_catalog.create_catalog_from_query.name,
		    config    = yaml.safe_dump(task_config),
		    status    = constants.JobStatus.QUEUED,
		    user      = request.user,
		    email     = request.user.email,
		    sql       = sql,
		    ts_queued = datetime.datetime.now(),
		)
		request.db.add(query)
		request.db.flush()		
		prefix = 'catalog.task.'
		with query.as_dict('config') as cfg:
		    cfg.update(dict(
		        (key[len(prefix):], value)
		        for key, value in request.registry.settings.iteritems()
		        if key.startswith(prefix)
		    ))
		    cfg['http_url'] = 'download_query/'+str(query.id)
            
		message= 'valid_box;Your query has been sent to the queue. You can follow the status of your pending queries in the left panel. You will receive the results at your e-mail address once the catalog is generated.'
	except Exception:
		request.session.flash(u'error_box;Query failed')
		transaction.doom()
	finally:
		return {'message': message}