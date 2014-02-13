'use strict';



// Declare app level module which depends on filters, and services
angular.module('catalogs_app', [
  'ui.bootstrap',
  'groups.resources', //might be included in user_auth module
  'results', //partial view including table and plot, to write directives for table, as general table ctrl and view
  'query', //maybe split part of catalog and put into stand-alone query module
  'ui.ace',
  'paudm.filters', 
  'ngResource'
  
]).config(
    [          '$stateProvider', '$urlRouterProvider',
      function ($stateProvider,   $urlRouterProvider) {

        /////////////////////////////
        // Redirects and Otherwise //
        /////////////////////////////
		 
        // Use $urlRouterProvider to configure any redirects (when) and invalid urls (otherwise).
   		var access = routingConfig.accessLevels;
		$urlRouterProvider.otherwise('/home');
        $stateProvider
          .state("catalogs_list", {
            
            // Use a url of "/" to set a states as the "index".
            url: "/catalogs",
            templateUrl: "catalog/catalogs_list/catalogs_list.html", 
            resolve : {        
               catalogs: function($q, catalogs_group_list_resources,  user_auth){
               var deferred = $q.defer();
               catalogs_group_list_resources(user_auth.api_key, user_auth.id).query({}, function(data){ deferred.resolve(data);})
               return deferred.promise;
         }},
            access : access.user,
            controller: "catalogs_list_ctrl",
            

          })
 
          .state("catalog_details", {
            
            // Use a url of "/" to set a states as the "index".
            url: "/catalogs/:group/:catalog",
            templateUrl: "catalog/catalogs_list/single_catalog/single_catalog.html", 
            resolve : {        
               catalog: function($q, single_catalog_resources,  $stateParams, user_auth){
               var deferred = $q.defer();
               single_catalog_resources(user_auth.api_key, user_auth.id).query({catalog :$stateParams.catalog}, function(data){ deferred.resolve(data);})
               return deferred.promise;
         }},
            access : access.user,
            controller: "single_catalog_ctrl",
            

          })
           .state("catalog_details.prebuilt", {
            
            // Use a url of "/" to set a states as the "index".
            url: "/prebuilt",
            templateUrl: "catalog/catalogs_list/single_catalog/prebuilt_catalog/prebuilt_catalog.html", 
            access : access.user,
            
            

          })
            .state("catalog_details.custom", {
            
            // Use a url of "/" to set a states as the "index".
            url: "/custom",
            templateUrl: "/query/query.html", 
            access : access.user,
            controller: "query_ctrl",
            
            

          })
           .state("catalog_details.custom.results", {
            
            // Use a url of "/" to set a states as the "index".
            url: "/results",
            templateUrl: "/results/results.html", 
            access : access.user,
            controller: "results_ctrl",
            
            

          })

        
        
 }]); 