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
				dest: '<%= dirs.dest %>/scripts/config.js',
				wrap: '"use strict";\n\n <%= __ngModule %>',
				name: 'config',
				constants: {
					ENV: 'development'
				}
			}],
			production: [{
				dest: '<%= dirs.dest %>/scripts/config.js',
				wrap: '"use strict";\n\n <%= __ngModule %>',
				name: 'config',
				constants: {
					ENV: 'production'
				}
			}]
		}
	})
	

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-ng-constant');
  // Default task(s).
	grunt.registerTask('default', ['clean','ngconstant:development','concat','uglify']);
	grunt.registerTask('production', ['clean','ngconstant:production','concat','uglify']);
   
};