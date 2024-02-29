 module.exports = test => {
    
    // binary expression
    test(`2+2;`, {
        type: 'Program',
        body: [
            {
                type: 'ExpressionStatement',
                expression: {
                    type: 'BinaryExpression',
                    operator: '+',
                    left: {
                        type: 'NumericLiteral',
                        value: 2
                    },
                    right: {
                        type: 'NumericLiteral',
                        value: 2
                    }
                }
            }
        ]
    });

    // nested binary expressions
    // left: 3 + 2
    // right: 2
    test(`3 + 2 - 2;`, {
        type: 'Program',
        body: [
            {
                type: 'ExpressionStatement',
                expression: {
                    type: 'BinaryExpression',
                    operator: '-',
                    left: {
                        type: 'BinaryExpression',
                        operator: '+',
                        left: {
                            type: 'NumericLiteral',
                            value: 3
                        },
                        right: {
                            type: 'NumericLiteral',
                            value: 2
                        }
                    },
                    right: {
                        type: 'NumericLiteral',
                        value: 2
                    }
                }
            }
        ]
    });

    // simple multiplication
    test(`2 * 2;`, {
        type: 'Program',
        body: [
            {
                type: 'ExpressionStatement',
                expression: {
                    type: 'BinaryExpression',
                    operator: '*',
                    left: {
                        type: 'NumericLiteral',
                        value: 2
                    },
                    right: {
                        type: 'NumericLiteral',
                        value: 2
                    }
                }
            }
        ]
    });

    test(`2 * 2 * 4;`, {
        type: 'Program',
        body: [
            {
                type: 'ExpressionStatement',
                expression: {
                    type: 'BinaryExpression',
                    operator: '*',
                    left: {
                        type: 'BinaryExpression',
                        operator: '*',
                        left: {
                            type: 'NumericLiteral',
                            value: 2
                        },
                        right: {
                            type: 'NumericLiteral',
                            value: 2
                        }
                    },
                    right: {
                        type: 'NumericLiteral',
                        value: 4
                    }
                }
            }
        ]
    });

    // precedence of operations
    test(`2 + 2 * 2;`, {
        type: 'Program',
        body: [
            {
                type: 'ExpressionStatement',
                expression: {
                    type: 'BinaryExpression',
                    operator: '+',
                    left: {
                        type: 'NumericLiteral',
                        value: 2
                    },
                    right: {
                        type: 'BinaryExpression',
                        operator: '*',
                        left: {
                            type: 'NumericLiteral',
                            value: 2
                        },
                        right: {
                            type: 'NumericLiteral',
                            value: 2
                        }
                    }
                }
            }
        ]
    });

    // precedence of operations
    test(`(2 + 2) * 2;`, {
        type: 'Program',
        body: [
            {
                type: 'ExpressionStatement',
                expression: {
                    type: 'BinaryExpression',
                    operator: '*',
                    left: {
                        type: 'BinaryExpression',
                        operator: '+',
                        left: {
                            type: 'NumericLiteral',
                            value: 2
                        },
                        right: {
                            type: 'NumericLiteral',
                            value: 2
                        }
                    },
                    right: {
                        type: 'NumericLiteral',
                        value: 2
                    }
                }
            }
        ]
    });


 }