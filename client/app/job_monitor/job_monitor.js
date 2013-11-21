'use strict';



// Declare app level module which depends on filters, and services
angular.module('paudm_jobs', [
  'job_monitor.controllers',
  'job_monitor.single_job',
  'paudm.jobs',
  'paudm.productions',
  'paudm.QC',
  'd3Bars',
  'd3Pie',
  'd3Lines',
  'd3Zoom',
  'd3Forcetree',
  'ngSanitize'
  
]).config(
	['$stateProvider', '$urlRouterProvider',function ($stateProvider,   $urlRouterProvider) {

        /////////////////////////////
        // Redirects and Otherwise //
        /////////////////////////////
		 
        // Use $urlRouterProvider to configure any redirects (when) and invalid urls (otherwise).
		
		$stateProvider

          //////////
          // Home //
          //////////
			
		.state("jobs_list", {
            
            // Use a url of "/" to set a states as the "index".
            url: "/general_view",
			templateUrl: "static/job_monitor/jobs_list.html", 
			resolve : {        
				jobs: function($q, jobs_list){
					 var deferred = $q.defer();
					 jobs_list.query({}, function(data){ deferred.resolve(data);})
				 //deferred.resolve([]);
				 return deferred.promise;
	        	 },
				productions: function($q, productions_list){
					 var deferred = $q.defer();
					 productions_list.query({}, function(data){ deferred.resolve(data);})
					 //deferred.resolve([]);
					 return deferred.promise;
	        	 }
        	 },
            controller: "jobs_controller",
		})
		.state("jobs_detail", {
            
            // Use a url of "/" to set a states as the "index".
			url: "/general_view/{path:.*}detail_view/:job_id/:level",
			templateUrl: "static/job_monitor/jobs_list.html", 
            resolve : {        
				jobs: function($q, jobs_list, $location, $stateParams){
				     var deferred = $q.defer();
				     jobs_list.query({id :$stateParams.job_id, all: $stateParams.level}, function(data){ deferred.resolve(data);})
				     //deferred.resolve([]);
				     return deferred.promise;
					},
				productions: function() {return [];}
       		 },
            controller: "jobs_controller",
		})
		.state("job_single", {
            
            // Use a url of "/" to set a states as the "index".
			url: "/general_view/{path:.*}single_view/:job_id",
			templateUrl: "static/job_monitor/job_single.html", 
            resolve : {        
				job: function($q, jobs_list, $location, $stateParams){
				     var deferred = $q.defer();
				     jobs_list.query({id :$stateParams.job_id, all: 0}, function(data){ deferred.resolve(data);})
				     //deferred.resolve([]);
				     return deferred.promise;
					},
				QC: function($q, QC_list, $location, $stateParams){
				     var deferred = $q.defer();
				     QC_list.query({id :$stateParams.job_id}, function(data){ deferred.resolve(data);})
				     //deferred.resolve([]);
				     return deferred.promise;
					},
       		 },
            controller: "job_single",
		})
 }]);     
      
      