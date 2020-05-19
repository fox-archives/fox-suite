/**
 * Enable rules that could prevent
 * potentially misinterpreted code
 */
module.exports = {
  default: {
    rules: {
      'accessor-pairs': 'error',
      complexity: ['error', { max: 15 }],
      'consistent-return': 'error',
      'default-param-last': 'error',
      'grouped-accessor-pairs': 'error',
      'guard-for-in': 'error',
      'no-div-regex': 'error',
      'no-else-return': ['error', { allowElseIf: false }],
      'no-implicit-coercion': [
        'error',
        {
          boolean: true,
          number: true,
          string: true,
          allow: [],
        },
      ],
      'no-implicit-globals': 'error',
      'no-multi-str': 'error',
      'no-param-reassign': [
        'error',
        {
          props: true,
          ignorePropertyModificationsFor: [
            // ctx, req, request, res, response
          ],
        },
      ],
      'no-restricted-properties': 'off',
      'no-sequences': 'error',
      'no-void': 'off',
      'no-warning-comments': 'off',
      'prefer-named-capture-group': 'error',
      'prefer-regex-literals': 'off',
      radix: ['error', 'always'],
      'require-await': 'off',
      'vars-on-top': 'error',
      strict: 'off',
      'no-shadow': 'error',
      // TODO: eslint 7
      // 'no-restricted-exports': [],
      'no-restricted-imports': [
        'error',
        {
          paths: [],
          patterns: [],
        },
      ],
      'no-var': 'error',
      'prefer-arrow-callback': [
        'off',
        {
          allowNamedFunctions: false,
          allowUnboundThis: true,
        },
      ],
      'prefer-destructuring': [
        'off',
        {
          VariableDeclarator: {
            array: false,
            object: true,
          },
          AssignmentExpression: {
            array: true,
            object: false,
          },
        },
        {
          enforceForRenamedProperties: false,
        },
      ],
      'prefer-numeric-literals': 'error',
      'prefer-rest-params': 'error',
      'prefer-spead': 'off',
      'prefer-template': 'error',
      'global-require': 'error',
      'no-confusing-arrow': 'error',
      'no-restricted-modules': ['error', {}],
      'no-sync': 'error',
    },
  },
  isNotProd: {},
  isProd: {},
}
