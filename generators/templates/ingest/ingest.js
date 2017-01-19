'use strict';

const uuid = require('uuid');
class Ingest {
  constructor(db, s3) {
    this.db = db;
    this.s3= s3;
  }

  persist(key, obj, done) {
    const timestamp = new Date().getTime();
    const params = {
        TableName: process.env.DYNAMO_DB,
        Item: {
          id: key,
          text: obj,
          checked: false,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      };
    console.log(params);
    this.db.putItem(params, done);
  }

  archive(key, obj, done) {

    let bucketName = (d) => {
      return [process.env.S3_BUCKET, d.getFullYear(), d.getMonth()+1, d.getDay()].join('/');
    }
    let param = {
      Bucket: bucketName(new Date()),
      Key: key,
      Body: JSON.stringify(obj),
    };
    console.log(param);
    this.s3.putObject(param, done);
  }
}
exports.handler = (event, context) => {
    const AWS = require('aws-sdk');
    const doc = require('dynamodb-doc');
    let ingest = new Ingest(new doc.DynamoDB(),new AWS.S3());
    const Notifier = new require('../common/notifier');
    let notifier = new Notifier(new AWS.SNS());

    const done = (err, res) => {
      console.log(err);
      console.log(res);
    };
    //console.log('Received event:', JSON.stringify(event, null, 2));
    const message = JSON.parse(event.Records[0].Sns.Message);

    console.log('From SNS:', message);
    let key = uuid.v1();
    ingest.archive(key + '.input', message, done);
    if(!message.err) {
      console.log('persist db');
      ingest.persist(key, message, done);
      notifier.notify(JSON.stringify(message), process.env.SNS_TOPIC, (err, data) => {
          console.log('sns callback');
          console.log(err);
          console.log(data);
      });
    }
};
