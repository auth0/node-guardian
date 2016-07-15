'use strict';

const _set = require('lodash.set');
const api2Client = require('./utils/client');

function Entity (options, id, data) {
  this.options = options || {};
  this.client = api2Client(options.client);
  this.id = id;
  this.data = data || {};
  this.changes = {};
  this.path = options.path;
  this.fetched = !!data;
}

Entity.prototype.del = function del () {
  this.deleting = true;

  return this.client.del(this.path(this.id, 'del'))
    .then(() => this)
    .finally(() => {
      this.deleting = false;
    });
};

Entity.prototype.fetch = function fetch () {
  this.fetching = true;
  return this.client.get(this.path(this.id, 'fetch'))
    .then((data) => {
      this.data = data;
      this.fetched = true;

      return this;
  })
  .finally(() => {
    this.fetching = false;
  });
};

Entity.prototype.update = function update () {
  if (!this.fetched && !this.options.patch) {
    throw new Error('Partial update not supported. Call fetch() first');
  }

  const method = this.options.patch ? 'patch' : 'put';
  const data = this.options.patch ? this.changes : Object.assign({}, this.data, this.changes);

  return this.client[method](this.path(this.id, method), data)
    .then((data) => {
      this.data = Object.assign(this.attrs(), data);
      this.changes = {};

      return this;
    });
};

Entity.prototype.set = function set(path, value) {
  this.changes = this.changes || {};

  if (typeof path === 'string') {
    _set(this.changes, path, value);
  } else if (typeof path === 'object' && path !== null) {
    Object.assign(this.changes, path);
  } else {
    throw new Error('Invalid data');
  }

  return this;
};

Entity.prototype.attrs = function attrs() {
  return Object.assign({}, this.data, this.changes);
};

Entity.prototype.toJSON = function toJSON() {
  return this.attrs();
};

module.exports = Entity;


