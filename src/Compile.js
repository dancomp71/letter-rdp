const { Parser } = require("./Parser");

function compile(program) {
  const parser = new Parser();
  const ast = parser.parse(program);

  // Return an object with the expect method
  return {
    expect: function (expected) {
      expect(ast).toEqual(expected);
    },
  };
}

module.exports = compile;
