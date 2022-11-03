const { Parser } = require('../src/Parser');
const assert = require('assert');

/**
 * List of tests.
 */
const tests = [require('./literals-test.js')];

const parser = new Parser();

/**
 * Test function.
 */
function test(program, expected) {
    const ast = parser.parse(program);
    assert.deepEqual(ast, expected);
}

// Run all tests:
tests.forEach(testRun => testRun(test));

console.log('All assertions passed');
