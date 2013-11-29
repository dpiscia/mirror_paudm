"use strict";

var q = require('q');
var db = require('../db');
var config = require('../config');


//api/str_query/:table/:fields/:clauses/:limit
module.exports.structure_query = function(req, res)
	{
	console.log(req.params.table);
	var table = req.params.table;
	console.log(req.params.fields);
	var fields = req.params.fields;
	console.log(req.params.clauses);
	var clauses= req.params.clauses;
	if (clauses == null) clauses = "" 
	else clauses = req.params.clauses.split(',');
	console.log(clauses);
	//if (clauses == null) clauses = ""
	console.log("clauses "+clauses);
	var limit = req.params.limit;
	var command = "select "+fields+" from "+table;
	console.log(clauses.length);
	for (var i=0; i < clauses.length; i++)
		{
		if (i===0) command = command+" where ";
		command = command+" "+clauses[i];
		}
	command = command+" limit "+limit;
	console.log(command);
	query(command).then(function(val) 
		{
			res.send(val.rows);
		});  
	
	};
	
	
// strucutred query
function query(text)
	{  
		var deferred = q.defer();
		db.client_job.raw(text).then  
		(
			function(resp) 
			{
				
				deferred.resolve(resp);
			}, 
			function(err) 
			{
				console.log(err.message);
			}
		); 
	return deferred.promise;
	}  	
	
	

	