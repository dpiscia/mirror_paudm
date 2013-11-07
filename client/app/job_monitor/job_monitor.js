'use strict';



// Declare app level module which depends on filters, and services
angular.module('paudm_jobs', [
  'job_monitor.controllers',
  'paudm.jobs'
  
]).config(
    [          '$stateProvider', '$urlRouterProvider',
      function ($stateProvider,   $urlRouterProvider) {

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
            table_list: function($q, jobs_list){
             var deferred = $q.defer();
             jobs_list.query({}, function(data){ deferred.resolve(data);})
             //deferred.resolve([]);
             return deferred.promise;
         }},
            controller: "jobs_controller",
                

          })
        
        
 }]);     
      
      