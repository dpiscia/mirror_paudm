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
	user.name = null;


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

	user.logout =  function() {
			var deferred = $q.defer();
            $http({method: 'POST', url : 'http://localhost:3000/api_node/logout', headers : {user_id: user.id, apikey:user.api_key} }).success(function(){
            	user.role =	1;
				user.api_key = "";
				user.name = null;
				deferred.resolve();
            }).error(function(data) {deferred.reject(data.message);} );
            return deferred.promise;
        };
        
  user.getname = function() {
    return user.name;
  };
  	user.register =  function(name,email,surname, password, verification) {
				var deferred = $q.defer();
				
					
	 	           	$http.post('http://localhost:3000/api_node/register', { name: name, email:email, surname:surname,  password: password, verification:verification })
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