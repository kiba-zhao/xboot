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
const { isString, isArray, isBoolean, isPlainObject, isFunction } = require('lodash');
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
exports.readPkg = readPkg;

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
  try {
    return resolve.sync(modulePath, { basedir: opts.cwd });
  } catch (_) {
    return undefined;
  }
}

exports.resolveModule = resolveModule;

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

function isPatterns(val) {
  return isArray(val) ? val.length > 0 : isString(val);
}
exports.isPatterns = isPatterns;
