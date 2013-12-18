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
//jobs rest api
security.strategy;

module.exports.reg_post = function(req, res){
	console.log(req.body.email);
	req.assert('First_name', 'Name is required').notEmpty();           //Validate name
	req.assert('Last_name', 'Name is required').notEmpty();           //Validate name
    req.assert('email', 'A valid email is required').isEmail();  //Validate email
	req.assert('Password', '4 to 20 characters required').len(4, 20);
	
    var errors = req.validationErrors();  
    if( !errors){   //No errors were found.  Passed Validation!
	console.log("correct");
	
	db.client_pau('user').insert({'email' : req.body.email, 'name' : req.body.First_name, 'surname' : req.body.Last_name, 'password' : req.body.Password, 'permissions' : 1, 'validated' : true}).then(
	function(resp) {
			console.log(resp);
			res.render('register',{'message' : 'Registration OK'} );
				}, 
	function(err) { console.log(err);
			res.render('register',{'message' : 'DB error'} );
});
    //res.render('register',{'message' : errors.msg} );
    }
    else {   //Display errors to user
		console.log(errors);
		res.render('register',{'message' : 'Registration Error'} );
    }
 };

module.exports.logout =  function(req, res){
  console.log("on logout");
  
  security.findById(req.headers.user_id,req.headers.apikey).then(
  		function(data) {
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
		return res.json( {api_key : api_key, role : 2 , id: user_id}) 
    	});
  	})(req, res, next)};