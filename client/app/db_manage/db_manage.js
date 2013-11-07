'use strict';



// Declare app level module which depends on filters, and services
angular.module('paudm_db', [
  'db_manage.controllers',
  'paudm.db_schema'
  
]).run(
      [        '$rootScope', '$state', '$stateParams',
      function ($rootScope,   $state,   $stateParams) {

        // It's very handy to add references to $state and $stateParams to the $rootScope
        // so that you can access them from any scope within your applications.For example,
        // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
        // to active whenever 'contacts.list' or one of its decendents is active.
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
      }]).
    config(
    [          '$stateProvider', '$urlRouterProvider',
      function ($stateProvider,   $urlRouterProvider) {

        /////////////////////////////
        // Redirects and Otherwise //
        /////////////////////////////
		 
        // Use $urlRouterProvider to configure any redirects (when) and invalid urls (otherwise).
   
        
        $stateProvider

          //////////
          // Home //
          //////////

          .state("db_schema", {
            
            // Use a url of "/" to set a states as the "index".
            url: "/db_schema",
            templateUrl: "static/partials/partial1.html", 
            resolve : {        
            table_list: function($q, db_list){
             var deferred = $q.defer();
             db_list.query({}, function(data){ deferred.resolve(data);})

             return deferred.promise;
         }},
            controller: "db_schema",
                

          })
          .state("db_schema.list", {

            // Use a url of "/" to set a states as the "index".
            url: "/list",
            templateUrl: "static/partials/db_list_plot.html", 
            controller: "tables_plot"


          })        .state('db_schema.table', {
            url: "/{contactId}",
            templateUrl: "static/partials/partial2.html",
                        resolve : {        
            fields_list: function($q, table_schema, $stateParams){
             var deferred = $q.defer();
             if (undefined != $stateParams ){
             table_schema.query({table_name :$stateParams.contactId}, function(data){
             deferred.resolve(data);
             })
             return deferred.promise;
             }
         }},
            controller: "fields_list"
        })
        
        
 }]);     
      
      