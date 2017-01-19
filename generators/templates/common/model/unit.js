'use strict'

class Unit {
  constructor(prop) {
    this.job_id = prop.job_id || '';
    this.review_id = prop.review_id || '';
    this.usefulness = prop.usefulness || '';
    this.judgments_count = prop.judgments_count || '';
    this.agreement = prop.agreement || '';
    this.coid = prop.coid || '';
  }
}
