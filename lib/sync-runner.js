
/**
 * Sync task runner.
 *
 * @param {String|Number} times
 * @param {Function} task to execute
 * @constructor
 */

function SyncRunner(times, fn) {
  this.fn = fn;
  this.err = null;
  this.executed = 0;
  this.times = times;
  this.success = false;
};

/**
 * Capture an error.
 *
 * @param {Object} error
 * @api private
 */

SyncRunner.prototype.capture = function(err) {
  this.err = err;
};

/**
 * Throw an error if the task did not finished
 * successfully.
 *
 * @api private
 */
SyncRunner.prototype.raise = function() {
  // TODO: throw custom error.
  if (!this.success) throw this.err;
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
