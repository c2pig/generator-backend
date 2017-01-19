'use strict';
var inherits = require('util').inherits;
var emitter = require('events').EventEmitter;

(function() {
  inherits(Action, emitter);
})();

class Base {
  constructor(mixin) {
      this.mixin = mixin;
      // _root.action = mixin.action || new Action();
  }

  _this() {
    return this;
  }

  // implement() {
  //   return function(event, context, callback) {
  //     new Promise((resolve, reject) => {
  //       let ret = _root.action.emit('input', event, context, callback);
  //     });
  //     _root.action.emit('output', event, context, callback);
  //   }
  // }

  done() {
    let _this = this;
    try {
      _this.mixin.action.emit('init');
      return function(event, context, callback) {
        _this.mixin.action.emit('input');
        _this.mixin.action.emit('output');
      };
    } catch(e) {
      console.log(`[ERR]: ${e}`);
      _this.mixin.action.emit('error', e);
    }
  }

  _use() {
    /* leave it as it is for time being */
    console.log('Unsupported call for time being');
  }

  _init(ctx, fn) {
    ctx.mixin.init(fn);
    return {
      input: (fn) => ctx._input(ctx, fn),
      output: (fn) => ctx._output(ctx, fn),
      error: (fn) => ctx._error(ctx, fn),
      done: (fn) => ctx.done(ctx, fn)
    };
  }

  _input(ctx, fn) {
    ctx.mixin.input(fn);
    return {
      output: (fn) => ctx._output(ctx, fn),
      error: (fn) => ctx._error(ctx, fn),
      done: (fn) => ctx.done(ctx, fn)
    };
  }

  _output(ctx, fn) {
    ctx.mixin.output(fn);
    return {
      error: (fn) => ctx._error(ctx, fn),
      done: (fn) => ctx.done(ctx, fn)
    };
  }

  _error(ctx, fn) {
    ctx.mixin.error(fn);
    return {
      done: (fn) => ctx.done(ctx, fn)
    };
  }

  ready() {
    let _this = this;
    return {
      init: (fn) => this._init(_this, fn),
      input: (fn) => this._input(_this, fn),
      output: (fn) => this._output(_this, fn),
      error: (fn) => this._error(_this, fn)
    }
  }
}
exports.Base = Base;

function Action() {
  if (! (this instanceof Action)) return new Action();
  emitter.call(this);
}

let action = new Action();
process.on('uncaughtException', (err) => {
  action.emit('error', err);
});

exports.action = action;
