'use strict';



// Declare app level module which depends on filters, and services
angular.module('login', [
  'login.controllers',
  'register.controllers',
  'groups.resources',
  
]).config(
    [          '$stateProvider', '$urlRouterProvider',
      function ($stateProvider,   $urlRouterProvider) {

        /////////////////////////////
        // Redirects and Otherwise //
        /////////////////////////////
		 
        // Use $urlRouterProvider to configure any redirects (when) and invalid urls (otherwise).
   		var access = routingConfig.accessLevels;
        $urlRouterProvider
             
             .otherwise("/login");
        $stateProvider

          //////////
          // Home //
          //////////

          .state("login", {
            
            // Use a url of "/" to set a states as the "index".
            url: "/login",
            templateUrl: "security/login/login.html", 
            access : access.public,
            controller: "login_ctrl",
            

          })         
          .state("register", {
            
            // Use a url of "/" to set a states as the "index".
            url: "/register",
            templateUrl: "security/register/register.html", 
            resolve : {        
               groups: function($q, groups_list_public_resources){
               var deferred = $q.defer();
               groups_list_public_resources().query({}, function(data){ deferred.resolve(data);})
               return deferred.promise;
         }},
            access : access.public,
            controller: "register_ctrl",
            

          })

        
        
 }]); 