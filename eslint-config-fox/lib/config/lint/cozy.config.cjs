/**
 * Enable default rules
 */
module.exports = {
  default: {
    rules: {
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'no-eq-null': 'error',
      'no-iterator': 'error',
      'no-loop-func': 'error',
      'no-multi-spaces': [
        'error',
        {
          ignoreEOLComments: false,
          exceptions: {
            Property: false,
            BinaryExpression: false,
            VariableDeclarator: false,
            ImportDeclaration: false,
          },
        },
      ],
      'no-octal-escape': 'error',
      'no-return-await': 'error',
      'no-throw-literal': 'error',
      'require-unicode-regexp': 'error',
      'prefer-const': [
        'error',
        {
          destructuring: 'any',
          ignoreReadBeforeAssign: true,
        },
      ],
      curly: ['error', 'multi-line'],
      'no-case-declarations': 'off',
      'no-empty-pattern': 'error',
      'no-return-assign': ['error', 'except-parens'],
      'no-useless-escape': 'off',
      'no-with': 'off',
      'for-direction': 'off',
      'getter-return': 'off',
      'no-async-promise-executor': 'off',
      'no-compare-neg-zero': 'error',
      'no-cond-assign': ['error', 'except-parens'],
      'no-control-regex': 'off',
      'no-debugger': 'error',
      'no-dupe-args': 'error',
      'no-dupe-else-if': 'error',
      'no-dupe-keys': 'error',
      'no-duplicate-case': 'error',
      'no-empty-character-class': 'error',
      'no-ex-assign': 'error',
      'no-extra-parens': [
        'off',
        'all',
        {
          conditionalAssign: true,
          nestedBinaryExpressions: false,
          returnAssign: false,
          ignoreJSX: 'all', // delegate to eslint-plugin-react
          enforceForArrowConditionals: false,
        },
      ],
      'no-extra-semi': 'error',
      'no-func-assign': 'error',
      'no-import-assign': 'error',
      'no-inner-declarations': 'error',
      'no-invalid-regexp': 'error',
      'no-irregular-whitespace': 'error',
      'no-misleading-character-class': 'error',
      'no-obj-calls': 'error',
      'no-prototype-builtins': 'error',
      'no-regex-spaces': 'error',
      'no-sparse-arrays': 'off',
      'no-unexpected-multiline': 'error',
      'no-unreachable': 'error',
      'no-unsafe-finally': 'error',
      'no-unsafe-negation': 'error',
      'require-atomic-updates': 'error',
      'use-isnan': 'error',
      'no-console': 'off',
      'valid-typeof': ['error', { requireStringLiterals: true }],
      // other style
      'arrow-parens': ['error', 'always'],
      'constructor-super': 'error',
      'no-class-assign': 'error',
      'no-const-assign': 'error',
      'no-dupe-class-members': 'error',
      'no-new-symbol': 'error',
      'no-this-before-super': 'error',
      'no-useless-computed-key': ['error', { enforceForClassMembers: true }],
      'sort-imports': 'off',
      'init-declarations': 'off',
      'no-catch-shadow': 'off',
      'no-delete-var': 'error',
      'no-shadow-restricted-names': 'error',
      'no-undefined': 'off',
      'no-mixed-requires': [
        'off',
        {
          grouping: false,
          allowCall: false,
        },
      ],
      'no-new-require': 'error',
      'no-process-env': 'off',
      'no-process-exit': 'off',
      'no-sync': 'off',

      // mostly style
      // 'array-bracket-newline': ['warn', { multiline: true, minItems: 4 }],
      // 'array-bracket-spacing': ['warn', 'never', { singleValue: false, objectsInArrays: false, objectsInArrays: false }],
      // 'array-element-newline': ['warn', { multiline: true, minItems: 2 }],
      // 'block-spacing': ['warn', 'always'],
      // 'brace-style': ['warn', 'stroustrup', { allowSingleLine: true }],
      // 'capitalized-comments': ['warn', 'always', { ignorePattern: ["jscs", "jshint", "eslint", "istanbul", "global", "globals", "exported"], ignoreInlineComments: false, ignoreConsecutiveComments: false }],
      // 'comma-dangle': ['warn', 'always', {
      //   arrays: 'always-multiline',
      //   objects: 'always-multiline',
      //   imports: 'always-multiline',
      //   exports: 'always-multiline',
      //   functions: 'always-multiline'
      // }],
      // 'comma-spacing': ['warn', { before: false, after: true }],
      // 'comma-style': ['warn', 'last', {
      //   ArrayExpression: false,
      //   ArrayPattern: false,
      //   ArrowFunctionExpression: false,
      //   CallExpression: false,
      //   FunctionDeclaration: false,
      //   FunctionExpression: false,
      //   ImportDeclaration: false,
      //   ObjectExpression: false,
      //   ObjectPattern: false,
      //   VariableDeclaration: false,
      //   NewExpression: false
      // }],
      // 'computed-property-spacing': ['warn', 'never', { enforceForClassMembers: true }],
      // 'eol-last': ['warn', 'always'],
      // 'func-call-spacing': ['warn', 'never'],
      // 'function-call-argument-newline': ['warn', 'consistent'],
      // 'function-paren-newline': ['warn', ''],

      'arrow-body-style': ['error', 'never'],
      'arrow-spacing': ['error', { before: true, after: true }],
      'generator-star-spacing': ['error', { before: false, after: true }],
      'rest-spread-spacing': ['error', 'never'],
      'template-curly-spacing': ['error', 'never'],
      'yield-star-spacing': ['error', { before: false, after: true }],
      'no-redeclare': 'error',
      'no-useless-catch': 'off',
      'no-constant-condition': 'off',
    },
  },
  isNotProd: {
    rules: {
      'no-unused-expressions': 'off',
      'no-unused-labels': 'off',
      'valid-jsdoc': 'warn',
    },
  },
  isProd: {
    rules: {
      'no-unused-expressions': [
        'error',
        {
          allowShortCircuit: false,
          allowTernary: false,
          allowTaggedTemplates: false,
        },
      ],
      'no-unused-labels': 'error',
      'valid-jsdoc': 'error',
    },
  },
}
