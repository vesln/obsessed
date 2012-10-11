
/**
 * Subject.
 */

var AsyncRunner = require('../lib/async-runner');

describe('AsyncRunner', function() {
  it('can retry async operations n times', function(done) {
    var runner = new AsyncRunner('3 times');

    var end = function(err, arg) {
      err.message.should.eq('Oops.');
      arg.should.eql('arg');
      done();
    };

    var fn = function(done) {
      done(new Error('Oops.'), 'arg');
    };

    runner.task(fn)
      .notify(end)
      .run()
  });
});
