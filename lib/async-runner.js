
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

  this.end = noop;
  this.times = times;
};

/**
 * Inherit from `Runner`.
 */

AsyncRunner.prototype.__proto__ = Runner.prototype;

/**
 * Task writter.
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
 * Callback writter.
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
 * Run the supplied task.
 *
 * @api public
 */

AsyncRunner.prototype.run = function() {
  var self = this
    , fn = this.fn
    , end = this.end;

  function cb(err) {
    if (err) {
      self.capture(err);
    }

    if (err && self.executed++ < self.times) {
      fn(cb);
    } else {
      self.done(arguments);
    }
  };

  fn(cb);
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
