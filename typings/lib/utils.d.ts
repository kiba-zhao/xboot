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
 * 检索匹配可选项
 */
export type globbyOpts = {
    /**
     * 是否展开目录
     */
    expand: boolean;
};
import { isString } from "lodash/common/lang";
import { isArray } from "lodash/common/lang";
import { isBoolean } from "lodash/common/lang";
import { isPlainObject } from "lodash/common/lang";
import { isFunction } from "lodash/common/lang";
import { defaults } from "lodash/common/object";
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
 * 检索匹配可选项
 * @typedef {Object} globbyOpts
 * @property {Boolean} expand 是否展开目录
 */
/**
 * 加载匹配的模块
 * @param {Array<String> | String} patterns 匹配模式
 * @param {globbyOpts} opts 检索匹配可选项
 * @param {loadMatchedModulesOpts} modulesOpts 模块可选项
 * @yields {FileModule} 匹配的模块
 */
export function loadMatchedModules(patterns: Array<string> | string, opts: globbyOpts, ...modulesOpts: loadMatchedModulesOpts): Generator<FileModule, void, unknown>;
/**
 * 是否为匹配模式参数
 * @param {any} val 匹配模式参数值
 * @return {Boolean} 是否为匹配模式参数
 */
export function isPatterns(val: any): boolean;
/**
 * 初始化模块函数
 * @param {Module} module 加载的模块对象
 * @param {Array<any>} args 初始化参数
 */
export function setup(module: any, ...args: Array<any>): void;
import FileModule = require("./file_module");
export { pkg, isString, isArray, isBoolean, isPlainObject, isFunction, defaults };
