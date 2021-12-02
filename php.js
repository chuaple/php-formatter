const output = require('./output');

const format = code => {
    let level = 0;
    const indentSnippets = code => {
        code = code.trim();
        const comment = code.startsWith('/');
        if ('})]'.includes(code.charAt(0))) level--;
        if (code) code = `${' '.repeat(level * 4)}${code}`;
        if ('{(['.includes(code.charAt(code.length - 1)) && !comment) level++;
        return code;
    };
    output('[formatCode] Start');
    const contents = [];
    return code
        .replace(/(['"])([\s\S]*?)(\1)/g, (_, q, c) => (contents.push(c), `${q}quotestring${q}`))

        .replace(/ ?([\+\-\*\/\.\?!><]?={1,3})(?!\>) ?/g, ' $1 ') // `=` [>1]
        .replace(/ ?([\&\|]{2}) ?/g, ' $1 ') // `&&` `||` [>1]
        .replace(/ *(,) ?(?!\n)/g, '$1 ') // `,` [0, >1]
        .replace(/\n* *(\{)/g, ' $1') // before `{` [1]

        .replace(/(\() */g, '$1 ') // after  `(` [1]
        .replace(/ *(\))/g, ' $1') // before `)` [1]
        .replace(/\(\s*\)/g, '()') // `()`

        .replace(/(if|for|each)\s*\(/g, '$1 (') // after `if` `for` and `each`

        .replace(/([\{\}])(.)/g, '$1\n$2') // after `{` `}` [LF]
        .replace(/\}\s*(else|catch)/g, '} $1') // after  `else` except
        .replace(/(else|catch)\s*\{/g, '$1 {') // before `else` except

        .replace(/[；;](.)/g, ';\n$1') // after `;` [LF]
        .replace(/for \([\s\S]*?\)/g, exp => exp.replace(/;\s+/g, '; ')) // `for` except

        .split(/\r?\n/)
        .map(indentSnippets)
        .join('\n') // 设置缩进

        .replace(/([^\{])\n+( *(public |private )?(function |class ))/g, '$1\n\n$2') // 函数/类前添加空行
        .replace(/(\n{2,})/g, '\n\n') // 去除多余空行

        .replace(/(['"]).*?(\1)/g, (_, q, c) => ((c = contents.shift()), q === '"' && c.match(/[\$\n']/g) ? `"${c}"` : `'${c}'`));
};

module.exports = code => (code.startsWith('<?php') ? format(code) : code);
