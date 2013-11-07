angular.module('paudm_all', [
  'ngRoute',
  'ngResource',
  'ui.router',
  'paudm.breadcrumbs',
  'd3',
  'd3.directives',
  'paudm_db'
  ]).
    config(
    [          '$stateProvider', '$urlRouterProvider',
      function ($stateProvider,   $urlRouterProvider) {

        /////////////////////////////
        // Redirects and Otherwise //
        /////////////////////////////
		 
        // Use $urlRouterProvider to configure any redirects (when) and invalid urls (otherwise).
        $urlRouterProvider
             
             .otherwise("/db_schema");
        
        
 }])
    .controller('HeaderCtrl', ['$scope','$state', function HeaderCtrl($scope, $state) {
	$scope.db = {"prova":"Header ctrl view in different position"};

    }]);