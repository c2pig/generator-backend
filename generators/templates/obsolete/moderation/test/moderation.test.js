let chai = require("chai");
let expect = chai.expect;
let chaiAsPromised = require('chai-as-promised');
let Moderation = require('../moderation').Moderation;
let ConnHelper = require('../moderation').ConnectionHelper;
let uuid = require('uuid');
chai.use(chaiAsPromised);
describe('cloudflower moderation', function() {
   this.timeout(5000);
   it('job unit upload for moderation without error', function() {
     let key = "vyMyzfr9feYxkMJeciqh";
     let job_id = "980629";
     let conn = new ConnHelper(
       {host:"api.crowdflower.com",port:80},
       {job_id:job_id, key:key});
     let mod = new Moderation(conn);
       let unit = {
          "unit[data][profile_id]":"123457",
          "unit[data][review_id]":"754331",
          "unit[data][review_title]":"very good place",
          "unit[data][the_good_things]":"good",
          "unit[data][the_challenges]":"hmmmm",
          "unit[data][summary_rating_1-5]":"4",
          "unit[data][coid]":uuid.v1()
       };
       return expect(mod.moderate(unit).then((resp) => resp.statusCode)).to.eventually.equal(200);
   });
 });
