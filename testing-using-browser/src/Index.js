// Import your parser and any other modules
const { Parser } = require('../../src/Parser.js');
const { Tokenizer } = require('../../src/Tokenizer.js');

// Import your Jasmine environment and any necessary setup
const Jasmine = require('jasmine');
const jasmine = new Jasmine();

// Add any Jasmine-related setup code here (e.g., custom matchers)
// ...

// Import your specs
require('./path/to/your/specs/yourSpec.js');
require('./path/to/your/specs/anotherSpec.js');
// Add more spec files as needed

// Run Jasmine
jasmine.execute();