#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os

from setuptools import setup, find_packages

requires = [
    'brownthrower',
    'byteformat',
    'mailer',
]

# Read README and CHANGES files for the long description
here = os.path.abspath(os.path.dirname(__file__))
README  = open(os.path.join(here, 'README.txt')).read()

# Read the version information
execfile(os.path.join(here,'task', 'version.py'))

setup(name='catalog.task',
    version=__version__,
    description='PIC catalog distribution task',
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
    keywords='',
    packages=find_packages(),
    include_package_data=True,
    zip_safe=False,
    install_requires=requires,
    tests_require=requires,
    entry_points = {
        'brownthrower.task': [
            # catalog
            'task01 = catalog.task.create_catalog:create_catalog_from_query',
        ],
    }
    )

