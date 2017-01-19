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
    var doc = require('aws-sdk');
    var db = new doc.DynamoDB();

    switch (event.httpMethod) {
        case 'GET':
          let params = {
            "FilterExpression": "attribute_exists(moderatedAt)",
            "TableName": process.env.DYNAMO_DB,
            "ProjectionExpression": "moderatedAt"
          };
          db.scan(params, (err, data) => {
            console.log(err);
            console.log(data);
            done(err, data);
          });
          break;
        default:
          done(new Error('Unsupported method "${event.httpMethod}"'));
    }
}
