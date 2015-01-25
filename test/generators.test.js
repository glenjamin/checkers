/*eslint-env mocha */
var _ = require('lodash');

var checkers = require('..');
var gen = checkers.gen;

describe("checkers.gen", function() {
    it("can generate with .boolean", function() {
        checkers.forAll([gen.boolean], _.isBoolean).check(10);
    });
    it("can generate with .int", function() {
        checkers.forAll([gen.int], function(n) {
            return _.isNumber(n) && wholeNumber(n);
        }).check(100);
    });
    it("can generate with .nat", function() {
        checkers.forAll([gen.nat], function(n) {
            return _.isNumber(n) && wholeNumber(n) && n >= 0;
        }).check(100);
    });
    it("can generate with .posInt", function() {
        checkers.forAll([gen.posInt], function(n) {
            return _.isNumber(n) && wholeNumber(n) && n > 0;
        }).check(100);
    });
    it("can generate with .negInt", function() {
        checkers.forAll([gen.negInt], function(n) {
            return _.isNumber(n) && wholeNumber(n) && n < 0;
        }).check(100);
    });
    it("can generate with .zeroOrNegInt", function() {
        checkers.forAll([gen.zeroOrNegInt], function(n) {
            return _.isNumber(n) && wholeNumber(n) && n <= 0;
        }).check(100);
    });
    it("can generate with .char", function() {
        checkers.forAll([gen.char], function(c) {
            return _.isString(c) && c.length === 1 &&
                c.charCodeAt(0) < 256 && c.charCodeAt(0) >= 0;
        }).check(1000);
    });
    it("can generate with .charAscii", function() {
        checkers.forAll([gen.charAscii], function(c) {
            return _.isString(c) && c.length === 1 &&
                c.charCodeAt(0) <= 127 && c.charCodeAt(0) >= 0;
        }).check(100);
    });
    it("can generate with .charAlphanum", function() {
        checkers.forAll([gen.charAlphanum], function(c) {
            return _.isString(c) && /^\w$/.test(c);
        }).check(100);
    });
    it("can generate with .charAlpha", function() {
        checkers.forAll([gen.charAlpha], function(c) {
            return _.isString(c) && /^\w$/.test(c) && !/^\d$/.test(c);
        }).check(100);
    });
    it("can generate with .string", function() {
        checkers.forAll([gen.string], function(c) {
            return _.isString(c);
        }).check(1000);
    });
    it("can generate with .stringAscii", function() {
        checkers.forAll([gen.stringAscii], function(s) {
            return _.isString(s) && _.every(s, function(c) {
                return c.charCodeAt(0) <= 127 && c.charCodeAt(0) >= 0;
            });
        }).check(1000);
    });
    it("can generate with .stringAlphanum", function() {
        checkers.forAll([gen.stringAlphanum], function(s) {
            return _.isString(s) && _.every(s, function(c) {
                return /^\w$/.test(c);
            });
        }).check(1000);
    });
    describe(".tuple", function() {
        it("can generate pairs of ints", function() {
            checkers.forAll([gen.tuple(gen.int, gen.int)], function(t) {
                return _.isArray(t) && t.length == 2 &&
                    _.isNumber(t[0]) && _.isNumber(t[1]);
            }).check(1000);
        });
        it("can generate pairs of int, char", function() {
            checkers.forAll([gen.tuple(gen.int, gen.char)], function(t) {
                return _.isArray(t) && t.length == 2 &&
                    _.isNumber(t[0]) && _.isString(t[1]);
            }).check(1000);
        });
        it("can generate triples", function() {
            checkers.forAll(
                [gen.tuple(gen.int, gen.int, gen.int)],
            function(t) {
                return _.isArray(t) && t.length == 3;
            }).check(1000);
        });
    });
});

function wholeNumber(n) {
    return Math.round(n) === n;
}
