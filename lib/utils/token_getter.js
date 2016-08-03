'use strict';

const requestl = require('./request');
const jwt = require('jsonwebtoken');
const cache = require("lru-cache")({ max: 5 });
const Promise = require('bluebird');
const urlJoin = require('url-join');

const CACHE_EXP_DIFF_MS = 2000;

/**
 * @param {string} options.clientId
 * @param {string} options.clientSecret
 * @param {string} options.baseUrl
 * @param {string} options.domain
 */
module.exports = function(options) {
  const token = cache.get(getKey(options));

  if (token) {
    return Promise.resolve(token);
  }

  return requestl.post({
    url: `https://${options.domain}/oauth/token`,
    headers: { 'content-type': 'application/json' },
    body: {
      "client_id": options.clientId,
      "client_secret": options.clientSecret,
      "audience": urlJoin(options.baseUrl, '/'),
      "grant_type": "client_credentials"
    },
    json: true
  })
  .then((result) => {
    const accessToken = result.access_token;
    const decoded = jwt.decode(accessToken);

    let expIn =  decoded.exp ? decoded.exp * 1000 - Date.now() - CACHE_EXP_DIFF_MS : undefined;
    expIn = expIn && expIn > 0 ? expIn : undefined;

    cache.set(getKey(options), accessToken, expIn);

    return accessToken;
  });
};

function getKey(options) {
  return `${options.clientId}_${options.domain}`;
}
