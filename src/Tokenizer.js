const Spec = [
    // Whitespace:
    [/^\s+/, null],

    // Comments:
    // skip single-line comments
    [/^\/\/.*/, null],
    
    // skip multi-line comments
    [/^\/\*[\s\S]*?\*\//, null],

    // symbols, delimiters:
    [/^;/, ';'],
    [/^\{/, '{'],
    [/^\}/, '}'],
    [/^\(/, '('],
    [/^\)/, ')'],
    
    // Numbers:
    [/^\d+/, 'NUMBER'],

    // identifiers
    [/^\w+/, 'IDENTIFIER'],

    // assignment operators: =, /=, +=, -=,
    [/^=/, 'SIMPLE_ASSIGN'],
    [/^[\*\/\+\-]=/, 'COMPLEX_ASSIGN'],

    // Math operators: +, -, *, /
    [/^[+\-]/, 'ADDITIVE_OPERATOR'],
    [/^[*\/]/, 'MULTIPLICATIVE_OPERATOR'],

    // Strings:
    [/^"[^"]*"/, 'STRING'],
    [/^'[^']*'/, 'STRING'],
];

class Tokenizer {

    init(string) {
        this._string = string;
        this._cursor = 0;
    }

    isEOF() {
        return  this._cursor === this._string.length;
    }

    hasMoreTokens() {
        return this._cursor < this._string.length;
    }

    _match(regexp, string) {
        const matched = regexp.exec(string);
        if(matched == null) {
            return null;
        }

        this._cursor += matched[0].length;
        return matched[0];
    }


    getNextToken() {
        if(!this.hasMoreTokens()) {
            return null;
        }

        const string = this._string.slice(this._cursor);

        for (const [regexp, tokenType] of Spec) {
            const tokenValue = this._match(regexp, string);
            
            // could not match rule, continue
            if (tokenValue == null) {
                continue;
            }

            // should skip token, e.g. whitespace
            if (tokenType == null) {
                return this.getNextToken();
            }

            return {
                type: tokenType,
                value: tokenValue
            };
        }

        throw new SyntaxError(`Unexpected token: "${string[0]}"`);
    }
}

module.exports = {
    Tokenizer,
}