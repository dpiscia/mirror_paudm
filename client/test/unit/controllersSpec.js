'use strict';

/* jasmine specs for controllers go here */


/*beforeEach(function (){module('paudm_db.controllers')});
describe('PhoneCat controllers', function() {

   it('controller 1 should create db_list 0', inject(function($controller) {
          var scope = {},
          ctrl = $controller('MyCtrl2', { $scope: scope });
          expect(scope.db_list.length).toBe(0);
    })); 
    
 

 
});*/

describe('myApp', function () {
    var scope,
        controller,
        state,
        service;
    beforeEach(function () {
        module('paudm_db');
    });
    
    // Mocking service?
    beforeEach(module(function ($provide) {
        service = { query: function () {
                return ['User','Job'];
            }};        
        $provide.value('db_list', service);
    }));
    
    describe('MyCtrl1', function () {
        beforeEach(inject(function ($rootScope, $state,  $controller) {
            scope = $rootScope.$new();
            state = $state;
            controller = $controller('MyCtrl1', {
                '$scope': scope,
                '$state':state
            });
        }));
        
        it('user still not there', function () {
        	
        	scope.db_list = service.query();
            expect(scope.db_list.length).toBe(2);
        });


    });
});


