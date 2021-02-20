/**
 * @fileOverview 工具
 * @name utils.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const pkg = require('../package.json');
const fs = require('fs');
const globby = require('globby');
const { isString, isArray, isBoolean, isPlainObject, isFunction, defaults } = require('lodash');
const path = require('path');
const FileModule = require('./file_module');

exports.pkg = pkg;
exports.isString = isString;
exports.isArray = isArray;
exports.isBoolean = isBoolean;
exports.isPlainObject = isPlainObject;
exports.isFunction = isFunction;
exports.defaults = defaults;

const NODE_MODULES_NAME = 'node_modules';

/**
 * 生成node模块路径
 * @param {String} modulePath 模块路径
 * @param {String} cwd 执行目录
* @yields {String} node模块路径
 */
function* generateNodeModulesPaths(modulePath, cwd) {
  const nodeModulesPath = path.join(cwd, NODE_MODULES_NAME, modulePath);
  if (fs.existsSync(nodeModulesPath)) {
    yield nodeModulesPath;
  }

  const dirname = path.dirname(cwd);
  if (dirname !== cwd) {
    yield* generateNodeModulesPaths(modulePath, dirname);
  }
}

const DOT = '.';
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
function resolveModule(modulePath, opts) {

  if (path.isAbsolute(modulePath)) {
    return fs.existsSync(modulePath) ? modulePath : undefined;
  }

  if (modulePath[0] === DOT) {
    const m_path = path.join(opts.cwd, modulePath);
    return fs.existsSync(m_path) ? m_path : undefined;
  }

  let m_path;
  const nodeModulePaths = generateNodeModulesPaths(modulePath, opts.cwd);
  for (const nodeModulePath of nodeModulePaths) {
    m_path = nodeModulePath;
    break;
  }
  return m_path;
}

exports.resolveModule = resolveModule;

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
function* loadMatchedModules(patterns, opts, ...modulesOpts) {
  const defaultOpts = {};
  if (opts && opts.expand === false) {
    defaultOpts.expandDirectories = false;
    defaultOpts.onlyFiles = false;
  }
  for (const moduleOpts of modulesOpts) {
    const _opts = Object.assign({}, defaultOpts, moduleOpts);
    const filePaths = globby.sync(patterns, _opts);
    for (const filePath of filePaths) {
      yield new FileModule(filePath, _opts);
    }
  }

}
exports.loadMatchedModules = loadMatchedModules;

/**
 * 是否为匹配模式参数
 * @param {any} val 匹配模式参数值
 * @return {Boolean} 是否为匹配模式参数
 */
function isPatterns(val) {
  return isArray(val) ? val.length > 0 : isString(val);
}
exports.isPatterns = isPatterns;

/**
 * 初始化模块函数
 * @param {Module} module 加载的模块对象
 * @param {Array<any>} args 初始化参数
 */
function setup(module, ...args) {
  const init = module.module;
  if (isFunction(init)) { init(...args); }
}

exports.setup = setup;
