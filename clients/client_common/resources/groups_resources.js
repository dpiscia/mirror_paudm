angular.module('groups.resources', ['ngResource']).
    factory('groups_list_resources', function($resource){
    //private api
    return function(api_key,user_id){
		  return $resource('/api_python/groups', {}, {
		    query: {method:'GET',  isArray:false, headers:{  apiKey: api_key, user_id: user_id }}
		  });
 	}
}).
    factory('groups_list_public_resources', function($resource){
    //public api
    return function(){
		  return $resource('/api_python_public/groups', {}, {
		    query: {method:'GET',  isArray:false}
		  });
 	}
})