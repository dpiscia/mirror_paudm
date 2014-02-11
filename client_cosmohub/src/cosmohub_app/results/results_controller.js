'use strict';

/* Controllers */

angular.module('results.controllers',['ui.bootstrap'])
	.controller('results_ctrl', [ '$scope','user_auth', function ($scope,  user_auth) {
   	console.log("results");
   	$scope.type = 'table';
   	$scope.showResult = true;
   	$scope.heads = function(dict){
   		var heads = [];
   		for (var key in dict) if (!(key.substring(0, 1) === '$' ))heads.push(key);
   		return heads;
   		}
   	
   		
}])