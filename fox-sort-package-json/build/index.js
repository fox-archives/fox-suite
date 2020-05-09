"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const assert_1 = __importDefault(require("assert"));
const util_1 = require("./util");
const is_1 = require("./is");
const groupCategories_1 = require("./groupCategories");
/**
 * terminology
 *
 * a 'group' is a collection of keys that we want to be
 * sorted alphebetically relative to each other. this library
 * only actually sorts groups relative to each other
 *
 * a 'surface' is a platform where sorting occurs. aka
 * an object we add members to. members can be root keys to
 * package.json or members of a nested object in package.json (ex. "eslint": {})
 * usually we create a surface, then add members, and lastly, sort the members
 * within that surface
 */
/**
 * @description finds the closes parent package.json file and sorts it
 */
async function sortPackageJsonFileAuto() {
    const packageJsonFile = await util_1.findParentPackageJson();
    await sortPackageJsonFile(packageJsonFile);
}
exports.sortPackageJsonFileAuto = sortPackageJsonFileAuto;
/**
 * @description sorts a particular package.json file
 * @param {string} packageJsonFile - package.json file to sort. must be an absolute path
 */
async function sortPackageJsonFile(packageJsonFile) {
    if (!fs_1.default.existsSync(packageJsonFile)) {
        throw new Error(`packageJsonFile '${packageJsonFile}' does not exist`);
    }
    const packageJson = JSON.parse(await fs_1.default.promises.readFile(packageJsonFile, { encoding: 'utf8' }));
    const sortedPackageJson = sortPackageJson(packageJson);
    await fs_1.default.promises.writeFile(packageJsonFile, JSON.stringify(sortedPackageJson, null, 2));
}
exports.sortPackageJsonFile = sortPackageJsonFile;
/**
 * @description sorts an object that represents a package.json file
 * @param {object} input - object to sort
 * @return {object} the sorted object
 */
function sortPackageJson(input) {
    let output = {};
    for (const groupName in groupCategories_1.groupRootCategories) {
        // @ts-ignore
        const group = groupCategories_1.groupRootCategories[groupName];
        assert_1.default(is_1.isObject(group), "groups must be an object");
        assert_1.default(is_1.isString(group.location), "groups must have a 'location' property of type stirng");
        assert_1.default(is_1.isArray(group.keys), "groups must have a 'keys' property that's an array");
        const surface = util_1.processGroup(input, group);
        output = {
            ...output,
            ...surface
        };
    }
    return util_1.ensureUnecognizedKeys(input, output);
}
exports.sortPackageJson = sortPackageJson;
process.on('uncaughtException', (err) => console.error(err));
process.on('unhandledRejection', (err) => console.error(err));
//# sourceMappingURL=index.js.map