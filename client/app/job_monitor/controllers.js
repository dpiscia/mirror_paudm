'use strict';

/* Controllers */

angular.module('job_monitor.controllers', [])
	.controller('jobs_controller', ['$scope', 'jobs','productions','$location','$stateParams',  function jobs_controller($scope, jobs,productions, $location, $stateParams) {
		$scope.jobs = jobs;
		$scope.detail = false;
		if ($location.path().indexOf('Top_level_jobs/') !== -1) $scope.detail = true;
		if ($scope.detail){
			$scope.parent_job = [];
			$scope.parent_job.push($scope.jobs[0]);
			$scope.jobs.splice(0,1);
			}
		$scope.task_filter = "!!";
		$scope.status_filter = "!!";
		$scope.production_filter = "!!";
		$scope.orderProp = '-id';
    	$scope.productions = productions;
  		$scope.currentPage = 1;
  		$scope.maxSize = 10;
  		$scope.current_location = '#'+$location.$$url;
  		$scope.items = ['pie_chart', 'bar_chart', 'other'];
		$scope.selection = $scope.items[0];
		$scope.type_tasks = ["task",'status'];
		$scope.type_task = $scope.type_tasks[1];
		//$rootScopeProvider.limit = 20;
  }]);
  
 