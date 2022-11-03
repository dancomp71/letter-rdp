function exec() {

    // const program = '42';
    // const program = `42`;
    // const program = `     42    `;
    // const program = `  " 42 "  `;
    // const program = '"double quote string"';
    // const program = "'single quote string'";
    
    // const program = `
    //   // Number:
    //   42
    // `;
    
    // const program = `
    //   /* 
    //   * Documentation comment: 
    //   */
    //   42
    // `;
    
    // const program = `
    //   /* 
    //   * Documentation comment: 
    //   */
    //   "hello world"
    //
    // `;
    
        const program = `
    
        /* 
        * Documentation comment: 
        */
        "hello world";
    
        // Number:
        42;
    
        `;
    
    
        const ast = parser.parse(program);
    
        console.log(JSON.stringify(ast, null, 2));
    }
    
module.exports = {
    exec
};
