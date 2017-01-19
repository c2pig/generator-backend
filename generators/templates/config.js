module.exports.sub = function() {
  return {
    sns: {
      ingest: 'validation'
    }
  }
}

module.exports.pub = function() {
  return {
    sns: {
      validation: 'validation'
    }
  }
}


module.exports.events = function() {
  return {
    sns: {
      ingest: 'ingest',
      validation: 'validation',
      routing: 'routing',
      moderation: 'moderation',
      analytic: 'analytic',
    },
    schedule: {
      collector: 'rate(1 day)'
    }
  }
}
