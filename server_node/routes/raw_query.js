"use strict";

var q = require('q');
var db = require('../db');
var config = require('../config');



module.exports.raw_query = function(req, res)
	{

	
	var command = req.query.command;
	console.log(req.query.fields);
	query(command).then(function(val) 
		{
			res.send(val);
		});  
	
	};
	
	
// strucutred query
function query(text)
	{  
		var deferred = q.defer();
		db.client_pau.raw(text).then  
		(
			function(resp) 
			{
				if (config.job.client === "pg"){
					console.log(resp);
					deferred.resolve(resp.rows);
					}
				else {
					console.log(resp[0]);
					deferred.resolve(resp[0]);					
					}
			}, 
			function(err) 
			{
				console.log(err.message);
			}
		); 
	return deferred.promise;
	}  	