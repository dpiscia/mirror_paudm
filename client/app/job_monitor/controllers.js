'use strict';

/* Controllers */

angular.module('job_monitor.controllers', [])
	.controller('jobs_controller', ['$scope', 'jobs','productions','$location','$stateParams',  function jobs_controller($scope, jobs,productions, $location, $stateParams) {
		$scope.task_filter = "!!";
		$scope.status_filter = "!!";
		$scope.production_filter = "!!";
    	$scope.jobs = jobs;
    	$scope.productions = productions;
  		$scope.currentPage = 1;
  		$scope.maxSize = 10;
  		$scope.current_location = '#'+$location.$$url;
  		$scope.items = ['pie_chart', 'bar_chart', 'other'];
		$scope.selection = $scope.items[0];
		$scope.type_tasks = ["task",'status'];
		$scope.type_task = $scope.type_tasks[1];
		//$rootScopeProvider.limit = 20;
  }])
 