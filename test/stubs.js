'use strict';

const nock = require('nock');
const regions = require('../lib/utils/regions');

exports.stub = function(options) {
  return nock('https://' + regions.getDomain(options.region).replace('{tenant}', options.tenant) + '/api/v2');
};
