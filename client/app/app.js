angular.module('paudm_all', [
  'ngRoute',
  'ngResource',
  'ui.router',
  'ui.bootstrap',
  'paudm.breadcrumbs',
  'paudm.filters',
  'd3',
  'd3.directives',
  'paudm_db',
  'paudm_jobs'
  ])
  .run(
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
             
             .otherwise("/db_schema");
        
        
 }])
    .controller('HeaderCtrl', ['$scope','$state', function HeaderCtrl($scope, $state) {
	$scope.db = {"prova":"Header ctrl view in different position"};

    }]);