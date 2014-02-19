#! /usr/bin/env python
# -*- coding: utf-8 -*-

from __future__ import absolute_import 
import gfal2
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
from pyramid.response import FileResponse, FileIter

from server_python.lib.helpers import _create_token, valid_token, _USERS




single_catalog = Service(name='single_catalog', path='/api_python/catalog/{catalog}', description="single catalog full detail info")
catalogs_list_user  = Service(name='catalogs_group_list', path='/api_python/catalogs', description="list of catalogs by user")
readme_download  = Service(name='catalogs download readme', path='/api_python/download_readme/{id}', description="download readme")
prebuilt_download  = Service(name='prebuilts download readme', path='/api_python/download_prebuilt/{id}', description="download prebuilt")
query_download  = Service(name='query download ', path='/api_python/download_query/{id}', description="download batch query")   


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
	    dl_catalog.append({'name' : prebuilt.name, 'description' : prebuilt.description , 'size' : prebuilt.size, 'cat_download' : '/api_python/download_prebuilt/'+str(prebuilt.id), 'readme_download' : '/api_python/download_readme/'+str(prebuilt.id)})
	
	
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
    

@readme_download.get(validators=valid_token)
def readme(request):
    #import ipdb; ipdb.set_trace()
    prebuilt = request.db.query(model.Prebuilt).get(request.matchdict['id'])
    if not prebuilt:
        raise HTTPNotFound()
    if prebuilt.catalog.groups and not prebuilt.catalog.groups & request.user.groups:
        raise HTTPForbidden()
    
    filepath = os.path.join('dcap://dcap.pic.es:22125', prebuilt.path_readme)
    
    import gfal2
    mc = gfal2.creat_context()
    fd = mc.open(str(filepath), 'r')
    
    response = request.response
    
    response.app_iter = FileIter(fd)
    response.content_length = os.path.getsize(os.path.join('/', prebuilt.path_readme))
    response.content_type='text/plain'
    
    return response
    
@prebuilt_download.get(validators=valid_token)  
def prebuilt(request):
    prebuilt = request.db.query(model.Prebuilt).get(request.matchdict['id'])
    if not prebuilt:
        raise HTTPNotFound()
    if prebuilt.catalog.groups and not prebuilt.catalog.groups & request.user.groups:
        raise HTTPForbidden()
    
    filepath = os.path.join('dcap://dcap.pic.es:22125', prebuilt.path_catalog)
    
    import gfal2
    mc = gfal2.creat_context()
    fd = mc.open(str(filepath), 'r')
    
    response = request.response
    
    response.app_iter = FileIter(fd)
    response.content_length = os.path.getsize(os.path.join('/', prebuilt.path_catalog))
    response.content_type='application/octet-stream'
    response.content_disposition = 'attachment; filename=%s' % os.path.basename(filepath)
    
    return response
    
@query_download.get(validators=valid_token)  
def query(request):
    query = request.db.query(model.Query).get(request.matchdict['id'])
    if not query:
        raise HTTPNotFound()
    if request.user != query.user:
        raise HTTPForbidden()
    
    filepath = os.path.join('dcap://dcap.pic.es:22125', query.path)
    
    import gfal2
    mc = gfal2.creat_context()
    fd = mc.open(str(filepath), 'r')
    
    response = request.response
    
    response.app_iter = FileIter(fd)
    response.content_length = os.path.getsize(os.path.join('/', query.path))
    response.content_type='application/octet-stream'
    response.content_disposition = 'attachment; filename=%s' % os.path.basename(filepath)
    
    return response