'use strict';


// Declare app level module which depends on filters, and services
angular.module('paudm_db', [
  'ngRoute',
  'ngResource',
  'paudm_db.filters',
  'paudm_db.services',
  'paudm_db.directives',
  'paudm_db.controllers',
  'paudm_db.resources'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: 'MyCtrl1'});
  $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'MyCtrl2'});
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
