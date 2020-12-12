/**
 * @fileOverview 工具
 * @name utils.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const globby = require('globby');
const resolve = require('resolve');
const readPkg = require('read-pkg');
const { isString, isArray, isBoolean, isPlainObject } = require('lodash');
const path = require('path');
const fs = require('fs');
const BuiltinModule = require('module');

exports.pkg = readPkg.sync({ cwd: path.resolve('..', __dirname) });
exports.isString = isString;
exports.isArray = isArray;
exports.isBoolean = isBoolean;
exports.isPlainObject = isPlainObject;

// Guard against poorly mocked module constructors.
const Module = module.constructor.length > 1
  ? module.constructor
  /* istanbul ignore next */
  : BuiltinModule;

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

function resolveModule(modulePath, opts) {
  let filePath = undefined;
  try {
    filePath = resolve.sync(modulePath, { basedir: opts.cwd });
  } finally {
    return filePath;
  }
}

exports.resolveModule = resolveModule;

function* loadMatchedModules(patterns, ...modulesOpts) {
  for (let opts of modulesOpts) {
    const filePaths = globby.sync(patterns, opts);
    for (let filePath of filePaths) {
      const content = loadModule(filePath);
      yield { path: filePath, content, cwd: opts.cwd };
    }
  }
}
exports.loadMatchedModules = loadMatchedModules;
