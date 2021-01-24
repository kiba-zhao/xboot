/**
 * @fileOverview 工具
 * @name utils.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const globby = require('globby');
const readPkg = require('read-pkg');
const { isString, isArray, isBoolean, isPlainObject, isFunction, defaults } = require('lodash');
const path = require('path');
const fs = require('fs');
const BuiltinModule = require('module');

const pkg = readPkg.sync({ cwd: path.resolve(__dirname, '..') });
exports.pkg = pkg;
exports.isString = isString;
exports.isArray = isArray;
exports.isBoolean = isBoolean;
exports.isPlainObject = isPlainObject;
exports.isFunction = isFunction;
exports.defaults = defaults;
exports.readPkg = readPkg;

// Guard against poorly mocked module constructors.
const Module = module.constructor.length > 1
  ? module.constructor
  /* istanbul ignore next */
  : BuiltinModule;

/**
 * 加载模块函数
 * @param {String} filePath 模块文件路径
 * @return {any} 模块内容
 * @throws {Error} 加载模块异常
 */
function loadModule(filePath) {
  try {
    // if not js module, just return content buffer
    const extname = path.extname(filePath);
    if (extname && !Module._extensions[extname]) {
      return fs.readFileSync(filePath);
    }

    // require js module
    const m = require(filePath);
    if (!m) return m;
    // it's es module
    if (m.__esModule) return 'default' in m ? m.default : m;
    return m;
  } catch (err) {
    err.message = `[${pkg.name}] loadModule: ${filePath}, error: ${err.message}`;
    throw err;
  }
}


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
function* loadMatchedModules(patterns, ...modulesOpts) {

  for (const opts of modulesOpts) {
    const filePaths = globby.sync(patterns, opts);
    for (const filePath of filePaths) {
      const content = loadModule(path.join(opts.cwd, filePath));
      yield { path: filePath, content, cwd: opts.cwd };
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
  const init = isFunction(module.content) ? module.content : undefined;
  if (init) { init(...args); }
}

exports.setup = setup;
