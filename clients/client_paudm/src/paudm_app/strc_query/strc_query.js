'use strict';



// Declare app level module which depends on filters, and services
angular.module('paudm_strc_query', [
  'ngResource',
  'd3Scatter',
  'query',
  'results'
  
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
			      templateUrl: "/query/query.html" ,
					resolve : {        
			            columns: function($q, table_schema, $stateParams,user_auth){
			             var deferred = $q.defer();
			             table_schema(user_auth.api_key, user_auth.id).query({table_name :$stateParams.table_name}, function(data){
			             deferred.resolve(data.list.columns);
			             })
			             return deferred.promise;
			           
			        },
			        	table: function($q, $stateParams){
			            var deferred = $q.defer();
			            deferred.resolve($stateParams.table_name);
			             return deferred.promise;
			           
			        }},
			        access : access.user,
			        controller: "query_ctrl",
 		   })
 		   .state('strc_query.fields.results', {
            // Use a url of "/" to set a states as the "index".
            url: "/results",
            templateUrl: "/results/results.html", 
            access : access.user,
            controller: "results_ctrl",
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

angular.module('paudm_strc_query')
	.controller('strc_query_ctrl', ['$scope', 'table_list','$state', function strc_query_ctrl($scope, table_list,$state) {
   		$scope.db_list = table_list;
   		$scope.showTables = true;
   		$scope.tables_filter =  $state.params.table_name;
   		$scope.select = function(name){console.log(name);
   						$scope.tables_filter = name;
   						$state.transitionTo('strc_query.fields', {table_name:name});
   						}
}])
;