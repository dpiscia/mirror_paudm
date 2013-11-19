module.exports = function(config){
    config.set({
    basePath : '../',

    files : [
      'app/lib/angular/angular.min.1.2.js',
      'app/lib/angular/angular-resource.js',
      'test/lib/angular/angular-mocks.js',
      'app/db_manage/*.js',
      'app/job_monitor/*.js',
      'app/common/*/*.js',
      'app/common/*/*/*.js',
      'app/lib/angular/angular-ui-router.js',
      'app/lib/angular/angular-route.js',
      'test/unit/controllersSpec.js',
      'app/lib/d3/d3_3.3.9_ang.js',
      'app/*.js'
    ],

    singleRun : true,

    frameworks: ['jasmine'],

    browsers : ['Firefox'],

    plugins : [
            'karma-junit-reporter',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine'       
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

})}
