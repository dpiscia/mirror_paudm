angular.module('paudm.productions', ['ngResource']).
    factory('productions_list', function($resource){
    //localhost should be substitued by config_url
  return $resource('http://localhost:3000/api/prods', {}, {
    query: {method:'GET', params:{}, isArray:true}
  });
  
})