Documentation
=============

This is the python web service implementation, it provides some RESTFUL apis.
It is implemented on top of PYRAMID web framework, and it uses CORNICE to implement RESTFUL services.

it offers two apis:

1. api_python/db_list tb_list 

Based on the URL provided in api_python.ini it retrieves the DB schema, tables and relationships

to test 


curl localhost:port\api_python\tb_list 



2 api_pyhton/tb/{table} 

Based on table_name it provides columns and indexes of this table


curl localhost:port\api_python\tb\{table_name}