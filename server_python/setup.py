#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os

from setuptools import setup, find_packages

requires = [
    'brownthrower',
    'byteformat',
    'catalog.task',
    'mailer',
    'ordereddict',
    'peppercorn',
    'pyramid<1.4.999',
    'pyramid_beaker',
    'pyramid_debugtoolbar',
    'pyramid_mailer',
    'pyramid_simpleform',
    'pyramid_tm',
    'PyYAML',
    'SQLAlchemy',
    'waitress',
    'zope.sqlalchemy',
    'cornice',
    'colander',
    'jsondate',
]

# Read README and CHANGES files for the long description
here = os.path.abspath(os.path.dirname(__file__))
README  = open(os.path.join(here, 'README.txt')).read()

# Read the version information
execfile(os.path.join(here,  'server_python', 'version.py'))

setup(name='server_python',
    version=__version__,
    description='PIC catalog distribution web portal',
    long_description = README,
    classifiers=[
      "Programming Language :: Python",
      "Framework :: Pyramid",
      "Topic :: Internet :: WWW/HTTP",
      "Topic :: Internet :: WWW/HTTP :: WSGI :: Application",
      ],
    maintainer='Pau Tallada Crespí',
    maintainer_email='pau.tallada@gmail.com',
    #url='',
    keywords='web pyramid pylons',
    packages=find_packages(),
    include_package_data=True,
    zip_safe=False,
    install_requires=requires,
    tests_require=requires,
    entry_points="""\
    [paste.app_factory]
    main = server_python:main
    """,

)

