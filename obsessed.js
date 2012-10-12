!function (name, context, definition) {
  if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
    module.exports = definition();
  } else if (typeof define === 'function' && typeof define.amd  === 'object') {
    define(function () {
      return definition();
    });
  } else {
    context[name] = definition();
  }
}('obsessed', this, function () {

    function require(p) {
      var path = require.resolve(p)
        , mod = require.modules[path];
      if (!mod) throw new Error('failed to require "' + p + '"');
      if (!mod.exports) {
        mod.exports = {};
        mod.call(mod.exports, mod, mod.exports, require.relative(path));
      }
      return mod.exports;
    }

    require.modules = {};

    require.resolve = function (path) {
      var orig = path
        , reg = path + '.js'
        , index = path + '/index.js';
      return require.modules[reg] && reg
        || require.modules[index] && index
        || orig;
    };

    require.register = function (path, fn) {
      require.modules[path] = fn;
    };

    require.relative = function (parent) {
      return function(p){
        if ('.' != p.charAt(0)) return require(p);

        var path = parent.split('/')
          , segs = p.split('/');
        path.pop();

        for (var i = 0; i < segs.length; i++) {
          var seg = segs[i];
          if ('..' == seg) path.pop();
          else if ('.' != seg) path.push(seg);
        }

        return require(path.join('/'));
      };
    };

    require.alias = function (from, to) {
      var fn = require.modules[from];
      require.modules[to] = fn;
    };


    require.register("async-runner.js", function(module, exports, require){

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

      AsyncRunner.prototype = new Runner;
      AsyncRunner.prototype.constructor = AsyncRunner;


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

    }); // module: async-runner.js

    require.register("obsessed-error.js", function(module, exports, require){

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

    }); // module: obsessed-error.js

    require.register("obsessed.js", function(module, exports, require){

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

      /**
       * Expose `SyncRunner`.
       */

      module.exports.SyncRunner = SyncRunner;

      /**
       * Expose `AsyncRunner`.
       */

      module.exports.AsyncRunner = AsyncRunner;

    }); // module: obsessed.js

    require.register("runner.js", function(module, exports, require){

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
        if (this.errs.length) {
          return new ObsessedError('Operation failed', this.errs);
        }
      };

      /**
       * Expose `Runner`.
       */

      module.exports = Runner;

    }); // module: runner.js

    require.register("sync-runner.js", function(module, exports, require){

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

      SyncRunner.prototype = new Runner;
      SyncRunner.prototype.constructor = SyncRunner;


      /**
       * Throw an error if the task did not finished
       * successfully.
       *
       * @api private
       */

      SyncRunner.prototype.raise = function() {
        if (!this.success) throw this.error();
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

    }); // module: sync-runner.js

    require.alias("./obsessed.js", "obsessed");

  return require('obsessed');
});