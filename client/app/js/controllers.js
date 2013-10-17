'use strict';

/* Controllers */

angular.module('paudm_db.controllers', []).
  controller('MyCtrl1', ['$scope','db_list', function MyCtrl1($scope, db_list) {
  	db_list.query({}, function(data){
	//1.callback on d3.plot, in the future implement on promise
	//2. implement callback on failure
	$scope.db_list = data;
	
	console.log('success, got data: ');
	
	});
	console.log("ccc");
  }])
  .controller('MyCtrl2', ['$scope', function MyCtrl2($scope) {
	$scope.db_list = [];
  }]);