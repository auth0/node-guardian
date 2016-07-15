'use strict';

const Entity = require('./entity');

function FactorProvider (options, id, data) {
  Entity.call(this, {
    path: function(id) {
      return ['guardian', 'factors', id.factor, 'providers', id.provider];
    },
    client: options.client
  }, id, data);
};

FactorProvider.prototype = Object.create(Entity.prototype);

module.exports = function(options) {
  return {
    create: function(id, data) {
      return new FactorProvider(options, id, data);
    }
  };
};
