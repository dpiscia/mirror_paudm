/*
 * grunt-ng-constant
 * https://github.com/mlegenhausen/grunt-ng-constant
 *
 * Copyright (c) 2013 Malte Legenhausen
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
	grunt.initConfig({
	
		pkg: grunt.file.readJSON('package.json'),
 		dirs: {
			app: 'app/*.js',
			job_monitor: 'app/job_monitor/*.js',
			dest: 'dist/<%= pkg.name %>/<%= pkg.version %>',
			dest_config : 'app/config'
		},
		concat: {
			basic: {
				src: ['<%= dirs.app %>','<%= dirs.job_monitor %>'],
				dest: '<%= dirs.dest %>/<%= pkg.name %>.js',
			},

		},
		clean: ['<%= dirs.dest %>/*'],
		uglify: {
			dist:{
				
				src: '<%= concat.basic.dest %>',
				dest:'<%= dirs.dest %>/<%= pkg.name %>_min.js'
			}
		},
		ngconstant: {
				options: {
				space: '  '
	  		},
	
	  // targets
			development: [{
				dest: '<%= dirs.dest_config %>/config_env.js',
				wrap: '"use strict";\n\n <%= __ngModule %>',
				name: 'config',
				constants: {
					ENV: {python :'', node : 'http://localhost:3000'}
				}
			}],
			production: [{
				dest: '<%= dirs.dest_config %>/config_env.js',
				wrap: '"use strict";\n\n <%= __ngModule %>',
				name: 'config',
				constants: {
					ENV: {python :'/api', node : ''}
				}
			}]
		},
		preprocess : {
	
		    dev : {
		
		        src : 'app/index.html',
		        dest : 'dev/index.html',
		
		    },
		
		    prod : {
		
		        src : 'app/index.html',
		        dest : '<%= dirs.dest %>/index.html',
		         options : {
			                    context : {
					                dest : '<%= dirs.dest %>',
	            		}
	            	}
		
		        }
		
		  },
		  env : {

		    options : {
		
		        /* Shared Options Hash */
		        //globalOption : 'foo'
		
		    },
		
		    dev: {
		
		        NODE_ENV : 'DEVELOPMENT'
		
		    },
		
		    prod : {
		
		        NODE_ENV : 'PRODUCTION'
		
		    }
		
		},

	})
	

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-ng-constant');
	grunt.loadNpmTasks('grunt-preprocess');
	grunt.loadNpmTasks('grunt-env');
  // Default task(s).
	grunt.registerTask('development', ['clean','env:dev','ngconstant:development','concat','uglify','preprocess:dev']);
	grunt.registerTask('production', ['clean','env:prod','ngconstant:production','concat','uglify','preprocess:prod']);
   
};