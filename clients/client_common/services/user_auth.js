'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('paudm.user_auth', ['ngCookies']);
angular.module('paudm.user_auth').factory('user_auth', [ '$rootScope', '$http','$q', '$location','$state', '$cookieStore', function($rootScope, $http, $q, $location,$state,$cookieStore){
	var access = routingConfig.accessLevels;
    var user = {};
	user.role =	1;
	user.api_key = "";
	user.name = null;
	if ($cookieStore.get('api_key') != undefined) user.api_key = $cookieStore.get('api_key') ;
	if ($cookieStore.get('role') != undefined) user.role = $cookieStore.get('role') ;
	if ($cookieStore.get('id') != undefined) user.id = $cookieStore.get('id') ;
	if ($cookieStore.get('name') != undefined) user.name = $cookieStore.get('name') ;


	user.authorize = function(accessLevel, role) {
			console.log("access +role "+ (accessLevel & user.role) );
			console.log("access "+accessLevel);
			console.log("role "+user.role);
			if (accessLevel == 'undefined') return 0;
            return accessLevel & user.role;
        };

	user.isLoggedIn= function() {
            if(user.name === null)
                return false;
            return true;
        };
	user.isAdmin= function() {
            if(user.role === 4)
                return true;
            return false;
        };
	user.register = function(user, success, error) {
            $http.post('/register', user).success(success).error(error);
        };

	user.login =  function(username, password, rememberme) {
				var deferred = $q.defer();
				console.log(rememberme);
					
	 	           	$http.post('/api_node/login', { username: username, password: password })
	 	           	.success(function(data){
		                user.api_key = data.api_key;
		                user.role = data.role;
		                user.name = username;
		                user.id = data.id;
		                
		                if (rememberme){
		                	console.log("crea coke");
			                $cookieStore.put('api_key', user.api_key);
			                $cookieStore.put('role', user.role);
			                $cookieStore.put('name', user.name);
			                $cookieStore.put('id', user.id);
			                }
	                	deferred.resolve('OK');
	                
	            	})
	            	.error(
	            	function(data){
	                    deferred.reject(data.message);
                	});
             	return deferred.promise;
             	
        };

	user.logout =  function() {
			var deferred = $q.defer();

				$cookieStore.remove('api_key');
			    $cookieStore.remove('role');
			    $cookieStore.remove('name');
			    $cookieStore.remove('id');
            $http({method: 'POST', url : '/api_node/logout', headers : {user_id: user.id, apiKey:user.api_key} }).success(function(){
				user.role =	1;
				user.api_key = "";
				user.name = null;
				deferred.resolve();
            }).error(function(data) {
            
            	user.role =	1;
				user.api_key = "";
				user.name = null;
				deferred.resolve();
            
            deferred.reject(data.message);} );

            return deferred.promise;
        };
        
  user.getname = function() {
    return user.name;
  };
  	user.register =  function(name,email, password, verification, groups) {
				var deferred = $q.defer();
				
					
	 	           	$http.post('/api_python/register', { name: name, email:email,   password: password, verification:verification, groups:groups })
	 	           	.success(function(data){
		                console.log("OK");
		                
	                	deferred.resolve('OK');
	                
	            	})
	            	.error(
	            	function(error){
	                    deferred.reject(error);
                	});
             	return deferred.promise;
             	
        };
        
    
	return user;




    
}]);



