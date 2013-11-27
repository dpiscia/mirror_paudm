'use strict';

/* Controllers */

angular.module('db_manage.controllers', [])
	.controller('db_schema', ['$scope', 'table_list', function db_schema($scope, table_list) {
   		$scope.db_list = table_list;
}])
   .controller('tables_plot', ['$scope', function ($scope) {
   		$scope.selection = "circle";
   		
		$scope.prov = {"nodes" : [], "links" : []};
		for (var i = 0; i < $scope.db_list.length; i++) {
    		$scope.prov.nodes.push({"name" : $scope.db_list[i].name , "group" : 1});
		}

		function name_id(list,name){
			for (var i = 0; i < list.length; i++)
				{if (list[i].name === name) return i}
		}
		var matrix = new Array();
		
		for (i=0;i<$scope.db_list.length;i++) {
			matrix[i]=new Array();
			for (j=0;j<$scope.db_list.length;j++) {
				matrix[i][j]=0;
			}
		}
		for (var i = 0; i < $scope.db_list.length; i++) {
  			for (var j = 0; j < $scope.db_list[i].foreign_keys.length; j++){
  				$scope.db_list[i].foreign_keys[j].split(".")[0];  
				$scope.prov.links.push({"source" : i, "target" : name_id($scope.prov.nodes,$scope.db_list[i].foreign_keys[j].split(".")[0]) , "value" : i});
				matrix[i][name_id($scope.prov.nodes,$scope.db_list[i].foreign_keys[j].split(".")[0])] = 1;
				
			}
		}
		$scope.data = $scope.prov


		$scope.data_test = {
			packageNames: $scope.prov.nodes.map(function(x){return x.name;}),
			matrix: matrix // B doesn't depend on A or Main
		};
}])
		
	.controller('fields_list', ['$scope','$stateParams','$state','table_schema','fields_list', function ($scope, $stateParams, $state, table_schema,fields_list) {
		$scope.prova   = $stateParams.contactId;
		$scope.table_fields = fields_list;
}]);