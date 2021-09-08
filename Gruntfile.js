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
			  	files: ['src/js/*.js'],
			  	tasks: ['uglify'],
			  	options: { spawn: false },
			},
			css: {
				files: ['src/css/*.css'],
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
                    'docs/_includes/assets/css/site/styles.min.css': [ 
                        'src/css/*.css'] 
                } 
            } 
        }, 
        uglify: { 
            options: { 
                compress: true 
            }, 
            site: { 
                src: [ 
                	'src/js/*.js'
                ], 
                dest: 'docs/_includes/assets/js/site/extrastuff.min.js' 
            } 
        } 
    }); 
    
    grunt.registerTask('default', ['uglify', 'cssmin']); 
};