
/**
 * Subject.
 */

var obsessed = require('../');

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

  it('retries sync operations n times', function() {
    var i = 0;

    obsessed(2, function() {
      if (++i !== 2) {
        throw new Error('Oops.');
      }
    });

    i.should.eq(2);
  });

  it('throws the last error when hitting the limit', function() {
    (function() {
      obsessed(2, function() {
        throw new Error('Oops.');
      });

    }).should.throw(Error, 'Oops.');
  });

  it('can retry async operations n times', function(done) {
    var i = 3;

    var end = function(err, arg) {
      err.message.should.eq('Oops.');
      arg.should.eql('arg');
      done();
    };

    var fn = function(done) {
      done(new Error('Oops.'), 'arg');
    };

    obsessed('3 times')
      .task(fn)
      .notify(end)
      .run()
  });
});
