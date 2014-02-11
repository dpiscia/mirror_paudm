angular.module('paudm.productions', ['ngResource']).
    factory('productions_list', function($resource){
    //localhost should be substitued by config_url
    return function(api_key,user_id){
	  return $resource('/api_node/prods', {}, {
	    query: {method:'GET', params:{}, isArray:true, headers:{ apiKey: api_key, user_id: user_id }}
	  });
	}
  
})