'use strict';

module.exports = function(grunt) {
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        clean: {
            design: {
                expand: true,
                cwd: 'build/',
                src: ['*.html', 'css/*.css', 'images/*']
            },
            dist: {
                src: 'build/'
            }
        },
        copy: {
            design: {
                expand: true,
                cwd: '',
                src: ['*.html', 'css/*.css', 'images/*'],
                dest: 'build/',
                filter: 'isFile'
            },
            dist: {
                expand: true,
                cwd: '',
                src: ['images/*'],
                dest: 'build/',
                filter: 'isFile'
            }
        },
    });

    grunt.registerTask('build:design', ['clean:design', 'sass:build', 'copy:design']);
    grunt.registerTask('design', ['build:design', 'express:design', 'watch:design']);
    grunt.registerTask('build:dist', ['clean:dist', 'sass:dist', 'htmlmin:dist', 'cssmin:dist', 'copy:dist']);
};