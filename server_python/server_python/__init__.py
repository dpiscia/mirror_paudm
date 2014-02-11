#!/usr/bin/env python
'''
Created on Oct 26, 2012

@author: rodriguez
'''

import byteformat
import json
import model
import sqlalchemy
import transaction
import version


from ordereddict import OrderedDict
from pyramid.config import Configurator
from pyramid.authentication import AuthTktAuthenticationPolicy
from pyramid.authorization import ACLAuthorizationPolicy
from pyramid_beaker import session_factory_from_settings
from pyramid.events import subscriber
from pyramid.events import BeforeRender, NewRequest
from security import RootFactory
from sqlalchemy.orm import scoped_session, sessionmaker
from zope.sqlalchemy import ZopeTransactionExtension

def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    
    # Setup model and create initial structure if required
    init_db(settings)
    
    # Load the catalog structure on app initialization
    reflect_db(settings)
    
    # Create a Pyramid session factory    
    session_factory = session_factory_from_settings(settings)
    

    
    # Configurator
    config = Configurator(settings=settings, 
                          root_factory='server_python.security.RootFactory',
                          session_factory=session_factory) # register session factory with Pyramid
    #Configurator.set_default_permission()
    config.include("cornice")
    # Static views (css, js, jpg, ...)
    config.scan()

    #config.add_static_view('', '/opt/dpiscia/catalog/catalog.web/catalog/web/client/app', cache_max_age=3600)
    #Ddon't know why url in this should be absolute
    # User/Profile
    #nt

    
    
    
    
    return config.make_wsgi_app()

def init_db(settings):
    # TODO: Add logging
    # Create DB structure if needed
    engine = sqlalchemy.engine_from_config(settings)
    model.Base.metadata.bind = engine
    model.Base.metadata.create_all() #@UndefinedVariable
    
    # Configure model
    prefix = 'model.'
    model.settings = dict(
       (key[len(prefix):], value)
       for key, value in settings.iteritems()
       if key.startswith(prefix)
    )
    
    # Store session_maker
    session_maker = scoped_session(sessionmaker(bind=engine, extension=ZopeTransactionExtension()))
    settings['model.session_maker'] = session_maker
    
    # TODO: I would remove filter by admin, otherwise can crash when a normal user runs the server
    # Only create initial user if there is no other ADMIN user
    session = session_maker()
    if not session.query(model.User).filter_by(is_admin = True).first():
        user = model.User(
            email    = settings['initial_user.email'],
            name     = settings['initial_user.name'].decode('utf-8'),
            password = settings['initial_user.password'],
            enabled  = True,
            is_admin = True,
        )
        session.add(user)
    
    transaction.commit()

def reflect_db(settings):
    # TODO: Add logging
    columns = {}
    indexes = {}
    
    session = settings['model.session_maker']()
    insp = model.reflection.Inspector.from_engine(session.connection())
    settings['model.insp'] = insp
    catalogs = session.query(model.Catalog)
    
    for catalog in catalogs:
        columns[catalog.table] = OrderedDict(
            (column['name'], column)
            for column in insp.get_columns(catalog.table)
        )
        indexes[catalog.table] = dict(
            (index['name'], index)
            for index in insp.get_indexes(catalog.table)
        )
        if catalog.view:
            columns[catalog.view] = OrderedDict(
                (column['name'], column)
                for column in insp.get_columns(catalog.view)
            )
            indexes[catalog.view] = dict(
                (index['name'], index)
                for index in insp.get_indexes(catalog.table)
                # Do not add superset indexes
                if set(index['column_names']) <= set(columns[catalog.view].keys())
            )
    
    settings['reflection.columns'] = columns
    settings['reflection.indexes'] = indexes

@subscriber(NewRequest)
def open_db_session(event):
    # create a new session instance
    event.request.db = event.request.registry.settings['model.session_maker']()

@subscriber(BeforeRender)
def before_render(event):
    settings = event['request'].registry.settings
    event['max_queries'] = int(settings['catalog.user.max_queries'])
    event['humanize'] = lambda size: byteformat.format(size, scheme='BINARY')
    event['__version__'] = version.__version__
