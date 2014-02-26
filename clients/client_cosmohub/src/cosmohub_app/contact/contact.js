var contact = angular.module('contact', []);

contact.config(function($stateProvider, $urlRouterProvider){
		var access = routingConfig.accessLevels;
		
  		$stateProvider
          .state("contact", {
            
            // Use a url of "/" to set a states as the "index".
            url: "/contact",
            templateUrl: "contact/contact.html", 
         	access : access.user,            

          })})