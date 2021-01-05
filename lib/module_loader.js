/**
 * @fileOverview 模块加载类
 * @name module_loader.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const assert = require('assert');

const micromatch = require('micromatch');
const Loader = require('./loader');
const {
  loadMatchedModules, pkg,
  isArray, isString, isPlainObject, isBoolean,
} = require('./utils');

const PROPERTY_PATTERNS = Symbol('PATTERNS');
const PROPERTY_MODULES_OPTS = Symbol('MODULES_OPTS');

/**
 * 模块加载器类
 * @class
 */
class ModuleLoader extends Loader {

  /**
   * 模块可选项
   * @typedef {Object} ModuleOpts
   * @property {String} cwd 模块加载执行目录
   */

  /**
   * 模块加载器可选项
   * @typedef {Object} ModuleLoaderOpts
   * @property {Boolean} reverse 是否逆序加载
   * @property {Array<String> | String} mode 匹配模式
   */

  /**
   * 构造方法
   * @param {Array<String> | String} patterns 模块匹配模式
   * @param {Array<ModuleOpts>} modulesOpts 模块可选项
   * @param {ModuleLoaderOpts} opts 模块加载器可选项
   */
  constructor(patterns, modulesOpts, opts) {
    assert(isArray(patterns) ? patterns.length > 0 : isString(patterns), `[${pkg.name}] ModuleLoader: constructor must have argument`);
    assert(isArray(modulesOpts) && modulesOpts.length > 0 && modulesOpts.every(_ => isPlainObject(_) && isString(_.cwd)), `[${pkg.name}] ModuleLoader: wrong modulesOpts`);

    super();

    if (opts) {
      assert(isPlainObject(opts), `[${pkg.name}] ModuleLoader: wrong opts`);
      assert(opts.reverse === undefined || isBoolean(opts.reverse), `[${pkg.name}] Boot: wrong opts.reverse`);
    }

    const matchedModulesOpts = opts && opts.mode ? modulesOpts.filter(_ => filterModulesOpts(opts.mode, _)) : modulesOpts;
    this[PROPERTY_PATTERNS] = patterns;
    this[PROPERTY_MODULES_OPTS] = opts && opts.reverse === true ? matchedModulesOpts.slice(0).reverse() : matchedModulesOpts;
  }

  /**
   * 类实例迭代器方法
   * @yields {any} 加载模块项
   */
  * [Symbol.iterator]() {
    const patterns = this[PROPERTY_PATTERNS];
    const modulesOpts = this[PROPERTY_MODULES_OPTS];
    if (modulesOpts && modulesOpts.length > 0) { yield* loadMatchedModules(patterns, ...modulesOpts); }
  }
}

module.exports = ModuleLoader;

/**
 * 模块可选项过滤
 * @param {Array<String> | String} pattern 匹配模式
 * @param {ModuleOpts} opts 模块可选项
 * @return {Boolean} 是否匹配
 */
function filterModulesOpts(pattern, opts) {
  const modes = opts.modes;
  if (!modes) { return true; }
  return modes.length > 0 ? micromatch.some(opts.modes, pattern) : false;
}
