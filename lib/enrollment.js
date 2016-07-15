'use strict';

const Entity = require('./entity');

function Enrollment (options, id, data) {
  Entity.call(this, {
    path: function(id) {
      return ['guardian', 'enrollments', id];
    },
    update: false,
    client: options.client
  }, id, data);
};

Enrollment.prototype = Object.create(Entity.prototype);

module.exports = function (options) {
  return {
    create: function(id, data) { return new Enrollment(options, id, data); }
  };
};
