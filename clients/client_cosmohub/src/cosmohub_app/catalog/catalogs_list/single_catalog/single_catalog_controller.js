'use strict';

/* Controllers */

angular.module('catalogs.controllers').controller('single_catalog_ctrl', [ '$scope','catalog','user_auth','$location', function ($scope, catalog, user_auth, $location) {
   		$scope.catalog = catalog;

   		
}]);