'use strict';

/* Controllers */

angular.module('login.controllers', ['config'])
	.controller('login_ctrl', [ '$scope','$http','user_auth','$location', function ($scope, $http, user_auth, $location) {
   		$scope.myFunc =  function(name){
   			console.log("pressed");
   			
   			user_auth.login(name.name.$modelValue,name.psw.$modelValue).then(
   			function(data){console.log("ok works");
   			$location.path('/db_schema/plot')}, 
   			function(err){
   				console.log(err);
   				$scope.error = err;
   				}
   			);
   			
   		}
   		$scope.to_register = function()
   		{
   		$location.path('/register');
   		}
   		
}]);