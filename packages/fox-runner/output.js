'use strict';

// this implicitly extends `stylelint-config-fox`

/**
 * @param {import("fox-suite/node_modules/fox-types/types").IFoxConfig} [fox] - `fox.config.js` configuration object
 * @return {Record<string, any>}
 */
function input (fox) {
  let a = "cozy";
  console.log(false);
  console.log(a);
  return {
    rules: {}
  };
}

module.exports = input;
