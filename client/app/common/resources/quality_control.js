angular.module('paudm.QC', ['ngResource']).
    factory('QC_list', function($resource){
    //localhost should be substitued by config_url
  return $resource('http://localhost:3000/api/qc/:id', {id: "@id"}, {
    query: {method:'GET', params:{}, isArray:true}
  
  });
  
})