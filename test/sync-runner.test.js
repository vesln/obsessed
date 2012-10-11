
/**
 * Subject.
 */

var obsessed = obsessed || require('../')
  , SyncRunner = obsessed.SyncRunner;

describe('SyncRunner', function() {
  it('throws the last error when hitting the limit', function() {
    var runner = new SyncRunner(2, function() {
      throw new Error('Oops.');
    });

    (function() {
      runner.run();
    }).should.throw(Error, 'Operation failed');
  });

  it('retries sync operations n times', function() {
    var i = 0;

    var runner = new SyncRunner(2, function() {
      if (++i !== 2) {
        throw new Error('Oops.');
      }
    });

    runner.run();

    i.should.eq(2);
  });
});
