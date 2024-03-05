const { Tokenizer } = require('./Tokenizer');

// -------------------------------
// Dfault AST node factories

const DefaultFactory = {
    Program(body) {
        return {
            type: 'Program',
            body
        };
    },
    EmptyStatement() {
        return {
            type: 'EmptyStatement'
        };
    },
    BlockStatement(body) {
        return {
            tyep: 'BlockStatement',
            body
        };
    },
    ExpressionStatement(expression) {
        return {
            type: 'ExpressionStatement',
            expression
        };
    },
    NumericLiteral(value) {
        return {
            type: 'NumericaLiteral',
            value
        };
    },
    StringLiteral(value) {
        return {
            type: 'StringLiteral',
            value
        };
    }
};

// -----------------------------
// S-expression AST node factories

const SExpressionFactory = {
    Program(body) {
        return ['begin', body];
    },
    EmptyStatement() {},
    BlockStatement(body) {
        return ['begin', body];
    },
    ExpressionStatement(expression) {
        return expression;
    },
    NumericLiteral(value) {
        return value;
    },
    StringLiteral(value) {
        return `"value"`;
    }

};

const AST_MODE = 'default';
const factory = AST_MODE == 'default' ? DefaultFactory : SExpressionFactory;

class Parser {

    constructor() {
        this._string = '';
    }

    /**
     * Parses a string into an AST. 
     */
    parse(string) {
        this._string = string;
        this._tokenizer = new Tokenizer();
        this._tokenizer.init(string);
        this._lookahead = this._tokenizer.getNextToken();
        return this.Program();
    }

    /** 
     * Main entry point
     * 
     * Program
     *   : NumericLiteral
     *   ;
     */
    Program() {
        return factory.Program(this.StatementList());
    }

    /**
     * StatementList
     * : Statement
     * | StatementList Statement -> Statement Statement Statement Statement
     * ;
     */
    StatementList(stopLookahead = null) {
        const statementList = [this.Statement()]
        while(this._lookahead != null && this._lookahead.type !== stopLookahead) {
            statementList.push(this.Statement());
        }
        return statementList;
    }

    /**
     * Statement
     * : ExpressionStatement
     * | BlockStatement
     * | EmptyStatement
     * ;
     */
    Statement() {
        switch(this._lookahead.type) {
            case ';': 
                return this.EmptyStatement();
            case '{':
                return this.BlockStatement();
            default:
                return this.ExpressionStatement();
        }
    }

    /** 
     * EmptyStatement
     *  : ';'
     *  ;
     */
    EmptyStatement() {
        this._eat(';');
        return {
            type: 'EmptyStatement'
        };
    }

    /** 
     * BlockStatement
     * : '{' OptStatementList '}'
     * ;
     */
    BlockStatement() {
        this._eat('{');
        const body = this._lookahead.type !== '}' ? this.StatementList('}') : [];
        this._eat('}');
        return {
            type: 'BlockStatement',
            body
        };
    }

    /**
     * ExpressionStatement
     * : Expression ';'
     * ;
     */
    ExpressionStatement() {
        const expression = this.Expression();
        this._eat(';');
        return {
            type: 'ExpressionStatement',
            expression 
        };
    }

    /**
     * Expression
     *  : Literal;
     *  ;
     */
    Expression() {
        return this.AssignmentExpression();
    }

    /** AssigmentExpression
     *  : AdditiveExpression
     *  | LeftHandSideExpression AssignmentOperator AssignmentExpression
     *  ;
     */
    AssignmentExpression() {
        const left = this.AdditiveExpression();
        if(!this._isAssignmentOperator(this._lookahead.type)) {
            return left;
        }

        return {
            type: 'AssignmentExpression',
            operator: this.AssignmentOperator().value,
            left: this._checkValueAssignmentTarget(left),
            right: this.AssignmentExpression()
        };
    }

    /** LeftHandSideExpression
     *  : Identifier
     *  ;
     */
    LeftHandSideExpression() {
        return this.Identifier();
    }

    /** Identifier
     *  : IDENTIFIER
     *  ;
     */
    Identifier() {
        const name = this._eat('IDENTIFIER').value;
        return {
            type: 'Identifier',
            name
        };
    }

    /** Extra check whether it's a valid assignment target */
    _checkValueAssignmentTarget(node) {
        if(node.type === 'Identifier') {
            return node;
        }
        throw new SyntaxError('Invalid left-hand side in assignment expression');
    }

    /** whether the token is an assignment operator */
    _isAssignmentOperator(tokenType) {
        return tokenType === 'SIMPLE_ASSIGN' || tokenType === 'COMPLEX_ASSIGN';
    }

