'use strict';

/* Controllers */

angular.module('register.controllers',['ui.bootstrap'])
	.controller('register_ctrl', [ '$scope','groups','user_auth','$location', function ($scope, groups, user_auth, $location) {
   		$scope.groups = groups.groups;
   		$scope.groups_sel = [];
   		$scope.groups_btn = groups.groups.map(function(x,i){ return false;});
   		$scope.myFunc =  function(name){
   			console.log("pressed");
   			$scope.groups_btn.map(function(x,index){if (x != 'undefined' && x ==true)  $scope.groups_sel.push($scope.groups[index]);})
   			user_auth.register(name.name.$modelValue,name.email.$modelValue, name.password.$modelValue, name.verification.$modelValue, $scope.groups_sel).then(
   			function(data){
   				console.log("ok works");
   				$scope.success = "Welcome "+ name.email.$modelValue;
   				$scope.error = "";
   			}, 
   			function(err){
   				console.log(err);
   				$scope.error = err.error;
   				$scope.success = "";
   				}
   			);
   			console.log("qua");
   			}
   		$scope.to_login = function()	{
   			$location.path('/login');
   			}
   		
}]);