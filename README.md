This the PAU data management web application, its functionalities are:

1-  Monitor jobs status (operation status and quality control status)
2-  Database schema exploration
3-  Dabase data exploration (Table and plot(scatter plot))
4- To be implemented (API brownthrower interaaction)

TO GET STARTED:

The backend services are implmented in Pyramid (Python, thread based application) 
and Express.js (Node.js, single process not blocking Input/Output application).

Prerequisites:

Python language >= 2.6
Node.js >= 0.8
git

1- Installation

```javascript
git clone git@gitlab01.pic.es:pau/paudm_web.git
cd paudm_web
```

1-A node.js server

```javascript
cd server_node
// install all npm packages defined in file packages.json
npm install
```

Now database connections have to be configured
Edit config file

```javascript
var config = {}
//if postgresql use the below config scheme
config.job = {client : "pg" , host : "localhost", user : "username" ,port : 5432, password : 'secret', name : 'db_name'}

config.job = {client : "pg" , host : "localhost", user : "username" ,port : 5432, password : 'secret', name : 'db_name'}
//if sqlite use the scheme belowe
//config.job = {client : "sqlite3", name : "/Users/username/.sqlite/bt.db"};
//config.pau = {client : "sqlite3", name : "/Users/username/.sqlite/paudm.db"};

//Redis configuration
config.session_store = false;
config.port = 3000;
config.redis = {port :6379, host : 'localhost'};
config.sync = false; //disabled if postgresql is used with two phases transacti$


module.exports = config;

```

Once you are done with config, you can check if it works by typing:

```javascript
node server.js
```

1-B Python server
create and activate a virtualenv then
go to api_python folder and install setup.pt

```python
python setup.py install
```

configure the file api_python.ini in this way:

```python

[app:main]
use = egg:api_python

pyramid.reload_templates = true
pyramid.debug_authorization = false
pyramid.debug_notfound = false
pyramid.debug_routematch = false
pyramid.debug_templates = true
pyramid.default_locale_name = en
sqlalchemy.url = postgresql://username:password@host:port/db_name
web_app.url = absolute url pointo to ../client/app (ex. /home/username/paudm_db/client/app)
[server:main]
use = egg:waitress#main

host = 0.0.0.0
port = 6542

# Begin logging configuration

[loggers]
keys = root, api_python

[handlers]
keys = console

[formatters]
keys = generic

[logger_root]
level = INFO
handlers = console

[logger_api_python]
level = DEBUG
handlers =
qualname = api_python

[handler_console]
class = StreamHandler
args = (sys.stderr,)
level = NOTSET
formatter = generic

[formatter_generic]
format = %(asctime)s %(levelname)-5.5s [%(name)s][%(threadName)s] %(message)s

# End logging configuration
```

check if it works:
```python
pserve api_python.ini
```

1-C Client app

go to folder client

```javascript
npm install
```
to prepare local environment
```javascript
grunt development
```