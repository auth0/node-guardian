'use strict';

const regions = require('./regions');
const requestl = require('./request');
const urlJoin = require('url-join');

function API2Client (options) {
  this.domain = options.domain || regions.getDomain(options.region);
  this.baseUrl = (options.baseUrl || 'https://' + this.domain + '/api/v2').replace('{tenant}', options.tenant);
  this.token = options.token;
};

API2Client.prototype.request = function request (method, path, body) {
  const url = urlJoin.apply(null, [ this.baseUrl ].concat(path.map(encodeURIComponent)));

  return requestl[method]({
    url: url,
    auth: {
      bearer: this.token
    },
    body: body,
    json: true
  });
};

API2Client.prototype.get = function get (path) {
  return this.request('get', path);
};

API2Client.prototype.del = function del (path) {
  return this.request('delete', path);
};

API2Client.prototype.put = function put (path, body) {
  return this.request('put', path, body);
};

API2Client.prototype.patch = function patch (path, body) {
  return this.request('patch', path, body);
};

API2Client.prototype.post = function post (path, body) {
  return this.request('post', path, body);
};

module.exports = function(options) {
  return new API2Client(options);
};
