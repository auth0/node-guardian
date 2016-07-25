'use strict';

const Entity = require('./entity');

function User (options, id, data) {
  Entity.call(this, {
    path: function(id) {
      return ['users', id];
    },
    client: options.client,
    update: true,
    patch: true
  }, id, data);
};

User.prototype = Object.create(Entity.prototype);

User.prototype.enabledMFA = function() {
  this.set('user_metadata.use_mfa', true);
};

User.prototype.disableMFA = function() {
  this.set('user_metadata.use_mfa', false);
};

module.exports = function (options) {
  return {
    create: function(id, data) { return new User(options, id, data); }
  };
};
