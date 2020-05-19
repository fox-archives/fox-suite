/**
 * root config that only contains properties
 */

module.exports = {
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      impliedStrict: true,
    },
  },
  env: {
    es6: true,
    es2017: true,
    es2020: true,
  },
  plugins: [],
  extends: [],
  rules: {},
  overrides: [],
}
