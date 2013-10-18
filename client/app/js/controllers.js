'use strict';

/* Controllers */

angular.module('paudm_db.controllers', []).
  controller('MyCtrl1', ['$scope','db_list','$state', function MyCtrl1($scope, db_list, $state) {
  	db_list.query({}, function(data){
	//1.callback on d3.plot, in the future implement on promise
	//2. implement callback on failure
	$scope.db_list = data;
	
	console.log('success, got data: ');
	
	});
	console.log("ccc");
	$state.go('view1.list');
  }])
   .controller('db_list', ['$scope', function db_list($scope) {
	$scope.db = {"prova":"db general biew"};
  }])
  .controller('MyCtrl2', ['$scope', function MyCtrl2($scope) {
	$scope.db_list = [];
  }]);