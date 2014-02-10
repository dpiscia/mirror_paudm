angular.module('paudm.jobs', ['ngResource']).
    factory('jobs_list', function($resource){
    //localhost should be substitued by config_url
    return function(api_key,user_id){
		  return $resource('/api_node/jobs/:id/:all', {id: "@id", all:"@all"}, {
		    query: {method:'GET',  isArray:true, headers:{ apiKey: api_key, user_id: user_id }}
		  });
 	}
})