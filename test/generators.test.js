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
    }, 100);
    checking(".stringAscii", [gen.stringAscii], function(s) {
        return _.isString(s) && _.every(s, function(c) {
            return c.charCodeAt(0) <= 127 && c.charCodeAt(0) >= 0;
        });
    }, 100);
    checking(".stringAlphanum", [gen.stringAlphanum], function(s) {
        return _.isString(s) && _.every(s, function(c) {
            return /^\w$/.test(c);
        });
    }, 100);
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
    describe(".array", function() {
        checking("array of ints", [gen.array(gen.int)], function(arr) {
            return _.isArray(arr) && _.every(arr, _.isNumber);
        });
        checking("array of strings", [gen.array(gen.string)], function(arr) {
            return _.isArray(arr) && _.every(arr, _.isString);
        }, 100);
        checking("fixed length array", [gen.array(gen.int, 7)], function(arr) {
            return _.isArray(arr) && _.every(arr, _.isNumber) &&
                arr.length === 7;
        });
        checking("bounded length array",
            [gen.array(gen.int, 3, 17)],
            function(arr) {
                return _.isArray(arr) && _.every(arr, _.isNumber) &&
                    arr.length >= 3 && arr.length <= 17;
            }
        );
    });
    describe(".obj", function() {
        checking("int -> int", [gen.obj(gen.int, gen.int)], function(o) {
            return _.isObject(o) && _.every(o, function(v, k) {
                return _.isNumber(v) && _.isString(k) && /^-?\d+$/.test(k);
            });
        }, 100);
        checking("charAlpha -> int",
            [gen.obj(gen.charAlpha, gen.int)],
            function(o) {
                return _.isObject(o) && _.every(o, function(v, k) {
                    return _.isString(k) && _.isNumber(v);
                });
            },
            100
        );
    });
    checking(".object",
        [gen.object({a: gen.int, b: gen.charAlpha, c: gen.nat})],
        function(o) {
            return _.isEqual(['a', 'b', 'c'], _.keys(o)) &&
                _.isNumber(o.a) && /[a-z]/i.test(o.b) &&
                _.isNumber(o.c) && o.c >= 0;
        }
    );
});

function wholeNumber(n) {
    return Math.round(n) === n;
}
