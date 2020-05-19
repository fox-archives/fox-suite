/**
 * default configuration
 */
module.exports = {
  parserOptions: {
    ecmaFeatures: {
      // globalReturn: false,
      impliedStrict: true,
      // jsx: false,
    },
  },

  env: {
    // commonjs: true,
    // 'shared-node-browser': true,
    // worker: false,
    // amd: false,
    // mocha: false,
    // jasmine: false,
    // jest: false,
    // phantomjs: false,
    // protractor: false,
    // qunit: false,
    // jquery: false,
    // prototypejs: false,
    // shelljs: false,
    // meteor: false,
    // mongo: false,
    // applescript: false,
    // nashorn: false,
    // serviceworker: false,
    // atomtest: false,
    // embertest: false,
    // webextensions: false,
    // greasemonkey: false,
  },

  plugins: [
    // "simple-import-sort",
    // "no-use-extend-native",
    // "no-secrets",
    // "prettier"
  ],
  extends: [
    // "eslint:recommended",
    // "plugin:promise/recommended",
    // "plugin:import/errors",
    // "plugin:import/warnings",
    // "plugin:jest/recommended",
    // "plugin:jest/style",
    // "plugin:monorepo/recommended"
  ],

  overrides: [
    {
      files: ['**/test.js'],
      env: {
        // "jest": true,
        // "jest/globals": true
      },
    },
  ],
}
