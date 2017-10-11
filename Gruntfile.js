module.exports = function (grunt) {
	var plato = require('plato');

	const HTTP_PORT = 7777;
	const ROOT_DIR = './';
	const APP_DIR = 'simulator';

	grunt.file.defaultEncoding = 'utf8';

	grunt.initConfig({
		connect: {
			options: {
				port: HTTP_PORT,
				hostname: '*',
				keepalive: true
			},
			app: {
				options: {
					open: 'http://127.0.0.1:' + HTTP_PORT + '/' + APP_DIR + '/index.html',
					base: ROOT_DIR
				}
			}
		},
		jsdoc: {
			app: {
				src: [
					'./modules/*.js',
					'./README.md'
				],
				options: {
					destination: './docs'
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-jsdoc');

	grunt.registerTask('plato', function(){
		var done = this.async();
		var files = [
			'./modules/*.js',
			'./simulator/scripts/*.js'
		];
		var outputDir = './plato-report';
		var options = {
			title: 'JavaScript Source Analysis',
			jshint: {
				options: grunt.file.readJSON(grunt.config.process('./.jshintrc'))
			}
		};

		plato.inspect(files, outputDir, options, done);
	});

	grunt.registerTask('all', ['jsdoc:app', 'plato']);
};
