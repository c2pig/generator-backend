let Base = require('../common/base').Base;
let action = require('../common/base').action;

let resource = {"db":{}};
let app = new Base({
    action: action,
    init: (fn) => {
      //fn is the function pass from project
      console.log("reg init");
      action.on('init', function() {
        fn(resource, () => {
          /* TODO: */
          console.log('base init');
        });
      });
    },
    input: (fn) => {
      console.log("reg input");
      action.on('input', function(data) {
        console.log('input....');
        fn(data, resource, () => {
          /* TODO: */
          console.log('base input');
        });
      });
    },
    output: (fn) => {
      console.log("reg output");
      action.on('output', function() {
        console.log('output....');
        fn(resource, () => {
          /* TODO: */
          console.log('base output');
        });
      });
    },
    error: (fn) => {
      action.on('error', function(e) {
        fn(e);
      });
    },
  });

exports.view = app.ready();
