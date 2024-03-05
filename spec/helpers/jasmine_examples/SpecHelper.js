global.isCommandLine = true; 

const { Parser } = require('../../../src/Parser');
const compile = require('../../../src/Compile');

global.compile = compile;

const assert = require('assert');

function deepEqual(obj1, obj2) {
  if (obj1 === obj2) {
    return true;
  }

  if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}

beforeEach(function () {
  jasmine.addMatchers({
    toBePlaying: function () {
      return {
        compare: function (actual, expected) {
          const player = actual;

          return {
            pass: player.currentlyPlayingSong === expected && player.isPlaying
          };
        }
      };
    },
    equalAst: function() {
      return {
        compare: function(expectedAst, program) {
          // console.log('program:');
          // console.log(program);
          
          // console.log('expected:');
          // console.log(JSON.stringify(expectedAst, null, 2));
          
          let parser = new Parser();
          const actualAst = parser.parse(program);
         
          // console.log('actual:');
          // console.log(JSON.stringify(actualAst, null, 2));

          return {
            pass: deepEqual(actualAst, expectedAst),
            message: `Expected AST:\n${JSON.stringify(expectedAst, null, 2)}\nActual AST:\n${JSON.stringify(actualAst, null, 2)}`
          };
        }
      }
    },
    toDeepEqual: function () {
      return {
        compare: function (actual, expected) {
          const pass = deepEqual(actual, expected);

          return {
            pass: pass,
            message: function () {
              return `Expected:\n${JSON.stringify(expected, null, 2)}\nActual:\n${JSON.stringify(actual, null, 2)}`;
            }
          };
        }
      };
    }
  });
});
