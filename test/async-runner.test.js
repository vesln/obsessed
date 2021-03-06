
/**
 * Subject.
 */

var obsessed = obsessed || require('../')
  , AsyncRunner = obsessed.AsyncRunner;

describe('AsyncRunner', function() {
  it('can retry async operations n times', function(done) {
    var runner = new AsyncRunner(3);

    var end = function(err, arg) {
      err.message.should.match(/Oops/);
      arg.should.eql('arg');
      done();
    };

    var fn = function(done) {
      done(new Error('Oops.'), 'arg');
    };

    runner.task(fn)
      .notify(end)
      .delay(2)
      .run()
  });

  it('will not throw if there is nothing to throw', function(done) {
    var runner = new AsyncRunner(3);

    var end = function(err, arg) {
      (err === undefined).should.be.true;
      done();
    };

    var fn = function(done) {
      done(null, 'arg');
    };

    runner.task(fn)
      .notify(end)
      .run()
  });
});
