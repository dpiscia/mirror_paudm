/*
 * Serve JSON to our AngularJS client
 */



/*
 * GET users listing.
 */
"use strict";
/* jshint -W098 */
/* jshint -W003 */
var q = require('q');
var db = require('../db');
var security = require('../security');
var passport = require('passport');
var uuid = require('node-uuid');
var passwordHash = require('password-hash');

//jobs rest api
security.strategy;

module.exports.register = function(req, res){
	var name = req.body.name;
	var surname = req.body.surname;
	var email = req.body.email;
	var password = req.body.password;
	var verification = req.body.verification;
	var error = null;
	// regexp from https://github.com/angular/angular.js/blob/master/src/ng/directive/input.js#L4
	var EMAIL_REGEXP = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/;
	// check for valid inputs
	if (!name || !email || !password || !verification || !surname) {
	  error = 'All fields are required';
	} else if (name !== encodeURIComponent(name)) {
	  error = 'name may not contain any non-url-safe characters';
	} else if (!email.match(EMAIL_REGEXP)) {
	  error = 'Email is invalid';
	} else if (password !== verification) {
	  error = 'Passwords don\'t match';
	}
	
	if (error) {
	  res.status(403);
	  res.json({error : error});
	  return res;
	}
	// for fully featured example check duplicate email, send verification link and save user to db	
	// create salt and hash password
	var hashedPassword = passwordHash.generate(password);
	console.log("hashed paasa : "+passwordHash.verify(password, hashedPassword));
	console.log("password is "+password );
 	db.client_pau('user').insert({email : email, name : name, surname : surname, 'password' : hashedPassword, 'permissions' : 1, 'validated' : true}).then(
        	function(resp) {
                        console.log(resp);
                        res.json(200, email);
                        return res;
                                }, 
       		function(err) { 
       			console.log(err);
				res.status(403);
				res.json({error : err.clientError});
	  			return res;
		});	
	  
	
	

 };

module.exports.check_username = function(req, res) {
  var username = req.body.username;
  // check if username contains non-url-safe characters
  if (username !== encodeURIComponent(username)) {
    res.json(403, {
      invalidChars: true
    });
    return;
  }
  // check if username is already taken - query your db here
  var usernameTaken = false;
  for (var i = 0; i < dummyDb.length; i++) {
    if (dummyDb[i].username === username) {
      usernameTaken = true;
      break;
    }
  }
  if (usernameTaken) {
    res.json(403, {
      isTaken: true
    });
    return
  }
  // looks like everything is fine
  res.send(200);
};





module.exports.logout =  function(req, res){
  console.log("on logout");
  
  security.findById(req.headers.user_id,req.headers.apikey).then(
  		function(data) {
  		console.log("cookie "+res.cookies);
	  	console.log("api_key ok");
	  	
	  	return res.json( {message :"OK"}) },
	  	function(err){
		  	console.log("error");
		  	return res.send(500, "not found");
	  	} )
  
};

module.exports.login = function(req, res, next) {
	console.log("entra login");
	passport.authenticate('local',{ session: false }, function(err, user, info) {
	    if (err) { return res.send(500, info); }
	    if (!user) { return res.send(500, info); }
    	req.logIn(user, function(err) {
      		if (err) { return res.send(500, info);  }
    	var api_key = uuid();
		var user_id = user.id;
		security.set_users(api_key,user_id, 2);//todo : add callback if something wrong
		res.json( {api_key : api_key, role : 2 , id: user_id}) ;
		return res;
    	});
  	})(req, res, next)};