
/**
 * Internal dependencies.
 */

var SyncRunner = require('./sync-runner');

/**
 * Handle the retry request.
 *
 * @param {String|Number} times
 * @param {Function} function to be executed.
 * @constructor
 */

function Handler(times, fn) {
  this.times = this.parse(times);
  this.fn = fn;
};

/**
 * Parse `times`.
 *
 * @param {String|Number} times
 * @returns {Number}
 * @api private
 */

Handler.prototype.parse = function(times) {
  if ('string' === typeof times) {
    times = times.replace(/time(s)?/, '');
  }

  return parseInt(times);
};

/**
 * Invoke the appropriate runner.
 *
 * @api private
 */

Handler.prototype.handle = function() {
  var runner = null;
  runner = new SyncRunner(this.times, this.fn);
  runner.run();
};

/**
 * DSL helper function. Builds a new `Handler`.
 *
 * @param {String|Number} times
 * @param {Function} function to be executed.
 * @api public
 */

function obsessed(times, fn) {
  new Handler(times, fn).handle();
};

/**
 * Expose `obsessed`.
 */

module.exports = obsessed;
