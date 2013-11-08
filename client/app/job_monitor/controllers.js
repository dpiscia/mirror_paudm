'use strict';

/* Controllers */

angular.module('job_monitor.controllers', [])
	.controller('jobs_controller', ['$scope', 'jobs','productions',  function jobs_controller($scope, jobs,productions) {
		$scope.Math = window.Math;
		$scope.task_filter = "!!";
		$scope.status_filter = "!!";
		$scope.production_filter = "!!";
    	$scope.jobs = jobs;
    	$scope.productions = productions;
  		$scope.currentPage = 0;
  		$scope.maxSize = 5;
  }])