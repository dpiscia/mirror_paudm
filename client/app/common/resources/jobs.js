angular.module('paudm.jobs', ['ngResource']).
    factory('jobs_list', function($resource){
    //localhost should be substitued by config_url
  return $resource('http://localhost:3000/api/jobs/:id/:all', {id: "@id", all:"@all"}, {
    query: {method:'GET', params:{}, isArray:true}
  });
  
})