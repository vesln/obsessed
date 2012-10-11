
/**
 * Internal dependencies.
 */

var ObsessedError = require('./obsessed-error');

/**
 * Base Runner class.
 *
 * @param {String|Number} times
 * @param {Function} task to execute
 * @constructor
 */

function Runner(times, fn) {
  this.fn = fn;
  this.errs = [];
  this.executed = 0;
  this.times = times;
};

/**
 * Capture an error.
 *
 * @param {Object} error
 * @api private
 */

Runner.prototype.capture = function(err) {
  this.errs.push(err);
};

/**
 * Construct an `ObsessedError`.
 *
 * @returns {Error}
 * @api private
 */

Runner.prototype.error = function() {
  if (this.errs) {
    return new ObsessedError('Operation failed', this.errs);
  }
};

/**
 * Expose `Runner`.
 */

module.exports = Runner;
