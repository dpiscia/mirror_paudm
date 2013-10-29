'use strict';

/* Controllers */

angular.module('paudm_db.controllers', [])
   .controller('HeaderCtrl', ['$scope','$state', function HeaderCtrl($scope, $state) {
	$scope.db = {"prova":"Header ctrl view"};

    }]).
  controller('MyCtrl1', ['$scope','db_list','$state', function MyCtrl1($scope, db_list, $state) {
  	db_list.query({}, function(data){
	//1.callback on d3.plot, in the future implement on promise
	//2. implement callback on failure
	$scope.db_list = data;
	
	console.log('success, got data: ');
	
	});
	console.log("ccc");
	$state.go('view1.list');
  }])
   .controller('db_list', ['$scope', function db_list($scope) {
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
  .controller('MyCtrl2', ['$scope','$stateParams','$state','table_schema', function MyCtrl2($scope, $stateParams, $state, table_schema) {
	$scope.prova   = $stateParams.contactId;
	console.log($scope.prova);
	table_schema.query({table_name :$stateParams.contactId}, function(data){
	//1.callback on d3.plot, in the future implement on promise
	//2. implement callback on failure
	$scope.table_fields = data;
	
	console.log('success, got data: ');
	
	});
  }]);