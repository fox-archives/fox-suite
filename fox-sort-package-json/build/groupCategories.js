"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
/**
 * @description members at the top level
 */
exports.groupTopLevel = {
    location: '',
    keys: [
        { name: 'name' },
        { name: 'description' },
        { name: 'version' },
        { name: 'license' },
        { name: 'private' },
        { name: 'type' },
        { name: 'workspaces', sortMethod: util_1.sortAlphabetical },
    ],
};
/**
 * @description scripts
 */
exports.groupScriptsAndConfig = {
    location: '',
    keys: [
        { name: 'scripts' },
        { name: 'betterScripts' },
        { name: 'config', sortMethod: util_1.sortAlphabetical }
    ]
};
/**
 * @description members for external packages. it _must_ be
 * sorted alphabetically
 */
exports.groupExternalPackageConfig = {
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
};
/**
 * @description published package metadata
 */
exports.groupNpmPackageMeta = {
    location: '',
    keys: [
        { name: 'author' },
        { name: 'homepage' },
        { name: 'repository' },
        { name: 'bugs' },
        { name: 'funding' },
        { name: 'contributors', sortMethod: util_1.sortContributors },
        { name: 'keywords', sortMethod: util_1.sortAlphabetical },
        { name: 'publishConfig' },
        { name: 'preferGlobal' },
    ]
};
/**
 * @description members that concern how to access the bundle / type
 * of bundle that is being used
 */
exports.groupJsEntryPoints = {
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
};
/**
 * @description miscellaneous files / folders
 */
exports.groupMiscFile = {
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
};
/**
 * @description runtime platform related information
 */
exports.groupEnginesOsCpu = {
    location: '',
    keys: [
        { name: 'engines' },
        { name: 'engineStrict' },
        { name: 'os' },
        { name: 'cpu' },
    ]
};
/**
 * @description publishing information for
 * vscode extension
 */
exports.groupVsCodeExtensionMeta = {
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
};
/**
 * @description literally all dependencies
 */
exports.groupDependencyTypes = {
    location: '',
    keys: [
        { name: 'flat' },
        { name: 'resolutions', sortMethod: util_1.sortAlphabetical },
        { name: 'dependencies', sortMethod: util_1.sortAlphabetical },
        { name: 'devDependencies', sortMethod: util_1.sortAlphabetical },
        { name: 'peerDependencies', sortMethod: util_1.sortAlphabetical },
        { name: 'peerDependenciesMeta', sortMethod: util_1.sortAlphabetical },
        { name: 'optionalDependencies', sortMethod: util_1.sortAlphabetical },
        { name: 'bundledDependencies', sortMethod: util_1.sortAlphabetical },
        { name: 'bundleDependencies', sortMethod: util_1.sortAlphabetical },
    ]
};
exports.groupRootCategories = {
    groupTopLevel: exports.groupTopLevel,
    groupScriptsAndConfig: exports.groupScriptsAndConfig,
    groupExternalPackageConfig: exports.groupExternalPackageConfig,
    groupNpmPackageMeta: exports.groupNpmPackageMeta,
    groupJsEntryPoints: exports.groupJsEntryPoints,
    groupMiscFile: exports.groupMiscFile,
    groupEnginesOsCpu: exports.groupEnginesOsCpu,
    groupVsCodeExtensionMeta: exports.groupVsCodeExtensionMeta,
    groupDependencyTypes: exports.groupDependencyTypes
};
//# sourceMappingURL=groupCategories.js.map