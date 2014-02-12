angular.module('paudm_jobs').
    factory('jobs_list', function($resource){
    //localhost should be substitued by config_url
    return function(api_key,user_id){
		  return $resource('/api_node/jobs/:id/:all', {id: "@id", all:"@all"}, {
		    query: {method:'GET',  isArray:true, headers:{ apiKey: api_key, user_id: user_id }}
		  });
 	}
})

angular.module('paudm_jobs').
    factory('productions_list', function($resource){
    //localhost should be substitued by config_url
    return function(api_key,user_id){
	  return $resource('/api_node/prods', {}, {
	    query: {method:'GET', params:{}, isArray:true, headers:{ apiKey: api_key, user_id: user_id }}
	  });
	}
  
})

angular.module('paudm_jobs').
    factory('QC_list', function($resource){
    //localhost should be substitued by config_url
  return function(api_key,user_id){
	  return $resource('/api_node/qc/:id', {id: "@id"}, {
	    query: {method:'GET', params:{}, isArray:true , headers:{ apiKey: api_key, user_id: user_id }}
	  
	  });
  }
})