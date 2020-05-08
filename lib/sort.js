import fs from 'fs'
import assert from 'assert'

import {
  groupTopLevel,
  groupScriptsAndConfig,
  groupExternalPackageConfig,
  groupNpmPackageMeta,
  groupJsEntryPoints,
  groupMiscFile,
  groupEnginesOsCpu,
  groupVsCodeExtensionMeta,
  groupDependencyTypes
} from './groups.sort.js'

/**
 * terminology
 *
 * a 'group' is a collection of keys that we want to be
 * sorted alphebetically relative to each other. this library
 * only actually sorts groups relative to each other
 *
 * a 'surface' is a platform where sorting occurs. aka
 * a member of nested member of `package.json`
 *
 * @todo fix bug where if item in package.json is not in this list, it disappears
 */
async function tlaWhen() {
  const packageJsonRaw = await fs.promises.readFile('./sample.package.json')
  const input = JSON.parse(packageJsonRaw)

  const groupRoot = {
    groupTopLevel,
    groupScriptsAndConfig,
    groupExternalPackageConfig,
    groupNpmPackageMeta,
    groupJsEntryPoints,
    groupMiscFile,
    groupEnginesOsCpu,
    groupVsCodeExtensionMeta,
    groupDependencyTypes
  }

  let output = {}
  for (const groupName in groupRoot) {
    const group = groupRoot[groupName]

    // ensure group meets schema requirements
    assert(typeof group === 'object' && !(group instanceof Array))
    assert(typeof group.location === 'string')
    assert(Array.isArray(group.keys))

    const surface = {}
    for (const key of group.keys) {
      // ensure the key actually exists in package.json. if not,
      // 'continue' (skip) to next element in loop
      if (group.location === '' && !input[key.name]) continue

      if (key.type === 'lone') {
        surface[key.name] = input[key.name]
      }
    }

    if(group.location === '') {
      output = {
        ...output,
        ...surface
      }
    }
  }

  console.log(JSON.stringify(output, null, 2))
}

(async () => await tlaWhen())()

process.on('uncaughtException', (err) => console.error(err))
process.on('unhandledRejection', (err) => console.error(err))
