angular.module('paudm.productions', ['ngResource']).
    factory('productions_list', function($resource){
    //localhost should be substitued by config_url
    return function(env){
	  return $resource(env+'/api_node/prods', {}, {
	    query: {method:'GET', params:{}, isArray:true}
	  });
	}
  
})