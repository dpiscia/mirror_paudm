'use strict';

var activity = angular.module('activity', ['ngResource']);

activity.config(function($stateProvider, $urlRouterProvider){
		var access = routingConfig.accessLevels;
		
  		$stateProvider
          .state("activity", {
            
            // Use a url of "/" to set a states as the "index".
            url: "/activity",
            templateUrl: "activity/activity.html", 
            resolve : {        
               jobs: function($q, user_auth, activity_resources){
               var deferred = $q.defer();
               
              
               activity_resources(user_auth.api_key, user_auth.id).query({}, function(data){ 
               			deferred.resolve(data);}
               		, function(err){ 
               			deferred.reject();}
               		)
               return deferred.promise;
               //the instanced is return into the controller, because it will be used for other get,post or update operation
         }},
         	access : access.user,
            controller: "activity_ctrl"
            

          })})

activity.factory('activity_resources', function($resource){
    // return a catalog with full information
    return function(api_key,user_id){
		  return $resource('/api_python/jobs', {}, {
		    query: {method:'GET',  isArray:true, headers:{ apiKey: api_key, user_id: user_id }}
		  });
 	}
});

activity.controller('activity_ctrl', [ '$scope', 'jobs','user_auth', function ($scope,jobs,user_auth) {
   		if (typeof String.prototype.startsWith != 'function') {
		  // see below for better implementation!
		  String.prototype.startsWith = function (str){
		    return this.indexOf(str) == 0;
		  };
		}   		$scope.jobs = jobs;
   		$scope.currentPage = 1;
  		$scope.maxSize = 10;
  		$scope.token = user_auth.api_key;
		$scope.user_id = user_auth.id;
   		}]);