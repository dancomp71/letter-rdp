
describe('Parse Literals', function() {
    it('parse Numeric Literal', function() {
      const program = '  42  ;';
      const expected = {
            type: 'Program',
            body: [{
                type: 'ExpressionStatement',
                expression: {
                    type: 'NumericLiteral',
                    value: 42
                }
            }],
        };
      compile(program).expect(expected);
    });

    it('parse hello double quoted string', function() {
        const program = `"hello";`;
        const expected = {
            type: 'Program',
            body: [{
                type: 'ExpressionStatement',
                expression: {
                    type: 'StringLiteral',
                    value: 'hello'
                }
            }],
        };
        compile(program).expect(expected);
    });

    it('parse hello single quote string', function() {
        const program = `'hello';`;
        const expected = {
            type: 'Program',
            body: [{
                type: 'ExpressionStatement',
                expression: {
                    type: 'StringLiteral',
                    value: 'hello'
                }
            }],
        };
        compile(program).expect(expected);
    });
});
  