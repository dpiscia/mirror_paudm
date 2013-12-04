'use strict';

/* Controllers */

angular.module('strc_query.controllers', [])
	.controller('strc_query_ctrl', ['$scope', 'table_list','$state', function strc_query_ctrl($scope, table_list,$state) {
   		$scope.db_list = table_list;
   		$scope.showTables = true;
   		$scope.tables_filter =  $state.params.table_name;
   		$scope.select = function(name){console.log(name);
   						$scope.tables_filter = name;
   						$state.transitionTo('strc_query.fields', {table_name:name});
   						}
}]).controller('strc_query_fields_ctrl', ['$scope','$stateParams','$state','fields_list', function ($scope, $stateParams, $state, fields_list) {
		$scope.fields = [];
		$scope.fields_btn = fields_list.list.map(function(x,i){if(i==0 || i==1)return true; return false;});
		$scope.limit = 100;
		$scope.conditions = [];
		$scope.showFields = true;
		$scope.check_all = function(fields){
			fields.forEach(
				function(value,index,array)
					{array[index] = true;
					}
			)};
		$scope.uncheck_all = function(fields){
			fields.forEach(
				function(value,index,array)
					{array[index] = false;
					}
			)};
		$scope.add_condition = function(){$scope.conditions.push({field : "", op: "", value :"" , logical : ""}); }
		$scope.remove_condition = function(index){$scope.conditions.splice(index,1); }
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
			$scope.fields = [];
			$scope.fields_btn.map(function(x,index){if (x != 'undefined' && x ==true)  $scope.fields.push($scope.table_fields.list[index]);})
			$state.transitionTo('strc_query.fields.results', { table_name:$stateParams.table_name, fields :$scope.fields, where: $scope.conditions.map(function(x){return x.field+" "+x.op+" "+x.value+" "+x.logical}), limit:$scope.limit});
		}
		//table_schema.query({table_name :$stateParams.contactId}	
}]).controller('strc_query_results_ctrl', ['$scope','results','$stateParams', function ($scope , results, $stateParams) {
   		$scope.results = results;
   		$scope.type = 'table';
   		$scope.heads = function(dict){
   		var heads = [];
   		for (var key in dict) if (!(key.substring(0, 1) === '$' ))heads.push(key);
   		return heads;
   		}
   		$scope.columns = $scope.heads($scope.results[0]);
   		$scope.var1 = $scope.columns[0];
   		$scope.var2 = $scope.columns[1];		
   		$scope.data = results.map(
   			function(x)
   			{return [ x[$scope.var1], x[$scope.var2] ] });
		$scope.$watch('var1+var2', function() {
			   		$scope.data = results.map(
			   			function(x)
			   			{return [ x[$scope.var1], x[$scope.var2] ] });
			   		})
   		

}])
;