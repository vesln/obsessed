
/**
 * Internal dependencies.
 */

var Runner = require('./runner');

/**
 * No operation.
 */

function noop() {};

/**
 * Async task runner.
 *
 * @param {String|Number} times
 * @param {Function} [optional] task to execute
 * @constructor
 */

function AsyncRunner(times, fn) {
  Runner.apply(this, arguments);

  this.pause = 0;
  this.end = noop;
  this.times = times;
};

/**
 * Inherit from `Runner`.
 */

AsyncRunner.prototype.__proto__ = Runner.prototype;

/**
 * Task writer.
 *
 * @param {Function} task to execute
 * @returns {object} this
 * @api public
 */

AsyncRunner.prototype.task = function(fn) {
  this.fn = fn;
  return this;
};

/**
 * Callback writer.
 *
 * @param {Function} callback
 * @returns {object} this
 * @api public
 */

AsyncRunner.prototype.notify = function(end) {
  this.end = end;
  return this;
};

/**
 * Set a delay between the run attempts.
 *
 * @param {Number} delay
 * @returns {Object} this
 * @api public
 */

AsyncRunner.prototype.delay = function(pause) {
  this.pause = pause;
  return this;
};

/**
 * Run the supplied task.
 *
 * @api public
 */

AsyncRunner.prototype.run = function() {
  var self = this
    , fn = this.fn
    , end = this.end
    , pause = this.pause;

  function cb(err) {
    if (err) {
      self.capture(err);
    }

    if (err && self.executed++ < self.times) {
      self.queue(cb, pause);
    } else {
      self.done(arguments);
    }
  };

  self.queue(cb);
};

/**
 * Execute a task.
 *
 * @param {Function} done callback
 * @param {Number} [optional] delay time
 * @api private
 */

AsyncRunner.prototype.queue = function(cb, pause) {
  pause = pause || 0;

  setTimeout(function() {
    this.fn(cb);
  }.bind(this), pause);
};

/**
 * Notify the done callback.
 *
 * @param {Object} arguments
 * @api private
 */

AsyncRunner.prototype.done = function(args) {
  args[0] = this.error();
  this.end.apply(this.end, args);
};


/**
 * Expose `AsyncRunner`.
 */

module.exports = AsyncRunner;
