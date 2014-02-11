'use strict';
/* jshint -W030 */
/**
 * Module dependencies
 */

var express = require('express'),
  
  api_jobs = require('./routes/jobs'),
  api_strc_query = require('./routes/strc_query'),
  api_raw_query = require('./routes/raw_query'),
  path = require('path'),
  cors = require('cors'),
  flash = require('connect-flash'),
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  uuid = require('node-uuid'),
  expressValidator = require('express-validator'),
  connect_restreamer = require('connect-restreamer'),
  httpProxy = require('http-proxy');

var app = module.exports = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var db = require('./db');
var security = require('./security');
var register = require('./routes/register');
var config = require('./config');
if (config.session_store) {
	var RedisStore = require("connect-redis")(express);
	var redis = require("redis").createClient();
}
/**
 * Configuration
 */

//local configuration, in production the fornt end server will handle the proxy 
var proxy = httpProxy.createServer({});

proxy.listen(8005);

//
// Listen for the `error` event on `proxy`.
proxy.on('error', function (err, req, res) {
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });

  res.end('Something went wrong. And we are reporting a custom error message.');
});


//configuration of the environment
// all environments
app.set('port', process.env.PORT || config.port);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.bodyParser());
//app.use(cors());
app.use(expressValidator());
app.use(connect_restreamer());
app.use(express.methodOverride());

var session_config = { secret: 'keyboard cat' };

if (config.session_store) { 
			console.log("enabled redis stored backend");
			session_config['store'] = new RedisStore({ host: config.redis.host, port: config.redis.port, client: redis } ); 
			}
app.use(express.session(session_config));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
app.use(flash());
app.use(passport.initialize());
app.use(express.static(path.join(__dirname, '../clients/client_paudm/src')));
app.use(express.static(path.join(__dirname, '../clients/client_cosmohub/src')));
app.use('/common_modules', express.static(path.join(__dirname, '../clients/client_common')));
app.use('/security', express.static(path.join(__dirname, '../clients/security_module')));
app.use('/lib', express.static(path.join(__dirname, '../clients/client_lib')));
app.use('/css', express.static(path.join(__dirname, '../clients/css')));
app.use(app.router);


db.connectDatabase(config);
     // Socket.io Communication
  // Sync work only with two-phases commit disabled in postgresql
if (config.sync){
	io.sockets.on('connection', require('./routes/socket'));
}

// development only
if (app.get('env') === 'development') {
  app.use(express.errorHandler());
}

// production only
if (app.get('env') === 'production') {
  // TODO
}


/**
 * Routes
 */

// serve index and view partials

//proxy route
app.get('/api_python/tb/:table',security.ensureAuthenticated,function(req,res){proxy.web(req, res, { target: config.api_python.host+':'+config.api_python.port })});
app.get('/api_python/db_list',security.ensureAuthenticated,function(req,res){proxy.web(req, res,{ target: config.api_python.host+':'+config.api_python.port })});

app.get('/api_python/groups',security.ensureAuthenticated,function(req,res){proxy.web(req, res,{ target: config.api_python.host+':'+config.api_python.port })});
app.get('/api_python_public/groups',function(req,res){proxy.web(req, res,{ target: config.api_python.host+':'+config.api_python.port })});

app.get('/api_python/user',security.ensureAuthenticated,function(req,res){proxy.web(req, res,{ target: config.api_python.host+':'+config.api_python.port })});
app.delete('/api_python/user',security.ensureAuthenticated,function(req,res){proxy.web(req, res,{ target: config.api_python.host+':'+config.api_python.port })});
app.put('/api_python/user',security.ensureAuthenticated,function(req,res){proxy.web(req, res,{ target: config.api_python.host+':'+config.api_python.port })});

app.get('/api_python/catalogs',security.ensureAuthenticated,function(req,res){proxy.web(req, res,{ target: config.api_python.host+':'+config.api_python.port })});
app.get('/api_python/catalog/:Name',security.ensureAuthenticated,function(req,res){proxy.web(req, res,{ target: config.api_python.host+':'+config.api_python.port })});

app.get('/api_python/jobs',security.ensureAuthenticated,function(req,res){proxy.web(req, res,{ target: config.api_python.host+':'+config.api_python.port })});

app.post('/api_python/check_query',function(req,res){proxy.web(req, res,{ target: config.api_python.host+':'+config.api_python.port })});
app.post('/api_python/query',security.ensureAuthenticated,function(req,res){proxy.web(req, res,{ target: config.api_python.host+':'+config.api_python.port })});
// Jobs API
app.get('/api_node/jobs/:id',security.ensureAuthenticated,  api_jobs.list);
app.get('/api_node/jobs/:id/:all',security.ensureAuthenticated, api_jobs.list);
app.get('/api_node/jobs',api_jobs.list);
app.get('/api_node/qc/:id',security.ensureAuthenticated, api_jobs.qc_list);
app.get('/api_node/prods', security.ensureAuthenticated,api_jobs.prod_list);
//app.get('/api_node/jobs/prod/:id', security.ensureAuthenticated, api_jobs.job_prod_list);
// redirect all others to the index (HTML5 history)

//structured query API

app.get('/api_node/strc_query',security.ensureAuthenticated, api_strc_query.structure_query)

//raw query



app.get('/api_node/raw_query',security.ensureAuthenticated, api_raw_query.raw_query)

//login/logout/register points

app.post('/api_node/logout',register.logout);
app.post('/api_node/register',register.register);
app.post('/signup/check/username',register.check_username);
app.post('/api_node/login', register.login);



/**
 * Start Server
 */

server.listen(app.get('port'), '0.0.0.0', 511, function () {
  console.log('Express server listening on port ' + app.get('port'));
  /*var open = require('open');
  open('http://localhost:' + app.get('port') + '/');*/
});
