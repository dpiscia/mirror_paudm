angular.module('catalog', [
  'ui.router',
  'login',
  'catalogs_app',
  'admin',
  'activity',
  'homepage_cat',
  ])
  .run(
      [        '$rootScope', '$state', '$stateParams','$location','user_auth',
      function ($rootScope,   $state,   $stateParams,  $location, user) {

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
 .controller('nav_bar_Ctrl', ['$scope','user_auth','$location', function HeaderCtrl($scope, user_auth, $location) {

    $scope.username = user_auth;
    $scope.logout = function(){user_auth.logout().then(
                        function(data){console.log("ok logged-out");
                        $location.path('/login')},
                        function(err){
                        	console.log(err);
                        	$location.path('/login')}
                        );;}
    $scope.goto = function(location){$location.path(location);}
    }]);
