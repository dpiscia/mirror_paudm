'use strict';

/* Controllers */

angular.module('login.controllers', ['config'])
	.controller('login_ctrl', [ '$scope','$http','user_auth','$location', function db_schema($scope, $http, user_auth, $location) {
   		$scope.email = "ddddd";
   		$scope.myFunc =  function(name){
   			console.log("pressed");
   			
   			/*$http.post('http://localhost:3000/login', { username: 'davidepi79@gmail.com', password: '1234' }).success(function(data){
   			console.log(data);
   			console.log("OK");
   			user_auth.set_role('dfs','dsads','dads');
   			})
   			.error(function(data){
   				console.log(data);
   				console.log("error");});
   			
   			};*/
   			user_auth.login(name.name.$modelValue,name.psw.$modelValue).then(
   			function(data){console.log("ok works");
   			$location.path('/db_schema/plot')}, 
   			function(err){console.log(err)}
   			);
   			console.log("qua");
   			}
   		
}]);