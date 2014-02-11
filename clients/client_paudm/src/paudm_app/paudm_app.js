angular.module('paudm_all', [
  'ngRoute',
  'ngResource',
  'ui.router',
  'ui.bootstrap',
  'paudm.breadcrumbs',
  'paudm.user_auth',
  'paudm.filters',
  'login',
  'paudm_db',
  'paudm_jobs',
  'paudm_strc_query',
  ])
  .run(
      [        '$rootScope', '$state', '$stateParams','user_auth','$location',
      function ($rootScope,   $state,   $stateParams, user, $location) {

        // It's very handy to add references to $state and $stateParams to the $rootScope
        // so that you can access them from any scope within your applications.For example,
        // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
        // to active whenever 'contacts.list' or one of its decendents is active.
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $rootScope.$on('$stateChangeStart', 
		function(event, toState, toParams, fromState, fromParams){ 
			        if ((user.authorize(toState.access) === 0) ) {
			        	
			        	event.preventDefault();
			        	console.log(toState.name);
			        	$location.path('/login');
			        	}

 	})
      }]).
    config(
    [          '$stateProvider', '$urlRouterProvider', '$locationProvider',
      function ($stateProvider,   $urlRouterProvider , $locationProvider) {

        /////////////////////////////
        // Redirects and Otherwise //
        /////////////////////////////
		 
        // Use $urlRouterProvider to configure any redirects (when) and invalid urls (otherwise).

             //$locationProvider.html5Mode(true);
        
        
 }])
    .controller('HeaderCtrl', ['$scope','$state','breadcrumbs', 'user_auth' ,function HeaderCtrl($scope, $state, breadcrumbs, user_auth) {
	$scope.db = {"prova":"Header ctrl view in different position"};
    $scope.breadcrumbs = breadcrumbs;
    $scope.username = user_auth;
    }])
    .controller('nav_bar_Ctrl', ['$scope','user_auth','$location', function HeaderCtrl($scope, user_auth, $location) {

    $scope.username = user_auth;
    $scope.logout = function(){user_auth.logout().then(
   			function(data){console.log("ok logged-out");
   			$location.path('/login')}, 
   			function(err){console.log(err)}
   			);;}
    }]);
