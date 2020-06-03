import { rootConfig } from './config/root.config'
import { IFox } from 'fox-types'

/**
 * @todo remove duplicate function (can't
 * import from `fox-utils` because `fox-types`
 * is an ECMAScript module and `stylelint-config-fox`
 * is emitted as a CommonJS module for
 * compatability with stylelint)
 */
function getFoxOptionsFromEnv(): IFox {
  let foxOptions = process.env.FOX_SUITE_FOX_OPTIONS
  foxOptions = foxOptions || "{ error: 'process.env.FOX_SUITE_FOX_OPTIONS is falsey' }"
  return JSON.parse(foxOptions)
}

const fox = getFoxOptionsFromEnv()

module.exports = {
  ...rootConfig(fox)
}
