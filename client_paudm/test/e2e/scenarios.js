'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('my app', function() {

  beforeEach(function() {
    browser().navigateTo('/');
  });


  it('should automatically redirect to /view1/list when location hash/fragment is empty', function() {
   console.log(browser().location().path());
    expect(browser().location().path()).toBe("/db_schema");
  });


  describe('view1', function() {

    beforeEach(function() {
      browser().navigateTo('#/db_schema/list');
    });


    it('should render view1 when user navigates to /db_schema/list', function() {
    	
		expect(browser().location().path()).toBe("/db_schema/list");
    });

  });



  describe('view2', function() {

    beforeEach(function() {
      browser().navigateTo('#/db_schema/global_object');
    });


    it('should render view2 when user navigates to /view2', function() {
expect(browser().location().path()).toBe("/db_schema/global_object");
    });

  });
});
