
/**
 * Custom error. Includes all error messages.
 *
 * @param {String} message
 * @param {Array} errors
 * @constructor
 */

function ObsessedError(message, errors) {
  Error.captureStackTrace(this, ObsessedError);

  var messages = errors.map(function(err) {
    return '  - ' + err.message;
  }).join("\n");

  this.message = message + "\n" + messages;
};

/**
 * Inherit from `Error`.
 */

ObsessedError.prototype = Object.create(Error.prototype);

/**
 * Error name.
 */

ObsessedError.prototype.name = 'ObsessedError';

/**
 * Expose `ObsessedError`.
 */

module.exports = ObsessedError;
