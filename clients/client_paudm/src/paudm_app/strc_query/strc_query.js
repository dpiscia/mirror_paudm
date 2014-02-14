'use strict';



// Declare app level module which depends on filters, and services
angular.module('paudm_strc_query', [
  'ngResource',
  'd3Scatter',
  
]).config(
    [          '$stateProvider', '$urlRouterProvider',
      function ($stateProvider,   $urlRouterProvider) {

        /////////////////////////////
        // Redirects and Otherwise //
        /////////////////////////////
		 
        // Use $urlRouterProvider to configure any redirects (when) and invalid urls (otherwise).
		var access = routingConfig.accessLevels;
		
        $stateProvider

          //////////
          // Home //
          //////////

          .state("strc_query", {
            
            // Use a url of "/" to set a states as the "index".
            url: "/strc_query",
            templateUrl: "strc_query/strc_query_table.html", 
            resolve : {        
            table_list: function($q, db_list, user_auth){
             var deferred = $q.defer();
             db_list(user_auth.api_key, user_auth.id).query({}, function(data){ deferred.resolve(data);})

             return deferred.promise;
         }},access : access.user,
            controller: "strc_query_ctrl",
                

          })    .state('strc_query.fields', {
			      url: "/{table_name}",
			      templateUrl: "strc_query/strc_query_fields.html" ,
					resolve : {        
			            fields_list: function($q, table_schema, $stateParams,user_auth){
			             var deferred = $q.defer();
			             table_schema(user_auth.api_key, user_auth.id).query({table_name :$stateParams.table_name}, function(data){
			             deferred.resolve(data);
			             })
			             return deferred.promise;
			           
			        }},
			        access : access.user,
			        controller: "strc_query_fields_ctrl",
 		   })
 		   .state('strc_query.fields.results', {
			      url: "/result?fields&where&limit",
			      templateUrl: "strc_query/strc_query_results.html" ,
					resolve : {        
			            results: function($q, strc_query , $stateParams,user_auth){
			             var deferred = $q.defer();
			             strc_query(user_auth.api_key, user_auth.id).query({table:$stateParams.table_name, fields:$stateParams.fields, clauses: $stateParams.where, limit :$stateParams.limit }, function(data){
			             deferred.resolve(data);
			             })
			             return deferred.promise;
			           
			        }},
			        access : access.user,
			        controller: "strc_query_results_ctrl",
 		   })
 		   


        
        
 }]);  
 
 angular.module('paudm_strc_query').
    factory('strc_query', function($resource){
    //localhost should be substitued by config_url
  return function(api_key,user_id){
	  return $resource('/api_node/strc_query', {}, {
	    query: {method:'GET', params:{}, isArray:true, headers:{ apiKey: api_key, user_id: user_id }}
	  });
	}
  
})