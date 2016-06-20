/**
 * Mocha interop, assumes "it" is a globally defined function.
 */
/*eslint-env mocha */

var checkers = require("./");

exports = module.exports = checking;
exports.gen = checkers.gen;

/**
 * Generate a mocha example
 * @param  {string}   desc    The example description
 * @param  {array}    args    List of generators to pass to body
 * @param  {function} body    Function to check, should return true or false
 * @param  {number}   n       The number of iterations to check (optional)
 * @param  {object}   options Additional options for check (optional)
 */
function checking(desc, args, body, n, options) {
    if (typeof n === 'undefined') {
        n = 1000;
        options = {};
    }
    if (typeof options === 'undefined' && typeof n !== 'number') {
        options = n;
        n = 1000;
    }
    return checkers.forAll(args, body).check(n, options);
}
