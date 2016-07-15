'use strict';

const Entity = require('./entity');
const api2Client = require('./utils/client');

function Factor (options, id, data) {
  Entity.call(this, {
    path: function(id) {
      return ['guardian', 'factors', id];
    },
    client: options.client
  }, id, data);
};

Factor.prototype = Object.create(Entity.prototype);

Factor.prototype.disable = function() {
  return this.set('enabled', false);
};

Factor.prototype.enable = function() {
  return this.set('enabled', true);
};

module.exports = function(options) {
  const client = api2Client(options.client);

  const create = function create (id, data) {
    return new Factor(options, id, data);
  };

  const getAll = function getAll () {
    return client.get(['guardian', 'factors']).map((e) => create(e.id, e));
  };

  return {
    create,
    getAll
  };
};

