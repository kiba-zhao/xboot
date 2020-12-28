/**
 * @fileOverview 工具
 * @name utils.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const globby = require('globby');
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


const NODE_MODULES_NAME = 'node_modules';
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
