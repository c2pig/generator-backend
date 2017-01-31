'use strict';
var Generator = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = Generator.extend({
  prompting: function () {

    var prompts = [{
      type: 'checkbox',
      name: 'features',
      message: 'Choose a sample project :-',
      choices: [{
        name: 'Example',
        value: 'example',
        checked: true
      }, {
        name: 'CPP Review Service',
        value: 'cpp',
        checked: false
      }, {
        name: 'CAIN Review Service',
        value: 'cain',
        checked: false
      }]
      }];
    return this.prompt(prompts).then(function (props) {
      this.props = props;
    }.bind(this));
  },

  writing: function () {
    let selection = this.props.features.pop(0);
    if(selection === "example") {
      this.composeWith(require.resolve('generator-gdp-backend/generators/app'),  this.props);
    } else if(selection === "cpp") {

    } else if(selection === "cain") {
    }

  },

  install: function () {
    this.installDependencies();
  }
});
