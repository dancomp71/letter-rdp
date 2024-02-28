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
        this._tokenizer = new Tokenizer();
    }

    /**
     * Parses a string into an AST. 
     */
    parse(string) {
        this._string = string;
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
     * 
     */
    Expression() {
        return this.Literal();
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
