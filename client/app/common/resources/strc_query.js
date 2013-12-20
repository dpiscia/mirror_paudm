angular.module('paudm.strc_query', ['ngResource']).
    factory('strc_query', function($resource){
    //localhost should be substitued by config_url
  return function(env,api_key,user_id){
	  return $resource(env+'/api_node/strc_query', {}, {
	    query: {method:'GET', params:{}, isArray:true, headers:{ apiKey: api_key, user_id: user_id }}
	  });
	}
  
})