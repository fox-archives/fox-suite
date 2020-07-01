import * as config from '../'
import { typescriptConfig } from './typescript'
import { prettierPlugin } from '../plugins/prettier'
import merge from 'lodash.mergewith'
import { customizer, getVars } from '../util'


const [ foxConfig, tier ] = getVars()

let tsConfig = config
tsConfig = merge(config, typescriptConfig(foxConfig, tier), customizer)

// reapply prettierConfig just in case
tsConfig = merge(config, prettierPlugin(foxConfig, tier), customizer)

module.exports = tsConfig
