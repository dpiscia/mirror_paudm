angular.module('catalogs_app').controller('catalogs_list_ctrl', [ '$scope','catalogs','user_auth','$location','$stateParams',  function ($scope, catalogs, user_auth, $location, $stateParams) {
   		$scope.catalogs = catalogs.catalogs;
   		if ($stateParams.group !== null) {$scope.groups_filter = $stateParams.group.toUpperCase();}
   		if ($stateParams.public !== null) {$scope.status_filter = $stateParams.public;}
   		if ($stateParams.type !== null) {$scope.type_filter = $stateParams.type;}
}]);
