import { sortAlphabetical, sortContributors } from './util'

/**
 * @description members at the top level
 */
export const groupTopLevel: IGroup = {
  location: '',
  keys: [
    { name: 'name' },
    { name: 'description' },
    { name: 'version'},
    { name: 'license' },
    { name: 'private' },
    { name: 'type' },
    { name: 'workspaces', sortMethod: sortAlphabetical },
  ],
}


/**
 * @description scripts
 */
export const groupScriptsAndConfig: IGroup = {
  location: '',
  keys: [
    { name: 'scripts' },
    { name: 'betterScripts' },
    { name: 'config', sortMethod: sortAlphabetical }
  ]
}


/**
 * @description members for external packages. it _must_ be
 * sorted alphabetically
 */
export const groupExternalPackageConfig: IGroup = {
  location: '',
  keys: [
    { name: 'autoprefixer' },
    { name: 'ava' },
    { name: 'babel' },
    { name: 'browserify' },
    { name: 'browserslist' },
    { name: 'commitlint' },
    { name: 'eslintConfig' },
    { name: 'eslintIgnore' },
    { name: 'husky' },
    { name: 'jest' },
    { name: 'lint-staged' },
    { name: 'mocha' },
    { name: 'nodemonConfig' },
    { name: 'npmpkgjsonlint' },
    { name: 'nyc' },
    { name: 'postcss' },
    { name: 'pre-commit' },
    { name: 'prettier' },
    { name: 'remarkConfig' },
    { name: 'stylelint' },
    { name: 'xo' },
  ]
}


/**
 * @description published package metadata
 */
export const groupNpmPackageMeta: IGroup = {
  location: '',
  keys: [
    { name: 'author' },
    { name: 'homepage' },
    { name: 'repository' },
    { name: 'bugs'},
    { name: 'funding' },
    { name: 'contributors', sortMethod: sortContributors },
    { name: 'keywords', sortMethod: sortAlphabetical },
    { name: 'publishConfig' },
    { name: 'preferGlobal' },
  ]
}


/**
 * @description members that concern how to access the bundle / type
 * of bundle that is being used
 */
export const groupJsEntryPoints: IGroup = {
  location: '',
  keys: [
    { name: 'sideEffects' },
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
export const groupMiscFile: IGroup = {
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
    { name: 'binary' },
  ]
}


/**
 * @description runtime platform related information
 */
export const groupEnginesOsCpu: IGroup = {
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
export const groupVsCodeExtensionMeta: IGroup = {
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
export const groupDependencyTypes: IGroup = {
  location: '',
  keys: [
    { name: 'flat' },
    { name: 'resolutions', sortMethod: sortAlphabetical },
    { name: 'dependencies', sortMethod: sortAlphabetical },
    { name: 'devDependencies', sortMethod: sortAlphabetical },
    { name: 'peerDependencies', sortMethod: sortAlphabetical },
    { name: 'peerDependenciesMeta', sortMethod: sortAlphabetical },
    { name: 'optionalDependencies', sortMethod: sortAlphabetical },
    { name: 'bundledDependencies', sortMethod: sortAlphabetical },
    { name: 'bundleDependencies', sortMethod: sortAlphabetical },
  ]
}

interface IGroup {
  location: string,
  keys: Array<{
    name: string,
    sortMethod?: Function
  }>
}

interface IGroupRoot {
  [key: string]: IGroup
}

export const groupRootCategories: IGroupRoot = {
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
