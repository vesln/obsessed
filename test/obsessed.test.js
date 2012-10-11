
/**
 * Subject.
 */

var obsessed = require('../');

/**
 * Subject dependencies.
 */

var SyncRunner = require('../lib/sync-runner')
  , AsyncRunner = require('../lib/async-runner');

describe('obsessed', function() {
  it('can handle strings for number of times', function() {
    var first = false
      , second = false
      , i = 0;

    obsessed('1 time', function() {
      first = true;
    });

    obsessed('2 times', function() {
      if (++i === 2) {
        second = true;
      } else {
        throw new Error('Oops.');
      }
    });

    first.should.be.true;
    second.should.be.true;
  });

  it('constructs the correct runner', function() {
    obsessed(1).should.be.an.instanceof(AsyncRunner);
    obsessed(1, function(done) {}).should.be.an.instanceof(AsyncRunner);
    obsessed(1, function() {}).should.be.an.instanceof(SyncRunner);
  });
});
