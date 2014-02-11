'use strict';



// Declare app level module which depends on filters, and services
angular.module('homepage_cat', [
  'catalogs.controllers',
  'groups.resources', //might be included in user_auth module
  'd3Pie',
  'ui.bootstrap',
]).config(
    [          '$stateProvider', '$urlRouterProvider',
      function ($stateProvider,   $urlRouterProvider) {

        /////////////////////////////
        // Redirects and Otherwise //
        /////////////////////////////
		 
        // Use $urlRouterProvider to configure any redirects (when) and invalid urls (otherwise).
   		var access = routingConfig.accessLevels;
   		$stateProvider
          .state("hoempage_cat", {
            
            // Use a url of "/" to set a states as the "index".
            url: "/home",
            templateUrl: "homepage/homepage.html", 
            resolve : {        
               groups: function($q, groups_list_resources, user_auth){
               var deferred = $q.defer();
               groups_list_resources(user_auth.api_key, user_auth.id).query({}, function(data){ deferred.resolve(data);})
               return deferred.promise;
         }},
            access : access.user,
            controller: "homepage_cat_ctrl",
            

          })
   
 }]); 
 
 'use strict';

/* Controllers */

angular.module('homepage_cat').controller('homepage_cat_ctrl', [ '$scope', 'groups', 'user_auth',function ($scope, groups, user_auth) {
   		$scope.groups = groups.groups;
   		

   		
}]);