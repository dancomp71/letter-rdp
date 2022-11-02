const { Parser } = require('../src/Parser');

const parser = new Parser();

// const program = '42';
const program = `  " 42 "  `;
// const program = '"double quote string"';
// const program = "'single quote string'";
const ast = parser.parse(program);

console.log(JSON.stringify(ast, null, 2));

