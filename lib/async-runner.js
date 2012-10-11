
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
  this.fn = fn;
  this.end = noop;
  this.executed = 0;
  this.times = times;
};

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

  function done(err) {
    if (err && self.executed++ < self.times) {
      fn(done);
    } else {
      end.apply(end, arguments);
    }
  };

  fn(done);
};

/**
 * Expose `AsyncRunner`.
 */

module.exports = AsyncRunner;
