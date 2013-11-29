'use strict';

/* Controllers */

angular.module('strc_query.controllers', [])
	.controller('strc_query_ctrl', ['$scope', 'table_list','$state', function strc_query_ctrl($scope, table_list,$state) {
   		$scope.db_list = table_list;
   		$scope.tables_filter;
   		$scope.$watch('tables_filter', function() {
   		if ($scope.tables_filter != null){
   			console.log($scope.tables_filter);
   			$state.transitionTo('strc_query.fields', {table_name:$scope.tables_filter});
   			}
   		})
}]).controller('strc_query_fields_ctrl', ['$scope','$stateParams','$state','fields_list', function ($scope, $stateParams, $state, fields_list) {
		$scope.fields = [];
		$scope.add_field = function(){$scope.fields.push({name : ""}); }
		$scope.remove_field = function(index){
			$scope.fields.splice(index,1); 
			};
		$scope.conditions = [];
		$scope.add_condition = function(){$scope.conditions.push({field : "", op: "", value :""}); }
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
		$scope.submit = function(){
			console.log($stateParams.table_name+"/"+$scope.field+"/"+$scope.op_filter+"/"+$scope.value);
			$state.transitionTo('strc_query.fields.results', { table_name:$stateParams.table_name, fields : '*', where: $scope.field+$scope.op_filter+$scope.value, limit:'100'});
		}
		//table_schema.query({table_name :$stateParams.contactId}	
}]).controller('strc_query_results_ctrl', ['$scope','results','$stateParams', function ($scope , results, $stateParams) {
   		$scope.results = results;

}]);