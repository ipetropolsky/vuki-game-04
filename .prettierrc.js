export default {
    singleQuote: true,
    trailingComma: 'es5',
    arrowParens: 'always',
    printWidth: 120,
    tabWidth: 4,
    overrides: [
        {
            files: ['*.json'],
            options: {
                trailingComma: 'none',
                tabWidth: 2,
            },
        },
    ],
};
