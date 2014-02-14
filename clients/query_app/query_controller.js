'use strict';

/* Controllers */

angular.module('query',['ui.ace']).controller('query_ctrl', [ '$scope','user_auth','$state','run_query_resources','columns','table', function ($scope, user_auth,$state,run_query_resources,columns, table) {
  if (typeof($scope.catalog) == 'undefined') {$scope.columns = columns; $scope.table = table }
  else {$scope.columns = $scope.catalog.columns; $scope.table = $scope.catalog.catalog.table;}

  $scope.aceModel = '';
  $scope.mode = 'SQL';
  $scope.readOnly = true;
  $scope.fields_btn = $scope.columns.map(function(x,i){ return false;});
  $scope.conditions = [];
  $scope.showQuery = true;
  $scope.add_condition = function(){
  									if ($scope.readOnly){
  									$scope.conditions.push({field : "", op: "", value :"" , logical : ""}); 
  									$scope.showConditions = true;}
  								}		
  $scope.remove_condition = function(index){if ($scope.readOnly)$scope.conditions.splice(index,1); }
  $scope.comparison_op = [{name : 'less than', op : '<'},
								{name : 'greater than', op : '>'},
								{name : 'less than or equal to', op : '<='},
								{name : 'greater than or equal to', op : '>='},
								{name : 'equal than', op : '='},
								{name : 'not equal', op : '!='}
								]
  $scope.logical_op = ['AND','OR','NOT']
  $scope.query_changed = function() {
    if ($scope.readOnly){
	  	$scope.fields = [];
		$scope.fields_btn.map(function(x,index){if (x != 'undefined' && x ==true)  $scope.fields.push($scope.columns[index]);})
	  	$scope.aceModel = " SELECT "+ $scope.fields.join()+' \n';
	  	$scope.aceModel = $scope.aceModel+" FROM "+$scope.table+' \n';
	  	if ($scope.conditions.length > 0)
	  	$scope.aceModel = $scope.aceModel+" WHERE "+ $scope.conditions.map(function(x){return x.logical+" "+x.field+" "+x.op+" "+x.value+" "}).join().replace(/,/g,'');
	  	}
  }
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
  // The ui-ace option
  
  
  $scope.aceOption = {
    mode: $scope.mode.toLowerCase(),
    onLoad: function (_ace) {
    	_ace.setReadOnly(true);
		_ace.session.setUseWrapMode(true);
      // HACK to have the ace instance in the scope...
      $scope.modeChanged = function () {
        _ace.getSession().setMode("ace/mode/" + $scope.mode.toLowerCase());
        _ace.setReadOnly($scope.readOnly);
        if ($scope.readOnly)
        	_ace.setTheme("ace/theme/textmate");
        else _ace.setTheme("ace/theme/twilight");
      };

    }
  };
  
   		if (typeof String.prototype.endsWith != 'function') {
		  // see below for better implementation!
			String.prototype.endsWith = function(suffix) {
			    return this.indexOf(suffix, this.length - suffix.length) !== -1;
			};
		}
  	
$scope.check_query = function() {run_query_resources.check($scope.aceModel, user_auth.api_key, user_auth.id).then(
   			function(data){ 
   							$scope.success = "QUERY has been succesfully checked "+ data;
    						$scope.error = ""
   							}, 
   			function(err){
   				console.log(err);
   				$scope.error = err;
   				$scope.success = "";
   				}
   			);}

  // Initial code content...
  $scope.realtime_query = function() {run_query_resources.run($scope.aceModel, user_auth.api_key, user_auth.id).then(


   			function(data){ $scope.results = data;
   							$scope.success = "QUERY has been succesfully run";
   							var state_url;
   							state_url = $state.current.name;
   							if (!state_url.endsWith('.results')) {state_url+='.results'; }
   							$state.go(state_url);
   							$scope.error = ""
   							}, 
   			function(err){
   				console.log(err);
   				$scope.error = err;
   				$scope.success = "";
   				}
   			);}
 	
  	
  	
}]);