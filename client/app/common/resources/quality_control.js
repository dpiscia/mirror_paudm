angular.module('paudm.QC', ['ngResource']).
    factory('QC_list', function($resource){
    //localhost should be substitued by config_url
  return $resource('/api_node/qc/:id', {id: "@id"}, {
    query: {method:'GET', params:{}, isArray:true}
  
  });
  
})