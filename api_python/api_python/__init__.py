"""Main entry point
"""
from pyramid.config import Configurator
from sqlalchemy import inspect, create_engine




def main(global_config, **settings):
    config = Configurator(settings=settings)
    config.include("cornice")
    config.scan("api_python.views")
    #config.add_static_view(name='', path=settings['web_app.url'])
    db(settings)
    return config.make_wsgi_app()


     
def db(settings):
        print settings
        db_url = settings['sqlalchemy.url']
        engine = create_engine(db_url)
        global insp 
        insp = inspect(engine)

        

     
 	
