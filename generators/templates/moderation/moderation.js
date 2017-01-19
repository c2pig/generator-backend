'use strict';

 class ConnectionHelper {

  constructor(conn, profile) {
    this.host = conn.host;
    this.port = conn.port;
    this.job_id = profile.job_id;
    this.key = profile.key;
  }
  createConnection() {
    let options = {
      //TODO: hardcode for time being
      host:process.env.HOST,
      port:process.env.PORT,
      path: `/v1/jobs/${this.job_id}/units.json?key=${this.key}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
    /* probably need fully abstract http/s footprint */
    return require('http').request(options);
  }
}
module.exports.ConnectionHelper = ConnectionHelper;

class Moderation {

    constructor(conn) {
      this.req = conn.createConnection();
    }

    moderate(review) {
      const formurlencoded = require('form-urlencoded');
      return new Promise((resolve, reject) => {
        this.req.end(formurlencoded(review), 'utf8');
        this.req.on('response', (resp) => {
          resp.setEncoding('utf8');
          resp.on('data', (data) => {
            resolve({
              statusCode: resp.statusCode,
              statusMessage: resp.statusMessage,
              data: data
            });
          });
        });
        this.req.on('error', (e) => {
          reject(new Error(e));
        });
      });
    }
}

module.exports.Moderation = Moderation;

exports.handler = (event, context) => {

    let uuid = require('uuid');
    const AWS = require('aws-sdk');
    const doc = require('dynamodb-doc');
    const db = new doc.DynamoDB();
    const done = (err, res) => {
      console.log(err);
      console.log(res);
    };

    let conn = new ConnectionHelper(
      {host:"api.crowdflower.com",port:80},
      {job_id:"980629", key:"vyMyzfr9feYxkMJeciqh"});
    const message = JSON.parse(event.Records[0].Sns.Message);
    console.log('From SNS:', message);
    let mod = new Moderation(conn);
    let coid = uuid.v1();
    let review_id = "11111111";
    let profile_id = "22222222";
    mod.moderate(function(payload) {
        let unit = {
          "unit[data][profile_id]":profile_id,
          "unit[data][review_id]":review_id,
          "unit[data][coid]":coid
        }
        for(let i in payload) {
            unit = Object.assign(unit, {[`unit[data][${i}]`]:payload[i]});
        }
        console.log(unit);
        return unit;
    }(message.payload)).then((resp) => {
      console.log(`code:${resp.statusCode}, msg:${resp.statusMessage}`);
      if(resp.statusCode === 200) {
        const timestamp = new Date().getTime();
        const params = {
            TableName: process.env.DYNAMO_DB,
            Item: {
              id: coid,
              text: {review_id:review_id, profile_id:profile_id},
              checked: false,
              createdAt: timestamp,
              updatedAt: timestamp,
            },
        };
        db.putItem(params, done);
      }
    }).catch((e) => {
      console.log(e);
    });
}
