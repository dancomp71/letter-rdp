const { kMaxLength } = require('buffer');
const { Parser } = require('../src/Parser');
const assert = require('assert');

/**
 * List of tests.
 */
const tests = [
    require('./literals-test.js'),
    require('./statementlist-test.js'),
    require('./block-test.js'),
    require('./empty-statement-test.js'),
    require('./math-test.js'),
    require('./assignment-test.js'),
];

const parser = new Parser();

function exec() {
    var  program = `

    x = 15;

    `;

    var ast = parser.parse(program);
    console.log(JSON.stringify(ast, null, 2));
}


/**
 * Test function.
 */
function test(program, expected) {
    const ast = parser.parse(program);
    assert.deepEqual(ast, expected);
}

exec();

// Run all tests:
// tests.forEach(testRun => testRun(test));

console.log('All assertions passed');
