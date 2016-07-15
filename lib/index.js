'use strict';

const enrollment = exports.enrollment = require('./enrollment');
const factor = exports.factor = require('./factor');
const factorProvider = exports.factorProvider = require('./factor_provider');
const user = exports.factorProvider = require('./user');

exports.configure = function configure(options) {
  return {
    enrollment: enrollment(options),
    factor: factor(options),
    factorProvider: factorProvider(options),
    user: user(options)
  };
};
