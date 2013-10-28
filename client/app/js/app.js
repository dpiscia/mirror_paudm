'use strict';



// Declare app level module which depends on filters, and services
angular.module('paudm_db', [
  'ngRoute',
  'ngResource',
  'd3',
  'd3_plots',
  'paudm_db.filters',
  'paudm_db.services',
  'paudm_db.directives',
  'paudm_db.controllers',
  'paudm_db.resources',
  'ui.router'
  
]).run(
      [        '$rootScope', '$state', '$stateParams',
      function ($rootScope,   $state,   $stateParams) {

        // It's very handy to add references to $state and $stateParams to the $rootScope
        // so that you can access them from any scope within your applications.For example,
        // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
        // to active whenever 'contacts.list' or one of its decendents is active.
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
      }]).
    config(
    [          '$stateProvider', '$urlRouterProvider',
      function ($stateProvider,   $urlRouterProvider) {

        /////////////////////////////
        // Redirects and Otherwise //
        /////////////////////////////
		 
        // Use $urlRouterProvider to configure any redirects (when) and invalid urls (otherwise).
        $urlRouterProvider
             
             .otherwise("/view1");
        
        $stateProvider

          //////////
          // Home //
          //////////

          .state("view1", {

            // Use a url of "/" to set a states as the "index".
            url: "/view1",
            templateUrl: "static/partials/partial1.html", 
            controller: "MyCtrl1"


          })
          .state("view1.list", {

            // Use a url of "/" to set a states as the "index".
            url: "/list",
            templateUrl: "static/partials/db_list_plot.html", 
            controller: "db_list"


          })        .state('view1.table', {
            url: "/{contactId}",
            templateUrl: "static/partials/partial2.html",
            controller: "MyCtrl2"
        })
        
        
 }]);     
      
      
/*.
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {templateUrl: 'static/partials/partial1.html', controller: 'MyCtrl1'});
  $routeProvider.when('/view2', {templateUrl: 'static/partials/partial2.html', controller: 'MyCtrl2'});
  $routeProvider.otherwise({redirectTo: '/view1'});

*/