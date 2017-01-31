'use strict';
var Generator = require('yeoman-generator');
let convertedOutput, output, cwd;
let config;
module.exports = Generator.extend({
  initialize: function() {

    if(this.options['config-path']) {
      config = JSON.parse(this.fs.read(this.options['config-path']))[this.config.name];
    } else {
      config = this.config.getAll();
    }
    if(this.options.props) {
      Object.assign(config, JSON.parse(this.options.props));
    }
    console.log(config);
    convertedOutput = (this.options.output || 'serverless.yml') + ".tmp";
    output = this.options.output || 'serverless.yml';
    cwd = this.destinationPath();
    this.fs.delete(cwd + '/' + output);
    this.fs.write(cwd + '/' + output, '');
  },
  writing: function () {

    let fs = require('fs');
    let path = require('path');
    let listFiles = (top) => {
      let lf = (top, list) => {
        let files = fs.readdirSync(top);
        files.forEach((f) => {
          let absPath = path.join(top, f);
          if(fs.lstatSync(absPath).isDirectory()) {
            return lf(absPath, list);
          } else {
            list.push(absPath);
            return list;
          }
        });
        return list;
      }
      return lf(top, []);
    };
    let YAML = require('js-yaml');
    let merge = (from, to) => {
      let partial = YAML.safeLoad(this.fs.read(from));
      let main = YAML.safeLoad(this.fs.read(to)) || {};
      if(partial.functions) {
        main.functions = main.functions || {};
        Object.assign(main.functions, partial.functions);
      }
      if(partial.provider) {
        main.provider = main.provider || {};
        if(partial.provider.iamRoleStatements) {
          main.provider.iamRoleStatements = main.provider.iamRoleStatements||[];
          partial.provider.iamRoleStatements.forEach((iam) => {
            main.provider.iamRoleStatements.push(iam);
          });

        }
        ['name', 'region', 'runtime'].forEach((key) => {
          main.provider[key] = main.provider[key] || (partial.provider[key]||'');
        });
      }
      if(partial.resources) {
        main.resources = main.resources || {};
        main.resources.Resources = main.resources.Resources || {};
        Object.assign(main.resources.Resources, partial.resources.Resources);
      }
      if(partial.service) {
        if(!main.service) {
          main.service = partial.service;
        }
      }
      if(partial.frameworkVersion) {
        if(!main.frameworkVersion) {
          main.frameworkVersion = partial.frameworkVersion;
        }
      }
      if(partial.package) {
        main.package = main.package||{};
        Object.assign(main.package, partial.package);
      }
      this.fs.write(to, YAML.safeDump(main));
    };

    let convert = (from, to, cb) => {
      this.fs.copyTpl(from, to, config);
      cb(to);
    };

    listFiles(cwd + "/src").filter((name) => {
      return name.endsWith(".tpl.yml");
    }).forEach((file) => {
      convert(file, cwd + "/" + convertedOutput, (name) => {
        merge(name, cwd + "/" + output);
      });
    });
    this.fs.delete(cwd + '/' + convertedOutput);
  },
  conflict: function() {
  }
});
