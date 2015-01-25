/*eslint-env mocha */
var _ = require('lodash');

var checkers = require('..');
var gen = checkers.gen;

var checking = require('../mocha');

describe("checkers.gen", function() {
    checking(".boolean", [gen.boolean], _.isBoolean, 10);
    checking(".int", [gen.int], function(n) {
        return _.isNumber(n) && wholeNumber(n);
    }, 100);
    checking(".nat", [gen.nat], function(n) {
        return _.isNumber(n) && wholeNumber(n) && n >= 0;
    }, 100);
    checking(".posInt", [gen.posInt], function(n) {
        return _.isNumber(n) && wholeNumber(n) && n > 0;
    }, 100);
    checking(".negInt", [gen.negInt], function(n) {
        return _.isNumber(n) && wholeNumber(n) && n < 0;
    }, 100);
    checking(".zeroOrNegInt", [gen.zeroOrNegInt], function(n) {
        return _.isNumber(n) && wholeNumber(n) && n <= 0;
    }, 100);
    checking(".char", [gen.char], function(c) {
        return _.isString(c) && c.length === 1 &&
            c.charCodeAt(0) < 256 && c.charCodeAt(0) >= 0;
    }, 1000);
    checking(".charAscii", [gen.charAscii], function(c) {
        return _.isString(c) && c.length === 1 &&
            c.charCodeAt(0) <= 127 && c.charCodeAt(0) >= 0;
    }, 100);
    checking(".charAlphanum", [gen.charAlphanum], function(c) {
        return _.isString(c) && /^\w$/.test(c);
    }, 100);
    checking(".charAlpha", [gen.charAlpha], function(c) {
        return _.isString(c) && /^\w$/.test(c) && !/^\d$/.test(c);
    }, 100);
    checking(".string", [gen.string], function(c) {
        return _.isString(c);
    }, 1000);
    checking(".stringAscii", [gen.stringAscii], function(s) {
        return _.isString(s) && _.every(s, function(c) {
            return c.charCodeAt(0) <= 127 && c.charCodeAt(0) >= 0;
        });
    }, 1000);
    checking(".stringAlphanum", [gen.stringAlphanum], function(s) {
        return _.isString(s) && _.every(s, function(c) {
            return /^\w$/.test(c);
        });
    }, 1000);
    describe(".tuple", function() {
        checking("pairs of ints", [gen.tuple(gen.int, gen.int)], function(t) {
            return _.isArray(t) && t.length == 2 &&
                _.isNumber(t[0]) && _.isNumber(t[1]);
        }, 1000);
        checking("pairs of int, char",
            [gen.tuple(gen.int, gen.char)],
            function(t) {
                return _.isArray(t) && t.length == 2 &&
                    _.isNumber(t[0]) && _.isString(t[1]);
            },
            1000
        );
        checking("can generate triples",
            [gen.tuple(gen.int, gen.int, gen.int)],
            function(t) {
                return _.isArray(t) && t.length == 3;
            },
            1000
        );
    });
});

function wholeNumber(n) {
    return Math.round(n) === n;
}
