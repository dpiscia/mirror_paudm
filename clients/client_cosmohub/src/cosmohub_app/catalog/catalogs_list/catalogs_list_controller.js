angular.module('catalogs_app').controller('catalogs_list_ctrl', [ '$scope','catalogs','user_auth','$location',  function ($scope, catalogs, user_auth, $location) {
   		$scope.catalogs = catalogs.catalogs;
   		
}]);
