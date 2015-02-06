/*eslint-env mocha */
var _ = require('lodash');
var assert = require('assert');

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
    it("returns summary of run", function() {
        var summary = checkers.forAll(
            [gen.int],
            function(n) {
                return (n * n) >= n;
            }
        ).check(100);
        assert.equal(summary["num-tests"], 100);
    });
    it("errors if property is not satisfied", function() {
        try {
            checkers.forAll([gen.int], function(i) {
                return _.isString(i);
            }).check(1);
            throw new Error("Shouldn't throw");
        } catch(ex) {
            assert.notEqual(ex.message, "Shouldn't throw");
        }
    });
    it("errors if property checker throws", function() {
        try {
            checkers.forAll([gen.int], function() {
                throw new Error("whoops");
            }).check(1);
            throw new Error("Shouldn't throw");
        } catch(ex) {
            assert.ok(
                /whoops/.test(ex.message),
                "expected /whoops/ to match " + ex.message
            );
        }
    });
});
