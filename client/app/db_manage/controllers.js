'use strict';

/* Controllers */

angular.module('db_manage.controllers', [])
.
  controller('db_schema', ['$scope', 'table_list', function db_schema($scope, table_list) {
   
	$scope.db_list = table_list;
  }])
   .controller('tables_plot', ['$scope', function ($scope) {
	$scope.db = {"prova":"view1.list plot  view"};
$scope.prov = {"nodes" : [], "links" : []};
for (var i = 0; i < $scope.db_list.length; i++) {
    $scope.prov.nodes.push({"name" : $scope.db_list[i].name , "group" : 1});
}

function name_id(list,name){
for (var i = 0; i < list.length; i++)
{if (list[i].name === name) return i}
}


for (var i = 0; i < $scope.db_list.length; i++) {
  for (var j = 0; j < $scope.db_list[i].foreign_keys.length; j++)
{$scope.db_list[i].foreign_keys[j].split(".")[0];  
$scope.prov.links.push({"source" : i, "target" : name_id($scope.prov.nodes,$scope.db_list[i].foreign_keys[j].split(".")[0]) , "value" : i});}
}
$scope.data = $scope.prov

  }])
  .controller('fields_list', ['$scope','$stateParams','$state','table_schema','fields_list', function ($scope, $stateParams, $state, table_schema,fields_list) {
	$scope.prova   = $stateParams.contactId;
	console.log($scope.prova);

	$scope.table_fields = fields_list;

  }]);