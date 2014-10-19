'use strict';
//var util = require('util');
//var path = require('path');
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
                    name: 'CSS Min',
                    value: 'grunt-contrib-cssmin'
                }, {
                    name: 'HTML Min',
                    value: 'grunt-contrib-htmlmin'
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
        if(this.addGrunt){
            this.copy('_Gruntfile.js', 'Gruntfile.js');
        }
    },

    installs: function(){
        this.npmInstall(['grunt'], { 'saveDev': true }, done);

        if(this.adds.length > 0){
            for(var i = 0; i < this.adds.length; i++){
                var done = this.async();
                this.npmInstall(['grunt-browserify'], { 'saveDev': true }, done);
                this.npmInstall(['debowerify'], { 'saveDev': true }, done);
            }
            // installingLodash: function() {
            //     var done = this.async();
            //     this.npmInstall(['lodash'], { 'saveDev': true }, done);
            // }
        }

        if(this.grunts){
            //this.gruntfile.insertConfig("compass", "{ watch: { watch: true } }");
            //this.npmInstall(['lodash'], { 'saveDev': true }, done);
        }
    }
});

module.exports = AppgGenerator;
