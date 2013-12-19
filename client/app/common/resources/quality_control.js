angular.module('paudm.QC', ['ngResource']).
    factory('QC_list', function($resource){
    //localhost should be substitued by config_url
  return function(env,api_key,user_id){
	  return $resource(env+'/api_node/qc/:id', {id: "@id"}, {
	    query: {method:'GET', params:{}, isArray:true , headers:{ apiKey: api_key, user_id: user_id }}
	  
	  });
  }
})