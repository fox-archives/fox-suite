import bareConfig from './config/bare.config';
import defaultConfig from './config/default.config';
import anyConfig from './config/lint/any.config';
import cozyConfig from './config/lint/cozy.config';
import strictConfig from './config/lint/strict.config';
import excessiveConfig from './config/lint/excessive.config';
import { readFoxConfig } from './readConfig';

/**
 * Rule Resolution
 * configs of the lowest priority are added to the rootConfig. first
 * cozyConfig gets added. then, strictConfig overwrites cozyConfig. lastly,
 * excessiveConfig overwrites strictConfig (and by extension, whatever is
 * in cozyConfig)
 *
 * when editing, keep in mind it is harder to move a rule from a higher
 * priority to a lower priority (if we wish to edit)
 */
const foxConfig = readFoxConfig()

const configVariants: any[] = []
if (foxConfig.lint === 'off') {
  configVariants.concat([anyConfig])
} else if (foxConfig.lint === 'cozy') {
  configVariants.concat([defaultConfig, cozyConfig])
} else if (foxConfig.lint === 'strict') {
  configVariants.concat([defaultConfig, cozyConfig, strictConfig])
} else if (foxConfig.lint === 'excessive') {
  configVariants.concat([
    defaultConfig,
    cozyConfig,
    strictConfig,
    excessiveConfig,
  ])
}

const isProd = process.env.NODE_ENV === 'production'
for (const configVariant of configVariants) {
  Object.assign(bareConfig.rules, configVariant.default.rules)
  if (isProd) {
    Object.assign(bareConfig.rules, configVariant.isProd.rules)
  } else {
    Object.assign(bareConfig.rules, configVariant.isNotProd.rules)
  }
}

import browserConfig from './config/env/browser.config'
import nodeConfig from './config/env/node.config'
import denoConfig from './config/env/deno.config'

const configVariants2: any[] = []
function addEnvConfig(string: string) {
  if (foxConfig.env === 'browser') {
    configVariants2.push(browserConfig)
  } else if (foxConfig.env === 'node') {
    configVariants2.push(nodeConfig)
  } else if (foxConfig.env === 'deno') {
    configVariants2.push(denoConfig)
  }
}
if (Array.isArray(foxConfig.env)) {
  foxConfig.env.forEach(addEnvConfig)
} else {
  addEnvConfig(foxConfig.env)
}
// Object.assign(bareConfig.env, configVariants2.env)

module.exports = bareConfig
