const { Tokenizer } = require('./Tokenizer');

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
        return {
            type: 'Program',
            body: this.StatementList()
        };
    }

    /**
     * StatementList
     * : Statement
     * | StatementList Statement -> Statement Statement Statement Statement
     * ;
     */
    StatementList() {
        const statementList = [this.Statement()]
        while(this._lookahead != null) {
            statementList.push(this.Statement());
        }
        return statementList;
    }

    /**
     * Statement
     * : ExpressionStatement
     * ;
     */
    Statement() {
        switch(this._lookahead.type) {
            case '{':
                return this.BlockStatement();
            default:
                return this.ExpressionStatement();
        }
    }

    /** 
     * BlockStatement
     * : '{' OptStatementList '}'
     * ;
     */
    BlockStatement() {

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
