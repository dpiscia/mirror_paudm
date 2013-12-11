"""Main entry point
"""
from pyramid.config import Configurator


def main(global_config, **settings):
    config = Configurator(settings=settings)
    config.include("cornice")
    config.scan("api_python.views")
    #config.add_static_view(name='', path='/Users/dpiscia/js_projects/paudm_db/client/app')
    return config.make_wsgi_app()
