/**
 * 模块解析可选项
 */
export type resolveModuleOpts = {
    /**
     * 执行目录
     */
    cwd: string;
};
/**
 * 加载匹配模块的可选项
 */
export type loadMatchedModulesOpts = {
    /**
     * 执行目录
     */
    cwd: string;
};
/**
 * 匹配的模块
 */
export type Module = {
    /**
     * 模块文件绝对路径
     */
    path: string;
    /**
     * 模块内容
     */
    content: any;
    /**
     * 执行目录
     */
    cwd: string;
};
export const pkg: readPkg.NormalizedPackageJson;
import { isString } from "lodash/common/lang";
import { isArray } from "lodash/common/lang";
import { isBoolean } from "lodash/common/lang";
import { isPlainObject } from "lodash/common/lang";
import { isFunction } from "lodash/common/lang";
import { defaults } from "lodash/common/object";
import readPkg = require("read-pkg");
/**
 * 模块解析可选项
 * @typedef {Object} resolveModuleOpts
 * @property {String} cwd 执行目录
 */
/**
 * 解析模块路径
 * @param {String} modulePath 模块路径
 * @param {resolveModuleOpts} opts 模块解析可选项
 * @return {String} 模块绝对路径
 */
export function resolveModule(modulePath: string, opts: resolveModuleOpts): string;
/**
 * 加载匹配模块的可选项
 * @typedef {Object} loadMatchedModulesOpts
 * @property {String} cwd 执行目录
 */
/**
 * 匹配的模块
 * @typedef {Object} Module
 * @property {String} path 模块文件绝对路径
 * @property {any} content 模块内容
 * @property {String} cwd 执行目录
 */
/**
 * 加载匹配的模块
 * @param {Array<String> | String} patterns 匹配模式
 * @param {loadMatchedModulesOpts} modulesOpts 模块可选项
 * @yields {Module} 匹配的模块
 */
export function loadMatchedModules(patterns: Array<string> | string, ...modulesOpts: loadMatchedModulesOpts): Generator<{
    path: string;
    content: any;
    cwd: any;
}, void, unknown>;
/**
 * 是否为匹配模式参数
 * @param {any} val 匹配模式参数值
 * @return {Boolean} 是否为匹配模式参数
 */
export function isPatterns(val: any): boolean;
export { isString, isArray, isBoolean, isPlainObject, isFunction, defaults, readPkg };
