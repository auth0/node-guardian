'use strict';

const Promise = require('bluebird');
const request = Promise.promisifyAll(require('request'));
const RequestError = require('./request_error');

const MAPPING = {
  'get': 'getAsync',
  'put': 'putAsync',
  'patch': 'patchAsync',
  'delete': 'deleteAsync',
  'post': 'postAsync'
};

Object.keys(MAPPING).forEach(function (key) {
  exports[key] = function (options) {
    return request[MAPPING[key]](options)
      .then(function (resp) {
        const body = resp.body || {};

        if (resp.statusCode < 200 || resp.statusCode >= 300) {
          return Promise.reject(new RequestError(body.error || 'Request error', body));
        }

        return body;
      }, function(err) {
        return Promise.reject(new RequestError(err.message || 'Request error', null, err));
      });
  };
});
