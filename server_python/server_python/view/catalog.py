#! /usr/bin/env python
# -*- coding: utf-8 -*-

from __future__ import absolute_import 

import brownthrower.api
import datetime
import os
import peppercorn
import textwrap
import transaction
import yaml
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

from brownthrower.interface import constants
from server_python import model
from catalog.task import create_catalog
from server_python.lib.security.api import generate_user_pwd_context, get_mapped_array, get_group_mapped


from server_python.lib.helpers import _create_token, valid_token, _USERS




single_catalog = Service(name='single_catalog', path='/api_python/catalog/{catalog}', description="single catalog full detail info")
catalogs_list_user  = Service(name='catalogs_group_list', path='api_python/catalogs', description="list of catalogs by user")
run_query  = Service(name='catalog_query', path='api_pyhton/query', description="raw query against catalog")
check_query  = Service(name='check_query', path='api_python/check_query', description="raw query against catalog")
    


@single_catalog.get(validators=valid_token)
def get(request):
	#check if it has permissions
	user_id = request.validated['user_id']
	# Retrieve public catalogs
	
	catalog = request.db.query(model.Catalog).filter_by(
	    name = request.matchdict['catalog']
	).options(model.eagerload(model.Catalog.prebuilts)).one()
	
	# Ensure the user can query this catalog
	#if catalog.groups and not catalog.groups & request.user.groups:
	#    raise HTTPForbidden()
	
	
	dict = {'name' : catalog.name, 'description' : catalog.description,  'table' : catalog.table, 'view' : catalog.view ,'version' : catalog.version}
	columns = []
	for column in request.registry.settings['reflection.columns'][catalog.from_clause]:
	   columns.append(column)
	indexes = request.registry.settings['reflection.indexes'][catalog.from_clause]
	dl_catalog = []
	for prebuilt in catalog.prebuilts:
	    dl_catalog.append({'name' : prebuilt.name, 'description' : prebuilt.description , 'size' : prebuilt.size, 'cat_download' : 'download.prebuilt', 'readme_download' : 'download.readme'})
	
	
	return {
	    'catalog' : dict,
	    'columns'     : columns,
	    'index'       : indexes[sorted(indexes.keys())[0]], # Pick the first one, alphabetically
	    'dl_catalog'  : dl_catalog,
        
    }
 
@catalogs_list_user.get(validators=valid_token)
def get(request):
	user_id = request.validated['user_id']

	
	    # Append restricted access catalogs

	groups = request.db.query(model.Group).select_from(model.User).join(model.User.groups).filter(model.User.id == user_id).all()    
	dict = []
	for group in groups:
		for catalog in group.catalogs:
			
			dict.append({'name' : catalog.name, 'description' : catalog.description,  'table' : catalog.table, 'view' : catalog.view ,'version' : catalog.version, 'public': True, 'type' : 'real', 'group' : group.name })
	#    catalog.url = request.route_url('catalog.query', catalog=catalog.name)
	
	return {
	    'catalogs' : dict,
	}   
    
    
@run_query.post(validators=valid_token)
def post(request):
   
	user = request.validated['user']
	query = request.body.replace('\n', ' ')
	groups = request.db.query(model.Group).order_by(model.Group.name).filter(model.User.email == user).order_by(model.Group.id).all()
   
   
	
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


	user = request.validated['user']
	
	
	#import pdb; pdb.set_trace();
	query = request.body.replace('\n', ' ')
	
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