'use strict';

const enrollment = exports.enrollment = require('./enrollment');
const factor = exports.factor = require('./factor');
const factorProvider = exports.factorProvider = require('./factor_provider');
const user = exports.factorProvider = require('./user');

exports.configure = function configure(options) {
  const entityOptions = { client: options };

  return {
    enrollment: enrollment(entityOptions),
    factor: factor(entityOptions),
    factorProvider: factorProvider(entityOptions),
    user: user(entityOptions)
  };
};
