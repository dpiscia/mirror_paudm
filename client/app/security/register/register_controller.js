'use strict';

/* Controllers */

angular.module('register.controllers', ['config'])
	.controller('register_ctrl', [ '$scope','$http','user_auth','$location', function ($scope, $http, user_auth, $location) {
   		
   		$scope.myFunc =  function(name){
   			console.log("pressed");
   			
   			user_auth.register(name.name.$modelValue,name.email.$modelValue, name.surname.$modelValue, name.password.$modelValue, name.verification.$modelValue).then(
   			function(data){
   				console.log("ok works");
   				$scope.success = "Welcome "+ name.email.$modelValue;
   			}, 
   			function(err){
   				console.log(err);
   				$scope.error = err.error;
   				}
   			);
   			console.log("qua");
   			}
   		$scope.to_login = function()	{
   			$location.path('/login');
   			}
   		
}]);