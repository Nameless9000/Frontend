module.exports = {
    root: true,
    env: {
        browser: true,
        node: true,
    },
    parserOptions: {
        parser: 'babel-eslint',
    },
    extends: [
        '@nuxtjs',
        'plugin:nuxt/recommended',
    ],
    plugins: [
    ],
    rules: {
        'react/react-in-jsx-scope': 'off',
        'no-useless-constructor': 'off',
        'require-jsdoc': 'off',
        'new-cap': 'off',
        'object-curly-spacing': [
            'error',
            'always',
        ],
        'linebreak-style': 'off',
        indent: [
            'error',
            4,
            {
                SwitchCase: 1,
            },
        ],
        quotes: [
            'error',
            'single',
        ],
        semi: [
            'error',
            'always',
        ],
        'max-len': 'off',
        'comma-dangle': [
            'warn',
            {
                arrays: 'always-multiline',
                objects: 'always-multiline',
                imports: 'never',
                exports: 'never',
                functions: 'never',
            },
        ],
        camelcase: [
            'error',
        ],
    },
};
