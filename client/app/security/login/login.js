'use strict';



// Declare app level module which depends on filters, and services
angular.module('login', [
  'login.controllers',
  
]).config(
    [          '$stateProvider', '$urlRouterProvider',
      function ($stateProvider,   $urlRouterProvider) {

        /////////////////////////////
        // Redirects and Otherwise //
        /////////////////////////////
		 
        // Use $urlRouterProvider to configure any redirects (when) and invalid urls (otherwise).
   
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
            controller: "login_ctrl",
                

          })

        
        
 }]); 