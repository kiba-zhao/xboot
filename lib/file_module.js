/**
 * @fileOverview 文件模块类
 * @name file_module.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const path = require('path');
const fs = require('fs');
const BuiltinModule = require('module');

// Guard against poorly mocked module constructors.
const Module = module.constructor.length > 1
  ? module.constructor
  /* istanbul ignore next */
  : BuiltinModule;

const PATH = Symbol('path');
const OPTIONS = Symbol('options');
const MODULE = Symbol('module');

/**
 * 文件模块类
 * @class
 */
class FileModule {
  constructor(filepath, opts) {
    this[PATH] = filepath;
    this[OPTIONS] = opts;
  }

  /**
   * 路径属性
   * @return {string}
   */
  get path() {
    return this[PATH];
  }

  /**
   * 执行目录
   * @return {string}
   */
  get cwd() {
    return this[OPTIONS].cwd;
  }

  /**
   * 完整文件路径
   * @return {string}
   */
  get filePath() {
    return path.join(this.cwd, this.path);
  }

  /**
   * plugin.js中定义的插件key
   * @return {String}
   */
  get plugin() {
    return this[OPTIONS].name;
  }

  /**
   * 文件模块
   * @return {any}
   */
  get module() {
    if (!this.hasOwnProperty(MODULE)) { this[MODULE] = loadModule(this); }
    return this[MODULE];
  }
}

module.exports = FileModule;

/**
 * 加载文件模块
 * @param {FileModule} fileModule
 * @return {any} 模块内容
 * @throws {Error} 异常
 */
function loadModule(fileModule) {
  const filePath = fileModule.filePath;
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
    err.message = `[FileModule] loadModule: ${filePath}, error: ${err.message}`;
    throw err;
  }
}
