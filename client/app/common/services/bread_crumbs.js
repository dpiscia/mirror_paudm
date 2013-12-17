'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('paudm.breadcrumbs', []);
angular.module('paudm.breadcrumbs').factory('breadcrumbs', ['$rootScope', '$location', function($rootScope, $location){

  var breadcrumbs = [];
  var breadcrumbsService = {};
  breadcrumbs = breads();
  //we want to update breadcrumbs only when a route is actually changed
  //as $location.path() will get updated imediatelly (even if route change fails!)
 $rootScope.$on('$locationChangeSuccess', function(event, current){
	breadcrumbs = breads();
  });

  breadcrumbsService.getAll = function() {
    return breadcrumbs;
  };

  breadcrumbsService.getFirst = function() {
    return breadcrumbs[0] || {};
  };

  return breadcrumbsService;



	function breads() {
	var pathElements = $location.path().split('/'), result = [], i;
	
    var breadcrumbPath = function (index) {
      return '#/' + (pathElements.slice(0, index + 1)).join('/');
    };

    pathElements.shift();

    for (i=0; i<pathElements.length; i++) {  
      result.push({name: pathElements[i].replace(/_/g, ' '), path: breadcrumbPath(i)});
    }
	//hack specific for job 
	for (i=(result.length-1); i>0; i--) {
		if(result[i].name.split(" ")[0] == parseInt(result[i].name.split(" ")[0])){
		result[i-1].name = result[i-1].name +" "+ result[i].name;
		result[i-1].path = result[i].path;
		result.splice(i,1);
		}
	}
    return result;
    }
    
}]);