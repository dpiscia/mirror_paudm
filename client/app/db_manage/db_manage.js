'use strict';



// Declare app level module which depends on filters, and services
angular.module('paudm_db', [
  'db_manage.controllers',
  'd3Force',
  'd3Circle',
  'paudm.db_schema'
  
]).config(
    [          '$stateProvider', '$urlRouterProvider',
      function ($stateProvider,   $urlRouterProvider) {

        /////////////////////////////
        // Redirects and Otherwise //
        /////////////////////////////
		 
        // Use $urlRouterProvider to configure any redirects (when) and invalid urls (otherwise).
		var access = routingConfig.accessLevels;
		  $urlRouterProvider.otherwise('/db_schema/plot');
        $stateProvider

          //////////
          // Home //
          //////////

          .state("db_schema", {
            
            // Use a url of "/" to set a states as the "index".
            url: "/db_schema",
            templateUrl: "db_manage/db_schema.html", 
            resolve : {        
            table_list: function($q, db_list){
             var deferred = $q.defer();
             db_list().query({}, function(data){ 
             	deferred.resolve(data);},
             	 function(err){ 
             	deferred.reject();})

             return deferred.promise;
         }},
         	access : access.user,
            controller: "db_schema",
                

          })
          .state("db_schema.plot", {

            // Use a url of "/" to set a states as the "index".
            url: "/plot",
            templateUrl: "db_manage/db_list_plot.html", 
            access : access.user,
            controller: "tables_plot"


          })        .state('db_schema.table', {
            url: "/{contactId}",
            templateUrl: "db_manage/fields_table.html",
                        resolve : {        
            fields_list: function($q, table_schema, $stateParams){
             var deferred = $q.defer();
             if (undefined != $stateParams ){
             table_schema().query({table_name :$stateParams.contactId}, function(data){
             deferred.resolve(data);
             })
             return deferred.promise;
             }
         }},
         	access : access.user,
            controller: "fields_list"
        })
        
        
 }]);     
      
      