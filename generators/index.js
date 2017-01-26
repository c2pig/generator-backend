'use strict';
var Generator = require('yeoman-generator');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');

module.exports = Generator.extend({
  prompting: function () {
    var prompts = [
    {
      type    : 'input',
      name    : 'projectName',
      message : 'Your project brand',
      default : this.appname.replace(/ /g, '-')
    },
    {
      type    : 'input',
      name    : 'serviceName',
      message : 'Service name will be deployed',
      default : "example-review-service"
    },
    {
      type    : 'input',
      name    : 'awsRegion',
      message : 'AWS Region',
      default : 'ap-southeast-1'
    },
    {
      type    : 'input',
      name    : 'awsAccountId',
      message : 'AWS Account Id',
      default : '023333458513'
    },
    {
      type    : 'input',
      name    : 'codeDir',
      message : 'Code Directory',
      default : 'code'
    },
  ];

    return this.prompt(prompts).then(function (props) {
      this.config.set(props);
      this.props = props;
    }.bind(this));

    this.config.save();
  },
  configuring: function() {
    this.composeWith(require.resolve('review-service/generators/app'),  this.props);
  },
  writing: function () {
    let YAML = require('js-yaml');

    // TODO: dont quite like this, can we do { tmp/**/*.tmp : ../serverless.yml }
    const partials = {
      'tmp/ingest.func.tmp' : 'serverless.yml',
      'tmp/validation.func.tmp' : 'serverless.yml',
      'tmp/moderation.func.tmp' : 'serverless.yml',
      'tmp/view.func.tmp' : 'serverless.yml'
    };

    const contentMerge = (fromFile, toFile) => {

      let partialCfg = YAML.safeLoad(this.fs.read(fromFile));

      if(! this.mainCfg) {
        this.mainCfg = YAML.safeLoad(this.fs.read(toFile));
      }

      if(! this.mainCfg.functions) {
        this.mainCfg.functions = {};
      }
      this.mainCfg.functions = Object.assign(this.mainCfg.functions, partialCfg);
      this.fs.write(toFile, YAML.safeDump(this.mainCfg));
    }

    const translatedTemplateMerge = (fromFile, toFile) => {
      return contentMerge(this.destinationPath(fromFile), this.destinationPath(toFile));
    }

    const fileOps = ((action, files) => {
      Object.keys(files).forEach((function(path) {
        const dest = files[path] || path;
        action(path, dest);
      }).bind(this));
    }).bind(this);

    //fileOps(translatedTemplateMerge, partials);

    console.log(`creating dir:${this.props.codeDir}`);
    mkdirp(this.props.codeDir||".");
  },
  install: function () {
    let fs = require('fs');
    this.fs.copy(this.destinationPath('tmp/**/*.tmp'), this.destinationPath('tmp-1/'),
    {
      process: (content) => {
        fs.appendFile(this.destinationPath('serverless.yml'), content, (err) => {
          if(err !== null) {
            console.log(err);
          }
        });
        return content;
    }});
    this.installDependencies({bower:false, npm:true});
  },
  end: function() {
    console.log('clean up tmp/ ...');
    let done = (x) => {
      if(x !== null) {  console.log(x); }
    };
    rimraf("tmp/", done);
    rimraf("tmp-1/", done);
  }
});
