# checkers

[![Build Status](https://travis-ci.org/glenjamin/checkers.svg?branch=master)](https://travis-ci.org/glenjamin/checkers)

<img src="https://drive.google.com/uc?id=0BxqNu2E4b85zeWtxZGtOR1doaXM" align="right" />

Property-based testing for JavaScript via ClojureScript's [test.check](https://github.com/clojure/test.check).

test.check is a Clojure property-based testing tool inspired by [QuickCheck](http://www.quviq.com/products/erlang-quickcheck/). The core idea of test.check is that instead of enumerating expected input and output for unit tests, you write properties about your function that should hold true for all inputs. This lets you write concise, powerful tests.

Checkers brings the power of test.check to plain ol' JavaScript.

# Install

    npm install checkers --save

# Usage

```js
var checkers = require('checkers');
var gen = checkers.gen;

// Property is incorrect
checkers.forAll(
    [gen.int],
    function(i) {
        return i * i > i;
    }
).check(1000);

// Property is now correct
checkers.forAll(
    [gen.int],
    function(i) {
        return i * i >= i;
    }
).check(1000);

// Check property with a particular seed
checkers.forAll(
    [gen.int],
    function(i) {
        return i * i >= i;
    }
).check(1000, {seed: 1422111938215});
```

## Documentation

More coming soon!

## TODO

* Generator tests
* Generator docs
* Tutorial
* Better examples

## Development

See `npm run` or `package.json` for a list of available scripts.

You will need [leiningen](http://leiningen.org/) in order to build locally.

## License

Distributed under the Eclipse Public License.

checkers is Copyright © 2015 Glen Mailer and contributors.

[test.check](https://github.com/clojure/test.check/) is Copyright
Rich Hickey, Reid Draper and contributors.

