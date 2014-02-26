'use strict';

var personal_area = angular.module('personal_area', ['ngResource']);

personal_area.config(function($stateProvider, $urlRouterProvider){
		var access = routingConfig.accessLevels;
		
  		$stateProvider
          .state("personal_area", {
            
            // Use a url of "/" to set a states as the "index".
            url: "/personal_area",
            templateUrl: "personal_area/personal_area.html", 
            resolve : {        
               resources: function($q, $stateParams, user_resource, user_auth){
               var deferred = $q.defer();
               
               var instanced = user_resource($stateParams.resources, user_auth.api_key, user_auth.id);
               instanced.query({}, function(data){ 
               			deferred.resolve(data);}
               		, function(err){ 
               			deferred.reject();}
               		)
               return deferred.promise;
               //the instanced is return into the controller, because it will be used for other get,post or update operation
         }},
         	access : access.user,
            controller: "personal_area_ctrl"
            

          })})

personal_area.factory('user_resource', function($resource){
    // return a catalog with full information
    var resource = {}
    resource = function(collection,api_key,user_id){ return $resource('/api_python/personal_area', {},{ query: {method:'GET',  isArray:false, headers:{  apiKey: api_key, user_id: user_id  } },
    																							save:  {method:'PUT',   headers:{  apiKey: api_key, user_id: user_id  } }
    																							 }); }
	return resource;
});

personal_area.controller('personal_area_ctrl', [ '$scope', 'resources', function ($scope, resources) {
		console.log('d');
		var resources_copy = angular.copy(resources);
		$scope.user = resources;
		
		$scope.save = function(values){
   			console.log($scope.user);
   			console.log(resources_copy);
   			$scope.user.$save(function(data){ 
               			console.log(data);
               			angular.copy( $scope.user,resources_copy);
               			resources_copy = $scope.user;
		   				$scope.success = "Succesfully saved";
		   				$scope.error = "";
               			 }
               		, function(err){ 
               			console.log(err);
               			
               			angular.copy(resources_copy, $scope.user);
						$scope.error = err.error;
   						$scope.success = "";
               			})
   			//function save(). success(message and resource_copy[values] = $scope.user[values] ) .fail(error message; $scope.user[values]=resources_copy[values])
   		}

   		}]);