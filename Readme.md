[![Build Status](https://secure.travis-ci.org/vesln/obsessed.png)](http://travis-ci.org/vesln/obsessed)

# Important Notice

I'm no longer actively maintaining this project. If you are interested supporting it - [ping me on twitter](https://twitter.com/vesln).
The only thing that I will ask you is to not change the API drastically. If you are planning on doing that - better start a brand new project.

If you want me to transfer you only the name on npm, I'd be happy to only if the project **does not have any downloads on npm lately**. In case it's being
downloaded, there are people that depend on it and might step up and start maintaining, so I will not transfer it to you, regardless if you want to release
a new major version etc.

If you have any other questions, let me know.

Thanks!

Veselin

# obsessed

Retry mechanism for Node.js and the browser.

## Synopsis

```js
var obsessed = require('obsessed');
```

### Sync:

Obsessed will run the following code up to 8 times. If an error is thrown,
it will continue invoking the callback until the limit is hit.

```js
obsessed(8, function() {
  // do something risky

  if (failed) {
    throw new Error('oops');
  }
});

obsessed('8 times', function() {
  // do work
  throw new Error('oops');
});
```

### Async:

Running a risky async task is pretty simple.

Supply a task and invoke the callback when you are done. If an error occurred
during the execution of the code, pass it as an argument to `done` and
Obsessed will retry the operation.

You can delay the execution of the attempts by calling `delay`.

`end` will be triggered with the operation is done.

```js
function fn(done) {
  // async calls
  done(new Error('failed'));
};

function end(err, param, ...) {
  console.log(err);
};

obsessed('3 times')
  .task(fn)
  .delay(200)
  .end(end)
  .run();
```

## Installation

Node.js:

```
$ npm install obsessed
```

Browser:

Download `obsessed.min.js` and include it in the html:

```html
<script src="obsessed.min.js"></script>
```

## Tests

Node.js:

```
$ npm install
$ make test
```

Browser:

- Download the repository
- Open `test/browser/index.html` in your favourite browser

## License

(The MIT License)

Copyright (c) 2012 Veselin Todorov <hi@vesln.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
