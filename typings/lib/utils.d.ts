export var pkg: readPkg.NormalizedPackageJson;
import readPkg = require("read-pkg");
import { isString } from "lodash/common/lang";
import { isArray } from "lodash/common/lang";
import { isBoolean } from "lodash/common/lang";
import { isPlainObject } from "lodash/common/lang";
export function resolveModule(modulePath: any, opts: any): string;
export function loadMatchedModules(patterns: any, ...modulesOpts: any[]): Generator<{
    path: string;
    content: any;
    cwd: any;
}, void, unknown>;
export function isPatterns(val: any): boolean;
export function toGeneratorFunction(fn: any): GeneratorFunction | ((...args: any[]) => Generator<any, void, unknown>);
export { isString, isArray, isBoolean, isPlainObject };
