'use strict';

/* Controllers */

angular.module('login.controllers', ['config'])
	.controller('login_ctrl', [ '$scope','$http', function db_schema($scope,$http) {
   		$scope.email = "ddddd";
   		$scope.myFunc =  function(name){
   			console.log("pressed");
   			$http.post('http://localhost:3000/login', { username: 'davide@123.it', password: '1234' }).success(function(data){
   			console.log(data);
   			console.log("OK");})
   			.error(function(){console.log("error");});
   			
   			};
}]);