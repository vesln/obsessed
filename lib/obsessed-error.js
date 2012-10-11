
/**
 * Custom error. Includes all error messages.
 *
 * @param {String} message
 * @param {Array} errors
 * @constructor
 */

function ObsessedError(message, errors) {
  Error.captureStackTrace(this, ObsessedError);
  this.message = this.combine(message, errors);
};

/**
 * Inherit from `Error`.
 */

ObsessedError.prototype = Object.create(Error.prototype);

/**
 * Combine the supplied message and the messages from the
 * errors occurred during the attempts.
 *
 * @param {String} message
 * @param {Array} errors
 * @returns {String}
 * @api private
 */

ObsessedError.prototype.combine = function(message, errors) {
  var messages = errors.map(function(err) {
    return '  - ' + err.message;
  }).join("\n");

  return message + "\n" + messages;
};

/**
 * Error name.
 */

ObsessedError.prototype.name = 'ObsessedError';

/**
 * Expose `ObsessedError`.
 */

module.exports = ObsessedError;
