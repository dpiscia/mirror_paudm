'use strict';
/* jshint -W117 */
/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('paudm_db.resources', ['ngResource'])
  .factory('db_list', function($resource){
  return $resource('/api/db_list', {} ,{
    query: {method:'GET', params:{}, isArray:true}
  });
  
})
  .factory('table_schema', function($resource){
  return $resource('/api/tb/:table_name', {table_name: "@table_name"} ,{
    query: {method:'GET', params:{}, isArray:false}
  });
  
});


 