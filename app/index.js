'use strict';
//var util = require('util');
var path = require('path');
var fs = require('fs');
var yeoman = require('yeoman-generator');
var exec = require('child_process').exec;
//var yosay = require('yosay');
//var chalk = require('chalk');

var AppgGenerator = yeoman.generators.Base.extend({
    init: function(){
        this.pkg = require('../package.json');

        this.on('end', function (){
            if (!this.options['skip-install']){
                this.installDependencies();
            }
        });
    },

    askFor: function(){
        var done = this.async();

        var prompts = [{
            type: 'checkbox',
            name: 'adds',
            message: 'Select which plugins/modules you wish to add to your project:',
            choices: [{
                    name: 'Express Server',
                    value: 'grunt-express-server'
                }, {
                    name: 'Browserify',
                    value: 'grunt-browserify'
                }, {
                    name: 'Uglify',
                    value: 'grunt-contrib-uglify'
                }, {
                    name: 'Watch',
                    value: 'grunt-contrib-watch'
                }, {
                    name: 'HTML Min',
                    value: 'grunt-contrib-htmlmin'
                }, {
                    name: 'CSS Min',
                    value: 'grunt-contrib-cssmin'
                }, {
                    name: 'Sass',
                    value: 'grunt-contrib-sass'
                }, {
                    name: 'JSHint',
                    value: 'grunt-contrib-jshint'
                }],
            default: ''
        }];

        this.prompt(prompts, function (props){
            this.adds = props.adds;

            done();
        }.bind(this));
    },

    dirStructure: function(){
        this.mkdir('app');
    },

    fileStructure: function(){
        //this.copy('_Gruntfile.js', 'Gruntfile.js');
        //this.copy('_package.json', 'package.json');
    },

    installs: function(){
        var gruntString = "";
        var gruntRegString = "";
        var gruntRegDistString = "";

        this.npmInstall(['grunt'], { 'saveDev': true }, done);
        this.npmInstall(['grunt-contrib-clean'], { 'saveDev': true }, done);
        this.npmInstall(['grunt-contrib-copy'], { 'saveDev': true }, done);
        this.npmInstall(['matchdep'], { 'saveDev': true }, done);

        if(this.adds.length > 0){
            for(var i = 0; i < this.adds.length; i++){
                var done = this.async();
                this.npmInstall([this.adds[i]], { 'saveDev': true }, done);
            }

            if(this.adds.indexOf('grunt-browserify') != '-1'){
                this.npmInstall(['debowerify'], { 'saveDev': true }, done);
            }
        }

        //write gruntfile

        if(this.adds.indexOf('grunt-browserify') != '-1'){
            gruntString += "browserify: {" +
                                "build: {" +
                                    "options: {" +
                                        "transform: ['debowerify', 'browserify-ngannotate']," +
                                        "debug: true" +
                                    "}," +
                                    "src: ['app/js/**/*.js']," +
                                    "dest: 'build/bundle.js'" +
                                "}," +
                                "dist: {" +
                                    "options: {" +
                                        "transform: ['debowerify']," +
                                        "debug: true" +
                                    "}," +
                                    "src: ['test/angular/**/*test.js']," +
                                    "dest: 'test/angular-testbundle.js'" +
                                "}" +
                            "},";

            gruntRegString += "'browserify:build', ";
            gruntRegDistString += "'browserify:dist', ";
        }

        var data = "'use strict';" +
            "module.exports = function(grunt) {" +
                "require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);" +

                "grunt.initConfig({"
                    + gruntString +
                    "clean: {" +
                        "build: {" +
                            "expand: false," +
                            "cwd: 'build/'," +
                            "src: ['*.html', 'css/*.css', 'images/*']" +
                        "}," +
                        "dist: {" +
                            "src: 'build/'" +
                        "}" +
                    "}," +
                    "copy: {" +
                        "build: {" +
                            "expand: true," +
                            "cwd: ''," +
                            "src: ['*.html', 'css/*.css', 'images/*']," +
                            "dest: 'build/'," +
                            "filter: 'isFile'" +
                        "}," +
                        "dist: {" +
                            "expand: true," +
                            "cwd: ''," +
                            "src: ['images/*']," +
                            "dest: 'build/'," +
                            "filter: 'isFile'" +
                        "}" +
                    "}," +
                "});" +

                "grunt.registerTask('build', [" + gruntRegString + "'clean:build', 'copy:build']);" +
                "grunt.registerTask('dist', [" + gruntRegDistString + "'clean:dist', 'copy:dist']);" +
            "};";

        fs.writeFileSync('./Gruntfile.js', data);

        //if(this.adds.length > 0){
            //this.gruntfile.insertConfig("compass", "{ watch: { watch: true } }");
            //this.npmInstall(['lodash'], { 'saveDev': true }, done);
        //}
    }
});

module.exports = AppgGenerator;
