"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// import { fileURLToPath } from 'url'
const lodash_1 = __importDefault(require("lodash"));
const is_1 = require("./is");
/**
 * @description alphabetically sorts array
 * @param {array} arr - array to be sorted alphabetically
 * @return {array} array with sorted keys
 */
function sortAlphabetical(arr) {
    return arr.sort(new Intl.Collator('en').compare);
}
exports.sortAlphabetical = sortAlphabetical;
function sortContributors(arr) {
    if (arr.every(is_1.isObject)) {
        return lodash_1.default.sortBy(arr, 'name');
    }
    else if (arr.every(is_1.isString)) {
        return sortAlphabetical(arr);
    }
    return arr;
}
exports.sortContributors = sortContributors;
/**
 * @description meta sort function that converts object
 * to array for regular sort functions to consume
 * @param {object} obj - object to be sorted by keys
 * @param {function} sortFn - function that does sorting. it returns a sorted array
 * @return {object} object with sorted keys
 */
function sortObject(obj, sortFn) {
    const sortedKeys = sortFn(Object.keys(obj));
    const sortedObject = {};
    for (const sortedKey of sortedKeys) {
        // @ts-ignore
        sortedObject[sortedKey] = obj[sortedKey];
    }
    return sortedObject;
}
exports.sortObject = sortObject;
/**
 * @description processes each group
 */
function processGroup(input, group) {
    const surface = {};
    for (const key of group.keys) {
        // ensure key meets schema requirements
        assert_1.default(is_1.isString(key.name), "keys must have a 'name' property of type string");
        // ensure the key actually exists in package.json. if not,
        // 'continue' (skip) to next element in loop
        if (!input.hasOwnProperty(key.name))
            continue;
        // do the reassigning. different behavior dependent if the key
        // value is a 'array', or 'object', or anything else
        const keyName = key.name;
        const keyValue = input[keyName];
        if (!key.hasOwnProperty('sortMethod')) {
            // @ts-ignore
            surface[keyName] = keyValue;
        }
        else if (is_1.isArray(keyValue)) {
            // @ts-ignore
            surface[keyName] = key.sortMethod(keyValue);
        }
        else if (is_1.isObject(keyValue)) {
            // @ts-ignore
            surface[keyName] = sortObject(keyValue, key.sortMethod);
        }
    }
    return surface;
}
exports.processGroup = processGroup;
/**
 *  @description when converting from oldSurface to sortedSurface,
 *  sorting keys in oldSurface are not always moved over to sortedSurface.
 *  this function fixes that, adding (and sorting) keys that have not been copied
 *  over to the _top_ of sortedSurface
 *  @param {object} oldSurface - old surface that includes all keys
 *  @param {object} sortedSurface - new sorted surface that may not have all keys as oldSurface
 *  @param {function} [sortingFunction] - function to sort all unrecognized keys by. defualts to alphabetical
 *  @return {object} object with all keys intact
 */
function ensureUnecognizedKeys(oldSurface, sortedSurface, sortingFunction) {
    // ensure parameters are expected
    assert_1.default(is_1.isObject(oldSurface));
    assert_1.default(is_1.isObject(sortedSurface));
    sortingFunction && assert_1.default(is_1.isFunction(sortingFunction));
    let surfaceTemp = {};
    for (const entryName in oldSurface) {
        // add all unknown elements to 'finalOutput' first
        if (oldSurface.hasOwnProperty(entryName) && !sortedSurface.hasOwnProperty(entryName)) {
            // @ts-ignore
            surfaceTemp[entryName] = oldSurface[entryName];
        }
    }
    const sortedSurfaceTemp = sortObject(surfaceTemp, sortingFunction || sortAlphabetical);
    return {
        ...sortedSurfaceTemp,
        ...sortedSurface
    };
}
exports.ensureUnecognizedKeys = ensureUnecognizedKeys;
/**
 * @description given the location of this binary, this finds the package.json
 * folder of the parent project
 * @async returns function 'walkup' which is async
 * @return {string} absolute path of parent packageJson file
 * @private
 * @todo make more robust; this probably won't work for pnpm and yarn 2
 */
function findParentPackageJson() {
    function parentDirOf(fileOrDir) {
        return path_1.default.join(fileOrDir, '..');
    }
    async function packageJsonExists(dir) {
        const dirents = await fs_1.default.promises.readdir(dir, { withFileTypes: true });
        return dirents.some(dirent => dirent.isFile() && dirent.name === 'package.json');
    }
    // currentLocation could be a file or dir
    async function walkUp(currentLocation) {
        if (await packageJsonExists(currentLocation)) {
            return path_1.default.join(currentLocation, 'package.json');
        }
        else {
            const newLocation = parentDirOf(currentLocation);
            return walkUp(newLocation);
        }
    }
    // const currentFile = fileURLToPath(import.meta.url)
    const currentFile = __filename;
    const currentDir = parentDirOf(currentFile);
    return walkUp(currentDir);
}
exports.findParentPackageJson = findParentPackageJson;
//# sourceMappingURL=util.js.map