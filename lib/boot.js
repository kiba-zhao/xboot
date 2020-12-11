/**
 * @fileOverview Boot类
 * @name boot.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';
const assert = require('assert');
const { loadMatchFiles, loadBasePackage, loadPluginPackages, pkg, isArray, isString, isBoolean, isPlainObject, toAsyncFunction, isRunner } = require('utils');

const PROPERTY_OPTS = Symbol('opts');
const PROPERTY_PATTERNS = Symbol('patterns');
const PROPERTY_CACHE = Symbol('cache');

class Boot {
  constructor(patterns, opts) {

    assert(isArray(patterns) ? patterns.length > 0 : isString(patterns), `[${pkg.name}] Boot: constructor must have argument`);
    assert(isPlainObject(opts), `[${pkg.name}] Boot: wrong opts`);
    assert(isString(opts.dir), `[${pkg.name}] Boot: wrong opts.dir`);
    assert(isBoolean(opts.reverse), `[${pkg.name}] Boot: wrong opts.reverse`);
    assert(isBoolean(opts.plugin), `[${pkg.name}] Boot: wrong opts.plugin`);

    this[PROPERTY_PATTERNS] = patterns;
    this[PROPERTY_OPTS] = opts;
  }

  async init(runner) {
    assert(isRunner(runner), `[${pkg.name}] Boot: wrong runner`);

    const patterns = this[PROPERTY_PATTERNS];
    const opts = this[PROPERTY_OPTS];

    const cache = this[PROPERTY_CACHE] = this[PROPERTY_CACHE] || {};
    const root = cache.root = cache.root || loadBasePackage({ cwd: opts.dir });
    const fn = toAsyncFunction(runner);

    const baseFiles = opts.reverse !== true ? loadMatchBaseFilesPositive(patterns, root) : loadMatchBaseFilesReverse(patterns, root);
    for (let baseFile of baseFiles) {
      let baseRes = await fn(baseFile);
      if (baseRes === false)
        break;
    }

    if (opts.plugin !== true)
      return;

    const plugins = cache.plugins = cache.plugins || loadPluginPackages(root);
    const pluginFiles = loadMatchPluginFiles(patterns, plugins);
    for (let pluginFile of pluginFiles) {
      let pluginRes = await fn(pluginFile);
      if (pluginRes === false)
        break;
    }
  }
}

exports.Boot = Boot;


function* loadMatchBaseFilesPositive(patterns, node) {
  yield* loadMatchFiles(patterns, node);
  if (node.parent)
    yield* loadMatchBaseFilesPositive(patterns, node.parent);
}

function* loadMatchBaseFilesReverse(patterns, node) {
  if (node.parent)
    yield* loadMatchBaseFilesReverse(patterns, node.parent);
  yield* loadMatchFiles(patterns, node);
}

function* loadMatchPluginFiles(patterns, plugins, completed = {}) {
  const pendings = [];
  let count = 0;

  initPluginsCompleted(plugins, completed);
  for (let plugin of plugins) {
    if (!checkPlugin(plugin, completed)) {
      pendings.push(plugin);
      continue;
    }
    completed[plugin.name] = true;
    yield* loadMatchFiles(patterns, plugin);
    count++;
  }

  if (count <= 0 && pendings.length > 0)
    throw new Error(`[${pkg.name}] loadMatchPluginFiles: plugins ${pendings.map(_ => _.name).join(',')} always pending`);

  if (pendings.length > 0)
    yield* loadMatchPluginFiles(patterns, pendings, completed);
}

function initPluginsCompleted(plugins, completed) {
  for (let plugin of plugins) {
    completed[plugin.name] = false;
  }
}


function checkPlugin(plugin, completed) {
  if (!plugin.dependencies || plugin.dependencies.length <= 0)
    return true;

  let res = true;
  for (let dep of plugin.dependencies) {
    if (completed[dep] === false) {
      res = false;
      break;
    }
    if (!completed[dep])
      throw new Error(`[${pkg.name}] loadMatchPluginFiles: Undefined Plugin Dependency ${plugin.name} > ${dep}`);
  }

  if (!res || !plugin.optionalDependencies || plugin.optionalDependencies.length <= 0)
    return res;

  for (let optDep of plugin.optionalDependencies) {
    if (completed[optDep] === false) {
      res = false;
      break;
    }
  }

  return res;
}
