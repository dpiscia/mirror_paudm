'use strict';

/* Controllers */

angular.module('job_monitor.controllers', [])
.
  controller('jobs_controller', ['$scope', 'table_list', function jobs_controller($scope, table_list) {
    console.log("ciao");
	$scope.jobs = table_list;
  }])