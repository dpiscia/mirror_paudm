angular.module('catalog', [
  'ui.router',
  'login',
  'catalogs_app',
  'admin',
  'activity',
  'personal_area',
  'homepage_cat',
  'paudm.breadcrumbs',
  'contact',
  ])
  .run(
      [        '$rootScope', '$state', '$stateParams','$location','user_auth',
      function ($rootScope,   $state,   $stateParams,  $location, user_auth) {

        // It's very handy to add references to $state and $stateParams to the $rootScope
        // so that you can access them from any scope within your applications.For example,
        // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
        // to active whenever 'contacts.list' or one of its decendents is active.
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $rootScope.$on('$stateChangeStart', 
		function(event, toState, toParams, fromState, fromParams){ 
					if (toState.url === '/login') {
					 if (user_auth.isLoggedIn())
						user_auth.logout();
					}
			        if ((user_auth.authorize(toState.access) === 0) ) {
			        	
			        	event.preventDefault();
			        	console.log(toState.name);
			        	url = $location.url();
			        	$location.path('/login').search('url',url);
			        	}

 	})
      }]).
    config(
    [          '$stateProvider', '$urlRouterProvider', '$locationProvider','$httpProvider',
      function ($stateProvider,   $urlRouterProvider , $locationProvider, $httpProvider) {

        /////////////////////////////
        // Redirects and Otherwise //
        /////////////////////////////
		 //user_auth.HttpInterceptor
		 $httpProvider.interceptors.push('myHttpInterceptor');
        // Use $urlRouterProvider to configure any redirects (when) and invalid urls (otherwise).

             //$locationProvider.html5Mode(true);
        
        
 }])    
 .controller('HeaderCtrl', ['$scope','breadcrumbs', '$location' ,function HeaderCtrl($scope, breadcrumbs, $location) {
	$scope.db = {"prova":"Header ctrl view in different position"};
    $scope.breadcrumbs = breadcrumbs;
    $scope.show_nav = function() {return ($location.url().indexOf("/login") !== 0) && ($location.url().indexOf("/register") !== 0);}
    }])
 .controller('nav_bar_Ctrl', ['$scope','user_auth','$location','$state', function HeaderCtrl($scope, user_auth, $location, $state) {
	$scope.show_nav = function() {return ($location.url().indexOf("/login") !== 0) && ($location.url().indexOf("/register") !== 0);}
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

    
    angular.module('catalog').factory('myHttpInterceptor', function ($q, $location) {
    return {

        responseError: function (response) {
            // do something on error
            if (response.data == "not authorized") {

			    $location.path('/login');
			    }
            return $q.reject(response);
        }
    };
});