'use strict';

/* Controllers */

angular.module('results',['ui.bootstrap','d3Scatter', 'paudm.filters','ngCsv'])
	.controller('results_ctrl', [ '$scope','user_auth', function ($scope,  user_auth) {
   	console.log("results");
   	$scope.type = 'table';
   	$scope.showResult = true;

   	
	$scope.var1 = $scope.results[0][0];
	$scope.var2 = $scope.results[0][1];		
	$scope.data = function(){ return $scope.results.slice(1).map(
		function(x)
		{return [ x[ $scope.results[0].indexOf($scope.var1)], x[$scope.results[0].indexOf($scope.var2)] ] });}
	$scope.$watch($scope.data.length,function()
	{console.log('datachanged');})
	$scope.$watch('var1+var2', function() {
		   		$scope.data = $scope.results.slice(1).map(
		   			function(x)
		   			{return [ x[ $scope.results[0].indexOf($scope.var1)], x[$scope.results[0].indexOf($scope.var2)] ]  });
		   		})   		
	$scope.currentPage = 1;
  	$scope.maxSize = 10;
  	
}])