angular.module('paudm.strc_query', ['ngResource']).
    factory('strc_query', function($resource){
    //localhost should be substitued by config_url
  return $resource('http://localhost:3000/api/strc_query', {}, {
    query: {method:'GET', params:{}, isArray:true}
  });
  
})