    /** AssignmentOperator
     *  : SIMPLE_ASSIGN
     *  | COMPLEX_ASSIGN
     *  ;
     */
    AssignmentOperator() {
        if(this._lookahead.type === 'SIMPLE_ASSIGN') {
            return this._eat('SIMPLE_ASSIGN');
        }
        return this._eat('COMPLEX_ASSIGN');
    }

    /** Generic binary expression */
    _BinaryExpression(builderName, operatorToken) {
        let left = this[builderName]();
        console.log('_BinaryExpression.this._lookahead', builderName, operatorToken, this._lookahead);
        while(this._lookahead.type === operatorToken) {
            const operator = this._eat(operatorToken).value;
            const right = this[builderName]();
            left = {
                type: 'BinaryExpression',
                operator,
                left,
                right
            };
        }
        return left;
    }

    // _BinaryExpressionCb(expressionCallback, operatorToken) {
    //     let left = expressionCallback.apply(this);
    //     while(this._lookahead.type === operatorToken) {
    //         const operator = this._eat(operatorToken).value;
    //         const right = expressionCallback.apply(this);
    //         left = {
    //             type: 'BinaryExpression',
    //             operator,
    //             left,
    //             right
    //         };
    //     }
    //     return left;
    // }


    /** Additive Expression
     *  : Literal
     *  | AdditiveExpression ADDITIVE_OPERATOR Literal
     *  ;
     */
    AdditiveExpression() {
        // return this._BinaryExpressionCb(
        //     this.MultiplicativeExpression, 
        //     'ADDITIVE_OPERATOR'
        // );
        console.log('AdditiveExpression');
        // return this._BinaryExpression(
        //     "MultiplicativeExpression", 
        //     'ADDITIVE_OPERATOR'
        // );


        let left = this.MultiplicativeExpression();
        while(this._lookahead.type === 'ADDITIVE_OPERATOR') {
            const operator = this._eat('ADDITIVE_OPERATOR').value;
            const right = this.MultiplicativeExpression();
            left = {
                type: 'BinaryExpression',
                operator,
                left,
                right
            };
        }
        return left;
    }

    /** Multiplicative Expression
     *  : Literal
     *  | MultiplicativeExpression MULTIPLICATIVE_OPERATOR PrimaryExpression => PrimaryExpression MULTIPLICATIVE_OPERATOR
     *  ;
     */
    MultiplicativeExpression() {
        // return this._BinaryExpressionCb(
        //     this.PrimaryExpression, 
        //     'MULTIPLICATIVE_OPERATOR'
        // );
        console.log('MultiplicativeExpression');
        // return this._BinaryExpression(
        //     "PrimaryExpression", 
        //     'MULTIPLICATIVE_OPERATOR'
        // );


        let left = this.PrimaryExpression();
        while(this._lookahead.type === 'MULTIPLICATIVE_OPERATOR') {
            // operator: *, /
            const operator = this._eat('MULTIPLICATIVE_OPERATOR').value;
            const right = this.PrimaryExpression();
            left = {
                type: 'BinaryExpression',
                operator,
                left,
                right
            };
        }
        return left;
    }

    /** PrimaryExpression
     *  : Literal
     *  | ParenthesizedExpression
     *  | LeftHandSizeExpression
     *  ;
     */
    PrimaryExpression() {
        if(this._isLiteral(this._lookahead.type)) {
            return this.Literal();
        }
        switch(this._lookahead.type) {
            case '(': 
                return this.ParenthesizedExpression();
            default:
                return this.LeftHandSideExpression();
        }
    }

    /** Whether the token is a literal */
    _isLiteral(tokenType) {
        return tokenType === 'NUMBER' || tokenType === 'STRING';
    }


    /** ParenthesizedExpression
     *  : '(' Expression ')'
     *  ;
     */

    ParenthesizedExpression() {
        this._eat('(');
        const expression = this.Expression();
        this._eat(')');
        return expression;
    }


    NumericLiteral() {
        const token = this._eat('NUMBER');
        return {
            type: 'NumericLiteral',
            value: Number(token.value),
        }
    }

    StringLiteral() {
        const token = this._eat('STRING');
        return {
            type: 'StringLiteral',
            value: token.value.slice(1, -1), // no quotes included
        }
    }

    Literal() {
        switch(this._lookahead.type) {
            case 'NUMBER': return this.NumericLiteral();
            case 'STRING': return this.StringLiteral();
        }
        throw new SyntaxError(`Literal: unexpected literal`);
    }

    _eat(tokenType) {
        const token = this._lookahead;

        if(token == null) {
            throw new SyntaxError(
                `Unexpected end of input, expect: "${tokenType}"`,
            );
        }

        if(token.type !== tokenType) {
            throw new SyntaxError(
                `Unexpected token: "${token.value}", expected: "${tokenType}"`,
            );
        }

        this._lookahead = this._tokenizer.getNextToken();

        return token;
    }
}

module.exports = {
    Parser,
};
