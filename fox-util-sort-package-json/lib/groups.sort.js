import { sortAlphabetical } from "./util"

/**
 * @summary specifics of each sorting group
 */



/**
 * @description members at the top level
 */
export const groupTopLevel = {
  location: '',
  keys: [
    { name: 'name' },
    { name: 'description' },
    { name: 'version'},
    { name: 'license' },
    { name: 'private' },
  ],
}

/**
 * @description scripts
 * @todo scripts sort
 */
export const groupScriptsAndConfig = {
  location: '',
  keys: [
    { name: 'scripts' },
    { name: 'betterScripts' },
    { name: 'config', type: 'object', sortMethod: sortAlphabetical }
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
    { name: 'husky' },
    { name: 'pre-commit' },
    { name: 'commitlint' },
    { name: 'lint-staged' },
    { name: 'config' },
    { name: 'nodemonConfig' },
    { name: 'browserify' },
    { name: 'babel' },
    { name: 'browserslist' },
    { name: 'xo' },
    { name: 'prettier' },
    { name: 'eslintConfig' },
    { name: 'eslintIgnore' },
    { name: 'npmpkgjsonlint' },
    { name: 'remarkConfig' },
    { name: 'stylelint' },
    { name: 'ava' },
    { name: 'jest' },
    { name: 'mocha' },
    { name: 'nyc' },
  ]
}

/**
 * @description published package metadata
 */
export const groupNpmPackageMeta = {
  location: '',
  keys: [
    { name: 'author' },
    { name: 'homepage' },
    { name: 'repository' },
    { name: 'bugs'},
    { name: 'funding' },
    { name: 'contributors' },
    { name: 'keywords', type: 'array', sortMethod: sortAlphabetical },
    { name: 'publishConfig' },
    { name: 'preferGlobal' },
  ]
}

/**
 * @description members that concern how to access the bundle / type
 * of bundle that is being used
 */
export const groupJsEntryPoints = {
  location: '',
  keys: [
    { name: 'sideEffects' },
    { name: 'type' },
    { name: 'exports' },
    { name: 'main' },
    { name: 'umd:main' },
    { name: 'jsdelivr' },
    { name: 'unpkg' },
    { name: 'module' },
    { name: 'source' },
    { name: 'jsnext:main' },
    { name: 'browser' },
    { name: 'types' },
    { name: 'typings' },
  ]
}

/**
 * @description miscellaneous files / folders
 */
export const groupMiscFile = {
  location: '',
  keys: [
    { name: 'style' },
    { name: 'example' },
    { name: 'examplestyle' },
    { name: 'assets' },
    { name: 'bin' },
    { name: 'man' },
    { name: 'directories' },
    { name: 'files' },
    { name: 'workspaces' },
    { name: 'binary' },
  ]
}

/**
 * @description runtime platform related information
 */
export const groupEnginesOsCpu = {
  location: '',
  keys: [
    { name: 'engines' },
    { name: 'engineStrict' },
    { name: 'os' },
    { name: 'cpu' },
  ]
}

/**
 * @description publishing information for
 * vscode extension
 */
export const groupVsCodeExtensionMeta = {
  location: '',
  keys: [
    { name: 'displayName' },
    { name: 'extensionPack' },
    { name: 'categories' },
    { name: 'extensionDependencies' },
    { name: 'icon' },
    { name: 'badges' },
    { name: 'galleryBanner' },
    { name: 'preview' },
    { name: 'markdown' },
    { name: 'contributes' },
    { name: 'activationEvents' },
    { name: 'qna' },
    { name: 'publisher' },
  ]
}

/**
 * @description literally all dependencies
 */
export const groupDependencyTypes = {
  location: '',
  keys: [
    { name: 'flat' },
    { name: 'resolutions' },
    { name: 'dependencies' },
    { name: 'devDependencies' },
    { name: 'peerDependencies' },
    { name: 'peerDependenciesMeta' },
    { name: 'optionalDependencies' },
    { name: 'bundledDependencies' },
    { name: 'bundleDependencies' },
  ]
}
