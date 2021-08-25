module.exports = function (grunt) { 
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks); 

    grunt.initConfig({ 
        pkg: grunt.file.readJSON('package.json'), 
		watch: {
			configFiles: {
				files: [ 'Gruntfile.js' ],
				options: { reload: true }
			},
			scripts: {
			  	files: ['docs/_includes/assets/js/*.js'],
			  	tasks: ['uglify'],
			  	options: { spawn: false },
			},
			css: {
				files: ['docs/_includes/assets/css/*.css'],
				tasks: ['cssmin'],
				options: { spawn: false },
			}
		},
        cssmin: { 
            styles: { 
                options: { 
                    banner: '' 
                }, 
                files: { 
                    'docs/assets/css/styles.min.css': [ 
                        'docs/_includes/assets/css/*.css'] 
                } 
            } 
        }, 
        uglify: { 
            options: { 
                compress: true 
            }, 
            site: { 
                src: [ 
                	'docs/_includes/assets/js/*.js'
                ], 
                dest: 'docs/assets/js/site.min.js' 
            } 
        } 
    }); 
    
    grunt.registerTask('default', ['uglify', 'cssmin']); 
};