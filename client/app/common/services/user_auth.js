'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('paudm.user_auth', []);
angular.module('paudm.user_auth').factory('user_auth', [ '$rootScope', '$http','$q', '$location','$state', function($rootScope, $http, $q, $location,$state){
	var access = routingConfig.accessLevels;
    var user = {};
	user.role =	1;
	user.api_key = "";
	user.name ="anonymous";
	user.id = "";


	$rootScope.$on('$stateChangeStart', 
		function(event, toState, toParams, fromState, fromParams){ 
			        if ((user.authorize(toState.access) === 0) ) {
			        	
			        	event.preventDefault();
			        	console.log(toState.name);
			        	$location.path('/login');
			        	}

 	})
	user.authorize = function(accessLevel, role) {
			console.log("access +role "+ (accessLevel & user.role) );
			console.log("access "+accessLevel);
			console.log("role "+user.role);
			if (accessLevel == 'undefined') return 0;
            return accessLevel & user.role;
        };

	user.isLoggedIn= function(user) {
            if(user === undefined)
                return false;
            return user.role === userRoles.user || user.role === userRoles.admin;
        };

	user.register = function(user, success, error) {
            $http.post('/register', user).success(success).error(error);
        };

	user.login =  function(username, password) {
				var deferred = $q.defer();
				
					
	 	           	$http.post('http://localhost:3000/api_node/login', { username: username, password: password })
	 	           	.success(function(data){
		                user.api_key = data.api_key;
		                user.role = data.role;
		                user.name = username;
		                user.id = data.id;
		                
	                	deferred.resolve('OK');
	                
	            	})
	            	.error(
	            	function(data){
	                    deferred.reject(data.message);
                	});
             	return deferred.promise;
             	
        };

	user.logout =  function(success, error) {
            $http.post('/logout').success(function(){
                $rootScope.user = {
                    username : '',
                    role : userRoles.public
                };
                success();
            }).error(error);
        };
     user.getname = function() {
    return user.name;
  };
	return user;




    
}]);