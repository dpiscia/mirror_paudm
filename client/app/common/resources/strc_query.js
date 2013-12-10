angular.module('paudm.strc_query', ['ngResource']).
    factory('strc_query', function($resource){
    //localhost should be substitued by config_url
  return $resource('/api_node/strc_query', {}, {
    query: {method:'GET', params:{}, isArray:true}
  });
  
})