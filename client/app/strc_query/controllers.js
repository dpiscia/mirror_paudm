'use strict';

/* Controllers */

angular.module('strc_query.controllers', [])
	.controller('strc_query_ctrl', ['$scope', 'table_list','$state', function strc_query_ctrl($scope, table_list,$state) {
   		$scope.db_list = table_list;
   		$scope.tables_filter =  $state.params.table_name;
   		$scope.$watch('tables_filter', function() {
   		if ($scope.tables_filter != null){
   			console.log($scope.tables_filter);
   			$state.transitionTo('strc_query.fields', {table_name:$scope.tables_filter});
   			}
   		})
}]).controller('strc_query_fields_ctrl', ['$scope','$stateParams','$state','fields_list', function ($scope, $stateParams, $state, fields_list) {
		$scope.fields = [];
		$scope.limit = 100;
		$scope.add_field = function(){$scope.fields.push({name : ""}); }
		$scope.remove_field = function(index){
			$scope.fields.splice(index,1); 
			};
		$scope.conditions = [];
		$scope.add_condition = function(){$scope.conditions.push({field : "", op: "", value :"" , logical : ""}); }
		$scope.remove_condition = function(index){
			$scope.conditions.splice(index,1); 
			}
		$scope.prova   = $stateParams.table_name;
		$scope.table_fields = fields_list;
		$scope.comparison_op = [{name : 'less than', op : '<'},
								{name : 'greater than', op : '>'},
								{name : 'less than or equal to', op : '<='},
								{name : 'less than or equal to', op : '>='},
								{name : 'equal than', op : '='},
								{name : 'not equal', op : '!='}
								]
		$scope.logical_op = ['AND','OR','NOT']
								
		$scope.submit = function(){
			console.log($stateParams.table_name+"/"+$scope.field+"/"+$scope.op_filter+"/"+$scope.value);
			$state.transitionTo('strc_query.fields.results', { table_name:$stateParams.table_name, fields : $scope.fields.map(function(x){return x.name}), where: $scope.conditions.map(function(x){return x.field+" "+x.op+" "+x.value+" "+x.logical}), limit:$scope.limit});
		}
		//table_schema.query({table_name :$stateParams.contactId}	
}]).controller('strc_query_results_ctrl', ['$scope','results','$stateParams', function ($scope , results, $stateParams) {
   		$scope.results = results;
   		$scope.heads = function(dict){
   		var heads = [];
   		for (var key in dict) if (!(key.substring(0, 1) === '$' ))heads.push(key);
   		return heads;
   		}
   		$scope.columns = $scope.heads($scope.results[0]);
		
   		$scope.data = results.map(function(x){return [x[$scope.heads[0]], x[$scope.heads[1]]});

}]);