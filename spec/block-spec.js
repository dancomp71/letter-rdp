describe("Block Tests", function () {
  it("Test Simple Block", function () {
    const program = `
      {
          42;
          "hello";
      }
  
      `;
    const expected = {
      type: "Program",
      body: [
        {
          type: "BlockStatement",
          body: [
            {
              type: "ExpressionStatement",
              expression: {
                type: "NumericLiteral",
                value: 42,
              },
            },
            {
              type: "ExpressionStatement",
              expression: {
                type: "StringLiteral",
                value: "hello",
              },
            },
          ],
        },
      ],
    };
    compile(program).expect(expected);
  });

  it("nested block statements", function () {
    const program = `
    {
        42;
        {
            "hello";
        }
    }

    `;
    const expected = {
        type: 'Program',
        body: [
            {
                type: 'BlockStatement',
                body: [
                    {
                        type: 'ExpressionStatement',
                        expression: {
                            type: 'NumericLiteral',
                            value: 42
                        }
                    },
                    {
                        type: 'BlockStatement',
                        body: [{
                            type: 'ExpressionStatement',
                            expression: {
                                type: 'StringLiteral',
                                value: 'hello'

                            }
                        }]
                    }
                ]
            }
        ]
    };
    compile(program).expect(expected);
  });

  it("empty block test", function () {
    const program = `
    {

    }

    `;
    const expected = {
        type: 'Program',
        body: [
            {
                type: 'BlockStatement',
                body: []
            }
        ]
    };
    compile(program).expect(expected);
  });
});
