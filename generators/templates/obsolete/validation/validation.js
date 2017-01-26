'use strict'

class Validator {
  constructor(wp, schema) {
    this.wp = wp;
    this.jsonschema = schema;
  }

  validate(payload, format) {
    let validateImpl = (payload, format) => ({
      onFail : (fh) => {
        let ret = this.jsonschema.validator.validate(payload, format||this.jsonschema.payloadformat);
        
        if(ret.errors.length !== 0) {
          fh(ret.errors);
        }
      }
    });
    return validateImpl(payload, format);
  }
  purify(strings) {
    let purifyImpl = (strings) => ({
      fetch: (fetcher, err_handler) => {
        // this.wp.client
        //   .return(strings, this.wp.config.options,this.wp.config.timeoutInMs)
        //   .then((profanity) => { fetcher(profanity||[]) })
        //   .catch((err) => { err_handler(err) });
        //mock
        let data = {
           0: ['fcuk', 'hello'],
           1: []
         }
        fetcher(data[Math.floor(Math.random() * 2)]);
      }
    });
    return purifyImpl(strings);
  }
}

const AWS = require('aws-sdk');
const configpath = require('path').join(__dirname, 'webpurify.config.json');
const config = JSON.parse(require('fs').readFileSync(configpath, 'utf8'));
const WebPurify = require('webpurify');
const wp = new WebPurify(config.key);
const validator = new Validator({"client":wp, "config":config}, require('./schema_validation'));
const Notifier = require('../common/notifier');
const notifier = new Notifier(new AWS.SNS());
exports.handler = (event, context, callback) => {
    const done = (err, res) => {
        callback(null, {
          statusCode: err ? '400' : '200',
          body: JSON.stringify(res),
          headers: {
              'Content-Type': 'application/json',
          },
        });
    };
    switch (event.httpMethod) {
        case 'POST':
            //schema validation
            validator.validate(event);
            //   .onFail(function(errs) {
            //   return done(errs);
            // });
            //purify if needed
            let payload = JSON.parse(event.body).payload;
            let purify_fields = config.verifyFields.filter((field) => {
              return payload[field];
            });
            if(purify_fields.length) {
              let err = null, resp = {status: 'OK'}, msg = {payload:payload}
              validator.purify(purify_fields.map((f) => payload[f]).join())
              .fetch((profanity) => {
                if(profanity.length !==0) {
                  err = {reason:'Profanity'};
                  resp = {status:'NOK', profanity: profanity};
                  msg.err = err;
                  msg.resp = resp;
                }
                notifier.notify(JSON.stringify(msg), process.env.SNS_TOPIC, (err, data) => {
                    console.log('sns callback');
                    console.log(err);
                    console.log(data);
                });
                done(err, resp);
              }, (err) => { done(err); });
            }
            break;
        default:
            done(new Error('Unsupported method "${event.httpMethod}"'));
    }
};
