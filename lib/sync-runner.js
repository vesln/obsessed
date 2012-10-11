
/**
 * Internal dependencies.
 */

var Runner = require('./runner');

/**
 * Sync task runner.
 *
 * @param {String|Number} times
 * @param {Function} task to execute
 * @constructor
 */

function SyncRunner(times, fn) {
  Runner.apply(this, arguments);
  this.success = false;
};


/**
 * Inherit from `Runner`.
 */

SyncRunner.prototype.__proto__ = Runner.prototype;

/**
 * Throw an error if the task did not finished
 * successfully.
 *
 * @api private
 */
SyncRunner.prototype.raise = function() {
  if (!this.success) {
    throw this.error();
  }
};

/**
 * Mark the task as successfully finished.
 *
 * @api private
 */

SyncRunner.prototype.finish = function() {
  this.success = true;
};

/**
 * Run the supplied task.
 *
 * @api public
 */

SyncRunner.prototype.run = function() {
  while (this.executed++ < this.times) {
    try {
      this.fn();
      this.finish();
      break;
    } catch (err) {
      this.capture(err);
    }
  }

  this.raise();
};

/**
 * Expose `SyncRunner`.
 */

module.exports = SyncRunner;
