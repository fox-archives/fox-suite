/**
 * @summary specifics of each sorting group
 * @todo implement more specific sorting strategies
 * for nested objects and arrays
 * @todo remove need for type 'lone'
 */

import { sortAlphabetical } from "./util"


/**
 * @description members at the top level
 */
export const groupTopLevel = {
  location: '',
  keys: [
    { name: 'name', type: 'lone' },
    { name: 'description', type: 'lone' },
    { name: 'version', type: 'lone'},
    { name: 'license', type: 'lone' },
    { name: 'private', type: 'lone' },
  ],
}

/**
 * @description scripts
 * @todo scripts sort
 */
export const groupScriptsAndConfig = {
  location: '',
  keys: [
    { name: 'scripts', type: 'lone' },
    { name: 'betterScripts', type: 'lone' },
    { name: 'config', type: 'lone' }
  ]
}

/**
 * @description members for external packages
 * @todo manually make this alphabetical
 * @todo ensure all are external
 */
export const groupExternalPackageConfig = {
  location: '',
  keys: [
    { name: 'husky', type: 'lone' },
    { name: 'pre-commit', type: 'lone' },
    { name: 'commitlint', type: 'lone' },
    { name: 'lint-staged', type: 'lone' },
    { name: 'config', type: 'lone' },
    { name: 'nodemonConfig', type: 'lone' },
    { name: 'browserify', type: 'lone' },
    { name: 'babel', type: 'lone' },
    { name: 'browserslist', type: 'lone' },
    { name: 'xo', type: 'lone' },
    { name: 'prettier', type: 'lone' },
    { name: 'eslintConfig', type: 'lone' },
    { name: 'eslintIgnore', type: 'lone' },
    { name: 'npmpkgjsonlint', type: 'lone' },
    { name: 'remarkConfig', type: 'lone' },
    { name: 'stylelint', type: 'lone' },
    { name: 'ava', type: 'lone' },
    { name: 'jest', type: 'lone' },
    { name: 'mocha', type: 'lone' },
    { name: 'nyc', type: 'lone' },
  ]
}

/**
 * @description published package metadata
 */
export const groupNpmPackageMeta = {
  location: '',
  keys: [
    { name: 'author', type: 'lone' },
    { name: 'homepage', type: 'lone' },
    { name: 'repository', type: 'lone' },
    { name: 'bugs', type: 'lone'},
    { name: 'funding', type: 'lone' },
    { name: 'contributors', type: 'lone' },
    { name: 'keywords', type: 'array', sortMethod: sortAlphabetical },
    { name: 'publishConfig', type: 'lone' },
    { name: 'preferGlobal', type: 'lone' },
  ]
}

/**
 * @description members that concern how to access the bundle / type
 * of bundle that is being used
 */
export const groupJsEntryPoints = {
  location: '',
  keys: [
    { name: 'sideEffects', type: 'lone' },
    { name: 'type', type: 'lone' },
    { name: 'exports', type: 'lone' },
    { name: 'main', type: 'lone' },
    { name: 'umd:main', type: 'lone' },
    { name: 'jsdelivr', type: 'lone' },
    { name: 'unpkg', type: 'lone' },
    { name: 'module', type: 'lone' },
    { name: 'source', type: 'lone' },
    { name: 'jsnext:main', type: 'lone' },
    { name: 'browser', type: 'lone' },
    { name: 'types', type: 'lone' },
    { name: 'typings', type: 'lone' },
  ]
}

/**
 * @description miscellaneous files / folders
 */
export const groupMiscFile = {
  location: '',
  keys: [
    { name: 'style', type: 'lone' },
    { name: 'example', type: 'lone' },
    { name: 'examplestyle', type: 'lone' },
    { name: 'assets', type: 'lone' },
    { name: 'bin', type: 'lone' },
    { name: 'man', type: 'lone' },
    { name: 'directories', type: 'lone' },
    { name: 'files', type: 'lone' },
    { name: 'workspaces', type: 'lone' },
    { name: 'binary', type: 'lone' },
  ]
}

/**
 * @description runtime platform related information
 */
export const groupEnginesOsCpu = {
  location: '',
  keys: [
    { name: 'engines', type: 'lone' },
    { name: 'engineStrict', type: 'lone' },
    { name: 'os', type: 'lone' },
    { name: 'cpu', type: 'lone' },
  ]
}

/**
 * @description publishing information for
 * vscode extension
 */
export const groupVsCodeExtensionMeta = {
  location: '',
  keys: [
    { name: 'displayName', type: 'lone' },
    { name: 'extensionPack', type: 'lone' },
    { name: 'categories', type: 'lone' },
    { name: 'extensionDependencies', type: 'lone' },
    { name: 'icon', type: 'lone' },
    { name: 'badges', type: 'lone' },
    { name: 'galleryBanner', type: 'lone' },
    { name: 'preview', type: 'lone' },
    { name: 'markdown', type: 'lone' },
    { name: 'contributes', type: 'lone' },
    { name: 'activationEvents', type: 'lone' },
    { name: 'qna', type: 'lone' },
    { name: 'publisher', type: 'lone' },
  ]
}

/**
 * @description literally all dependencies
 */
export const groupDependencyTypes = {
  location: '',
  keys: [
    { name: 'flat', type: 'lone' },
    { name: 'resolutions', type: 'lone' },
    { name: 'dependencies', type: 'lone' },
    { name: 'devDependencies', type: 'lone' },
    { name: 'peerDependencies', type: 'lone' },
    { name: 'peerDependenciesMeta', type: 'lone' },
    { name: 'optionalDependencies', type: 'lone' },
    { name: 'bundledDependencies', type: 'lone' },
    { name: 'bundleDependencies', type: 'lone' },
  ]
}
