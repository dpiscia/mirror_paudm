angular.module('job_monitor.single_job', [])
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
  