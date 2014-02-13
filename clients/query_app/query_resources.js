angular.module('query')
   .factory('run_query_resources', function($http,$q){
  
    // return query result
    var query = {}
    query.run = function(raw_query,api_key,user_id){
 		var deferred = $q.defer();
 		
	  	$http({
	    method: 'POST',
	    url: '/api_python/query',
	    data: {'query' : raw_query},
	     headers : { apiKey: api_key, user_id: user_id }
		})
		.success(function(data, status, headers, config) {
	    // this callback will be called asynchronously
	    // when the response is available

	    deferred.resolve(angular.fromJson(data.result));
	  	})
	  	.error(function(data, status, headers, config) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.

		    deferred.reject(data.message);
	 	 });
	    return deferred.promise;
 		}
 		
 		
 		
 		
 	query.check = function(raw_query,api_key,user_id)
	{	var deferred = $q.defer();
	  	$http({
	    method: 'POST',
	    url: '/api_python/check_query',
	    data: {'query' : raw_query},
	     headers : { apiKey: api_key, user_id: user_id }
	   }).success(function(data, status, headers, config) {
	    // this callback will be called asynchronously
	    // when the response is available

	    deferred.resolve(angular.fromJson(data.result[0]));
	  	}).error(function(data, status, headers, config) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.

		    deferred.reject(data.message);
	 	 });
	    return deferred.promise;
 		}
 	return query;
});


// Initial code content...

  
 