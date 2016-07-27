'use strict';

const Entity = require('./entity');
const enrollmentBuilder = require('./enrollment');

function User (options, id, data) {
  this.id = id;

  Entity.call(this, {
    path: function(id) {
      return ['users', id];
    },
    client: options.client,
    update: true,
    patch: true
  }, id, data);

  this.enrollmentBuilder = enrollmentBuilder(options);
};

User.prototype = Object.create(Entity.prototype);

User.prototype.enabledMFA = function() {
  this.set('user_metadata.use_mfa', true);
};

User.prototype.disableMFA = function() {
  this.set('user_metadata.use_mfa', false);
};

User.prototype.getEnrollments = function() {
  return this.client
    .get(this.path(this.id).concat(['enrollments']))
      .then((enrollments) =>
        enrollments.map((enrollment) => this.enrollmentBuilder.create(enrollment.id, enrollment)));
};

module.exports = function (options) {
  return {
    create: function(id, data) { return new User(options, id, data); }
  };
};
