'use strict';



// Declare app level module which depends on filters, and services
angular.module('homepage_cat', [
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
               catalogs: function($q, catalogs_group_list_resources, user_auth){
               var deferred = $q.defer();
               catalogs_group_list_resources(user_auth.api_key, user_auth.id).query({}, function(data){ deferred.resolve(data);})
               return deferred.promise;
         }},
            access : access.user,
            controller: "homepage_cat_ctrl",
            

          })
   
 }]); 
 
 'use strict';

/* Controllers */

angular.module('homepage_cat').controller('homepage_cat_ctrl', [ '$scope', 'catalogs', 'user_auth','jobs_nbr_get', 'users_nbr_get',function ($scope, catalogs, user_auth, jobs_nbr_get , users_nbr_get) {
   		
   		$scope.groups = [];
		$scope.public   = [];		
		$scope.type = [];
		var dat_raw = _.countBy(catalogs.catalogs,function(x){return x.group});
		for (var key in dat_raw) {$scope.groups.push({name:key, nbr: dat_raw[key]});}  
		dat_raw = _.countBy(catalogs.catalogs,function(x){return x.public})
		for (var key in dat_raw) {$scope.public.push({name:key, nbr: dat_raw[key]});}  
		dat_raw = _.countBy(catalogs.catalogs,function(x){return x.type})
		for (var key in dat_raw) {$scope.type.push({name:key, nbr: dat_raw[key]});}  
		console.log('dd'); 
		jobs_nbr_get(user_auth.api_key, user_auth.id).query({}, function(data){ 
               			$scope.queries = data.jobs_nbr;}
               		, function(err){ 
               			console.log(err);}
               		)
		users_nbr_get(user_auth.api_key, user_auth.id).query({}, function(data){ 
               			$scope.users = data.users_nbr;}
               		, function(err){ 
               			console.log(err);}
               		)
		//und.each(und.keys(dati_el), function(value)  {var string = {'name' : value , 'nbr' : dati_el[value]}; $scope.groups.push(string);  } );		
}]);


angular.module('homepage_cat').factory('jobs_nbr_get', function($resource){
    // return a catalog with full information
    return function(api_key,user_id){
		  return $resource('/api_python/jobs_counter', {}, {
		    query: {method:'GET',  isArray:false, headers:{ apiKey: api_key, user_id: user_id }}
		  });
 	}
});

angular.module('homepage_cat').factory('users_nbr_get', function($resource){
    // return a catalog with full information
    return function(api_key,user_id){
		  return $resource('/api_python/users_counter', {}, {
		    query: {method:'GET',  isArray:false, headers:{ apiKey: api_key, user_id: user_id }}
		  });
 	}
});