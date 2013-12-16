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
  expressValidator = require('express-validator');

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
 

// all environments
app.set('port', process.env.PORT || config.port);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(cors());
app.use(expressValidator());
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
app.use(passport.session());
app.use(express.static(path.join(__dirname, '../client/app')));
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



// Jobs API
app.get('/api_node/jobs/:id',  api_jobs.list);
app.get('/api_node/jobs/:id/:all', api_jobs.list);
app.get('/api_node/jobs', api_jobs.list);
app.get('/api_node/qc/:id', api_jobs.qc_list);
app.get('/api_node/prods', api_jobs.prod_list);
app.get('/api_node/prods', api_jobs.prod_list);
//app.get('/api_node/jobs/prod/:id', api_jobs.job_prod_list);
// redirect all others to the index (HTML5 history)

//structured query API
//api/str_query?table&fields&clauses&limit

app.get('/api_node/strc_query',api_strc_query.structure_query)

//raw query



app.get('/api_node/raw_query',api_raw_query.raw_query)
security.strategy;
//login/logout/register points
app.get('/login', register.login_get);
app.get('/logout',register.logout_get);
app.get('/register', register.reg_get);
//app.post('/api_node/login', passport.authenticate('basic', { session: false }), register.login_post);
app.get('/api_node/login',  /*passport.authenticate('basic', { session: false }),*/
  function(req, res) {
   console.log(res);
    res.json({ username: req.user.username, email: req.user.email });
  });
app.post('/api_node/login',
  function(req, res) {
   console.log(req.body);
   passport.authenticate('local', { session: false ,successRedirect: '/'})
    res.send({ username: req.body.username, email: req.body.email });
  });
app.post('/register',register.reg_post);

app.post('/login',
passport.authenticate('davide', { failureRedirect: '/login', failureFlash: true }), register.login_post);
/**
 * Start Server
 */

server.listen(app.get('port'), 'localhost', 511, function () {
  console.log('Express server listening on port ' + app.get('port'));
  /*var open = require('open');
  open('http://localhost:' + app.get('port') + '/');*/
});
