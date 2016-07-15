'use strict';

function RequestError(message, data, cause) {
  Error.call(this, message);
  this.data = data;
  this.cause = cause;

  if (cause) {
    Object.defineProperty(this, 'stack', {
        get: function () {
            return cause.stack
        }
    });
  }
}

RequestError.prototype = Object.create(Error.prototype);

module.exports = RequestError;
