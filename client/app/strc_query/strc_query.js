'use strict';



// Declare app level module which depends on filters, and services
angular.module('paudm_strc_query', [
  'strc_query.controllers',
  'paudm.strc_query',
  
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

          .state("strc_query", {
            
            // Use a url of "/" to set a states as the "index".
            url: "/strc_query",
            templateUrl: "static/strc_query/strc_query_table.html", 
            resolve : {        
            table_list: function($q, db_list){
             var deferred = $q.defer();
             db_list.query({}, function(data){ deferred.resolve(data);})

             return deferred.promise;
         }},
            controller: "strc_query_ctrl",
                

          })    .state('strc_query.fields', {
			      url: "/{table_name}",
			      templateUrl: "static/strc_query/strc_query_fields.html" ,
					resolve : {        
			            fields_list: function($q, table_schema, $stateParams){
			             var deferred = $q.defer();
			             table_schema.query({table_name :$stateParams.table_name}, function(data){
			             deferred.resolve(data);
			             })
			             return deferred.promise;
			           
			        }},
			        controller: "strc_query_fields_ctrl",
 		   })
 		   .state('strc_query.fields.results', {
			      url: "/:fields/:where/:limit",
			      templateUrl: "static/strc_query/strc_query_results.html" ,
					resolve : {        
			            results: function($q, strc_query , $stateParams){
			             var deferred = $q.defer();
			             strc_query.query({table:$stateParams.table_name, fields:'*', clauses: $stateParams.where, limit :'100' }, function(data){
			             deferred.resolve(data);
			             })
			             return deferred.promise;
			           
			        }},
			        controller: "strc_query_results_ctrl",
 		   })


        
        
 }]);  