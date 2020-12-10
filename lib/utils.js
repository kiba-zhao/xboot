/**
 * @fileOverview 工具
 * @name utils.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const globby = require('globby');
const pkg = require('../package.json');
const { isString, isArray, isBoolean, isPlainObject, isFunction } = require('lodash');
const { types } = require('util');
const co = require('co');
const path = require('path');
const fs = require('fs');
const BuiltinModule = require('module');

exports.pkg = pkg;
exports.isString = isString;
exports.isArray = isArray;
exports.isBoolean = isBoolean;
exports.isPlainObject = isPlainObject;

// Guard against poorly mocked module constructors.
const Module = module.constructor.length > 1
  ? module.constructor
  /* istanbul ignore next */
  : BuiltinModule;

const ROOT = Symbol('ROOT');
const PACKAGE_JSON_NAME = 'package.json';
function loadBasePackage(opts, completed = {}) {
  const package = opts.base || ROOT;
  if (completed[package])
    return opts;

  completed[package] = true;
  const cwd = package === ROOT ? opts.cwd : resolveModule(package);
  const pkg = loadFile(path.join(cwd, PACKAGE_JSON_NAME));
  if (!pkg.xboot)
    return { ...opts, cwd };

  const parent = loadBasePackage(pkg.xboot, completed);
  const plugin = opts.plugin || parent.plugin;
  return { ...opts, cwd, parent, plugin };
}
exports.loadBasePackage = loadBasePackage;

function loadPlugins(node) {
  const _plugins = {};
  if (!node.plugin)
    return _plugins;

  const plugins = loadFile(path.join(node.cwd, node.plugin));
  for (let key in plugins) {
    const plugin = plugins[key];
    if (plugin)
      _plugins[key] = { ...plugins, base: node.base };
  }
  return node.parent ? { ...loadPlugins(node.parent), ..._plugins } : _plugins;

}

function loadPluginPackages(node) {
  const plugins = loadPlugins(node);
  const packages = [];
  for (let key in plugins) {
    const plugin = plugins[key];
    if (plugin.enabled === false || plugin.disabled === true)
      continue;
    const cwd = resolveModule(plugin.package);
    const pkg = loadFile(path.join(cwd, PACKAGE_JSON_NAME));
    packages.push({ ...plugin, cwd, pkg: pkg.xboot });
  }

  return packages;
}

exports.loadPluginPackages = loadPluginPackages;


function* loadMatchFiles(patterns, node) {

  const filePaths = globby.sync(patterns, { cwd: node.cwd });
  for (let filePath of filePaths) {
    const content = loadFile(filePath);
    yield { path: filePath, content, base: node.base };
  }
}
exports.loadMatchFiles = loadMatchFiles;

function loadFile(filePath) {
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
    err.message = `[${pkg.name}] load file: ${filePath}, error: ${err.message}`;
    throw err;
  }
}

function resolveModule(modulePath) {
  let filePath = undefined;
  try {
    filePath = require.resolve(modulePath);
  } finally {
    return filePath;
  }
}

function isRunner(...args) {
  return isFunction(...args) || types.isAsyncFunction(...args) || types.isGeneratorFunction(...args);
}


function toAsyncFunction(fn) {
  if (types.isAsyncFunction(fn)) { return fn; }
  if (types.isGeneratorFunction(fn)) { return co.wrap(fn); }
  return async function(...args) {
    const target = this;
    return fn(target, ...args);
  };
}
exports.toAsyncFunction = toAsyncFunction;
