/*eslint-env mocha */
var _ = require('lodash');

var checkers = require('..');
var gen = checkers.gen;

describe("checkers", function() {
    it("checks that squaring makes things bigger or the same", function() {
        checkers.forAll(
            [gen.int],
            function(i) {
                return i * i >= i;
            }
        ).check(1000);
    });
    it("checks Array.sort is the same as _.sortBy on strings", function() {
        checkers.forAll(
            [gen.array(gen.int)],
            function(arr) {
                var lodash = _.sortBy(arr, function(x) { return '' + x; });
                var stdlib = arr.slice();
                stdlib.sort();
                return _.isEqual(stdlib, lodash);
            }
        ).check(100);
    });
});
