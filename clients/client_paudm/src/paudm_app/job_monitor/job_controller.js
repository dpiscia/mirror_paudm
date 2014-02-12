angular.module('paudm_jobs')
	.controller('job_single', ['$scope', 'job','QC','$http', '$modal', function job_single($scope, job,QC, $http, $modal ) {
		$scope.job = job[0];
		$scope.quality_controls = QC;	
		window.qc = "";
		$http({method: "GET", url: "http://localhost:3000/qc_constants.py"}).success(function(data){$scope.info = eval("(" +data+ ')'); });
		$scope.open = function (name) {
 			 	$scope.img = name;
				var modalInstance = $modal.open({
					templateUrl: 'myModalContent.html',
		      		controller: function ($scope, $modalInstance, items) {
									$scope.plot_name = items;	
									$scope.cancel = function () {
									$modalInstance.dismiss('cancel');		
									};
							},
					resolve: {
						items: function () {
							return $scope.img;
						}
					}
				});
		}
  }]);
  
 angular.module('paudm_jobs')
	.controller('jobs_controller', ['$scope', 'jobs','productions','$location','$stateParams',  function jobs_controller($scope, jobs,productions, $location, $stateParams) {
		$scope.jobs = jobs;
		$scope.detail = false;
		if ($location.path().indexOf('Top_level_jobs/') !== -1) $scope.detail = true;
		if ($scope.detail){
			$scope.parent_job = [];
			$scope.parent_job.push($scope.jobs[0]);
			$scope.jobs.splice(0,1);
			}
		$scope.task_filter = "!!";
		$scope.status_filter = "!!";
		$scope.production_filter = "!!";
		$scope.orderProp = '-id';
    	$scope.productions = productions;
  		$scope.currentPage = 1;
  		$scope.maxSize = 10;
  		$scope.current_location = '#'+$location.$$url;
  		$scope.items = ['pie_chart', 'bar_chart', 'other'];
		$scope.selection = $scope.items[0];
		$scope.type_tasks = ['task','status','qc'];
		$scope.type_task = $scope.type_tasks[1];
		//$rootScopeProvider.limit = 20;
  }]);