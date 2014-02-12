'use strict';

/* Controllers */

angular.module('login.controllers', ['paudm.user_auth','ui.bootstrap'])
	.controller('login_ctrl', [ '$scope','$http','user_auth','$location', function ($scope, $http, user_auth, $location) {
		$scope.rememberme = false;
   		$scope.myFunc =  function(name){
   			console.log("pressed");
   			
   			user_auth.login(name.name.$modelValue,name.psw.$modelValue, $scope.rememberme).then(
   			function(data){console.log("ok works");
   			$location.path('/home')}, 
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