module.exports = function(config){
    config.set({
    basePath : '../',

    files : [
      'app/lib/angular/angular.js',
      'app/lib/angular/angular-resource.js',
      'test/lib/angular/angular-mocks.js',
      'app/js/**/*.js',
      'app/lib/angular/angular-ui-router.js',
      'app/lib/angular/angular-route.js',
      'test/unit/controllersSpec.js',
      'app/lib/d3/d3_3.3.9_ang.js',
      'app/lib/d3/force_dep.js'
    ],

    singleRun : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

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
