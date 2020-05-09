"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isString = (val) => typeof val === 'string';
exports.isArray = (val) => Array.isArray(val);
exports.isObject = (val) => typeof val === 'object' && !Array.isArray(val);
exports.isFunction = (val) => typeof val === 'function';
//# sourceMappingURL=is.js.map