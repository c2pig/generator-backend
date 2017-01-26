let validation = require('./app').validation;

exports.handler = validation.init(function(rs, baseFn) {
    console.log('init from project');
  }).input(function(data, rs, baseFn) {
    console.log('input from project');
  }).output(function(rs, baseFn) {
    console.log('output from project');
  }).error(function(e) {
    console.log('err from project : ' + e );
  }).done();
