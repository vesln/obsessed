
/**
 * Internal dependencies.
 */

var SyncRunner = require('./sync-runner')
  , AsyncRunner = require('./async-runner');

/**
 * Handle the retry request.
 *
 * @param {String|Number} times
 * @param {Function} function to be executed.
 * @constructor
 */

function Handler(times, fn) {
  this.fn = fn;
  this.times = this.parse(times);
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
 * @returns {Object} the runner
 * @api private
 */

Handler.prototype.handle = function() {
  var runner = null
    , klass = null;

  klass = !this.fn || this.fn.length
    ? AsyncRunner
    : SyncRunner;

  runner = new klass(this.times, this.fn);

  if (this.fn) {
    runner.run();
  }

  return runner;
};

/**
 * DSL helper function. Builds a new `Handler`.
 *
 * @param {String|Number} times
 * @param {Function} function to be executed.
 * @api public
 */

function obsessed(times, fn) {
  var handler = new Handler(times, fn);
  return handler.handle();
};

/**
 * Expose `obsessed`.
 */

module.exports = obsessed;
