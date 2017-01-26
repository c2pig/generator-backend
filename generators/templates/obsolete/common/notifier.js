'use strict';
class Notifier {
  constructor(sns) {
    this.sns = sns;
  }
  notify(msg, topic, callback) {
    this.sns.publish({ Message: msg, TopicArn: topic }, callback);
  }
}
module.exports = Notifier;
