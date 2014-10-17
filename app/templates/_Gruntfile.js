'use strict';

module.exports = function(grunt) {
    // 1. All configuration goes here 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        uglify: {
            build: {
                src: 'production.js',
                dest: 'production.min.js'
            }
        },

        jshint: {
            all: [
                'Gruntfile.js',
                '*.js']
        },  

        watch: {
            // options: {
            //     livereload: true,
            // },
            scripts: {
                files: ['*.js'],
                tasks: ['concat', 'uglify', 'jshint'],
                options: {
                    spawn: false,
                    //livereload: true,
                },
            }

            // css: {
            //     files: ['css/*.scss'],
            //     tasks: ['sass'],
            //     options: {
            //         spawn: false,
            //     }
            // }
        }

        // add to watch, loadNpmTasks & registerTask
        // sass: {
        //     dist: {
        //         options: {
        //             style: 'compressed'
        //         },
        //         files: {
        //             'css/build/global.css': 'css/global.scss'
        //         }
        //     } 
        // }
        
        // add to loadNpmTasks & registerTask
        // imagemin: {
        //    dynamic: {
        //        files: [{
        //            expand: true,
        //            cwd: 'images/',
        //            src: ['**/*.{png,jpg,gif}'],
        //            dest: 'images/build/'
        //        }]
        //    }
        // }

    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['uglify', 'jshint', 'watch']);
};