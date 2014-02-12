angular.module('catalogs_app')
   .factory('single_catalog_resources', function($resource){
    // return a catalog with full information
    return function(api_key,user_id){
		  return $resource('/api_python/catalog/:catalog', {catalog: "@catalog"}, {
		    query: {method:'GET',  isArray:false, headers:{ apiKey: api_key, user_id: user_id } }
		  });
 	}
})
.factory('catalogs_group_list_resources', function($resource){
    // return a list of catalogs by user permissions
    return function(api_key,user_id){
		  return $resource('/api_python/catalogs', {}, {
		    query: {method:'GET',  isArray:false, headers:{  apiKey: api_key, user_id: user_id } }
		  });
 	}
});