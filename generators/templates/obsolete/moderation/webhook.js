'use strict';

const getParams = query => {
  if (!query) {
    return { };
  }
  return (/^[?#]/.test(query) ? query.slice(1) : query)
    .split('&')
    .reduce((params, param) => {
       let kv = param.split('=');
       let key = kv[0] || '';
       let value = kv[1] || '';
       params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
      return params;
    }, { });
};

const updateModeration = (db, msg) => {
  return new Promise((resolve, reject) => {
    let coid = msg.data.coid;
    let timestamp = new Date().getTime();
    let params = {
        "TableName": "cpp-moderation",
        "Key": {
          "id": { "S":coid }
        },
        "AttributeUpdates": {

        	"moderatedAt": {
        		"Value": { "N": `${timestamp}` }, "Action": "PUT"
        	}
        	,
        	"review_useful_yn_gold": {
        		"Value": { "NS": [`${msg.data.review_useful_yn_gold}`] }, "Action": "PUT"
        	},
        	"review_useful_yn_gold_reason": {
        		"Value": { "SS": [`${msg.data.review_useful_yn_gold_reason}`] }, "Action": "PUT"
        	}
        },
        "ReturnValues": "NONE"
      };
      let ret = db.updateItem(params, (err, resp) => {
        if(err) {
          reject(err);
        } else {
          //TODO: return a proper resp
          resolve({});
        }
      });
  });
}


exports.handler = (event, context, callback) => {
    var doc = require('aws-sdk');
    var db = new doc.DynamoDB();

    const done = (err, res) => {
        callback(null, {
          statusCode: err ? '400' : '200',
          body: JSON.stringify(res),
          headers: {
              'Content-Type': 'application/json',
          },
        })
    };

    switch (event.httpMethod) {
        case 'POST':
            let params = getParams(event.body);
            let message = JSON.parse(params.payload);
            console.log('From Crowdflower:', message);
            updateModeration(db, message)
              .then(() => {
                  done(null, {});
              })
              .catch((e) => {
                  console.log(e);
                  done(e, e);
              });
            break;
        default:
    }
}
