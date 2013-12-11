from setuptools import setup, find_packages

setup(
    name='paudm_db',
    version='1.0',
    long_description=__doc__,
    packages=['paudm_db', 'paudm_db.api', 'paudm_db.test'],
    include_package_data=True,
    zip_safe=False,
    install_requires=['pyramid','cornice','Flask', 'Flask-restful', 'sqlalchemy','nose','six']
)
