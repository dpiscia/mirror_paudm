'use strict';
/* jshint -W117 */
/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('paudm.db_schema', ['ngResource'])
  .factory('db_list', function($resource){ 
  return function(api_key,user_id){
	  return $resource('/api_python/db_list', {} ,{
	    query: {method:'GET', params:{}, isArray:true, headers:{ apiKey: api_key, user_id: user_id} }
	  });
  }
  
})
  .factory('table_schema', function($resource){
  return function(api_key,user_id){
	  return $resource('/api_python/tb/:table_name', {table_name: "@table_name"} ,{
	  
	    query: {method:'GET', params:{}, isArray:false, headers:{ apiKey: api_key, user_id: user_id} }
	  });
  }
});


 