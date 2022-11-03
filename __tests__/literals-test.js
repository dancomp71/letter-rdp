module.exports = test => {
    
    // NumericLiteral
    test(`42`, {
        type: 'Program',
        body: {
            type: 'NumericLiteral',
            value: 42
        },
    });

    test(`"Hello"`, {
        type: 'Program',
        body: {
            type: 'StringLiteral',
            value: 'Hello'
        },
    });

    test(`'Hello'`, {
        type: 'Program',
        body: {
            type: 'StringLiteral',
            value: 'Hello'
        },
    });
}