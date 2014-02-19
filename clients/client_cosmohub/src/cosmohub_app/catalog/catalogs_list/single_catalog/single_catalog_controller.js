'use strict';

/* Controllers */

angular.module('catalogs_app').controller('single_catalog_ctrl', [ '$scope','catalog','user_auth','$location','$http', function ($scope, catalog, user_auth, $location, $http) {
   		$scope.catalog = catalog;
		$scope.token = user_auth.api_key;
		$scope.user_id = user_auth.id;
		$scope.download= function(url){
   		$http({method: 'GET', url : url, headers : {user_id: user_auth.id, apikey:user_auth.api_key} }).success(function(){

				console.log('OK');
            }).error(function(err) {console.log(err);} );
            }
}]);


