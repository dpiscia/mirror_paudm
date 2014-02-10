'use strict';
/* jshint -W117 */
/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('paudm.db_schema', ['ngResource'])
  .factory('db_list', function($resource){ 
  return function(){
	  return $resource('/api_python/db_list', {} ,{
	    query: {method:'GET', params:{}, isArray:true}
	  });
  }
  
})
  .factory('table_schema', function($resource){
  return function(){
	  return $resource('/api_python/tb/:table_name', {table_name: "@table_name"} ,{
	  
	    query: {method:'GET', params:{}, isArray:false}
	  });
  }
});


 