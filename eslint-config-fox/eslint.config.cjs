const bareConfig = require('./lib/config/bare.config.cjs')
const defaultConfig = require('./lib/config/default.config.cjs')
const anyConfig = require('./lib/config/lint/any.config.cjs')
const cozyConfig = require('./lib/config/lint/cozy.config.cjs')
const strictConfig = require('./lib/config/lint/strict.config.cjs')
const excessiveConfig = require('./lib/config/lint/excessive.config.cjs')
const { readFoxConfig } = require('./lib/readConfig.cjs')

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

const configVariants = []
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

const browserConfig = require('./lib/config/env/browser.config.cjs')
const nodeConfig = require('./lib/config/env/node.config.cjs')
const denoConfig = require('./lib/config/env/deno.config.cjs')

const configVariants2 = []
function addEnvConfig(string) {
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
Object.assign(bareConfig.env, configVariants2.env)

module.exports = bareConfig
