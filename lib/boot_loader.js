/**
 * @fileOverview Boot类
 * @name boot.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';
const assert = require('assert');
const ModuleLoader = require('./module_loader');
const PluginLoader = require('./plugin_loader');
const { loadMatchedModules, resolveModule, pkg, isArray, isString, isBoolean, isPlainObject } = require('utils');

const PROPERTY_LOADERS = Symbol('LOADERS');

class BootLoader {
  constructor(patterns, opts) {

    assert(isArray(patterns) ? patterns.length > 0 : isString(patterns), `[${pkg.name}] Boot: constructor must have argument`);
    assert(isPlainObject(opts), `[${pkg.name}] Boot: wrong opts`);
    assert(isString(opts.config), `[${pkg.name}] Boot: wrong opts.config`);
    assert(isString(opts.dir), `[${pkg.name}] Boot: wrong opts.dir`);
    assert(isBoolean(opts.reverse), `[${pkg.name}] Boot: wrong opts.reverse`);
    assert(isBoolean(opts.plugin), `[${pkg.name}] Boot: wrong opts.plugin`);

    const configs = loadConfigs(opts.config, { cwd: opts.dir });
  }

  async load() {

    const patterns = this[PROPERTY_PATTERNS];
    const opts = this[PROPERTY_OPTS];

    const cache = this[PROPERTY_CACHE] = this[PROPERTY_CACHE] || {};
    const modulesOpts = cache.root = cache.root || loadBasePackage({ cwd: opts.dir });



    // const baseFiles = opts.reverse !== true ? loadMatchBaseFilesPositive(patterns, root) : loadMatchBaseFilesReverse(patterns, root);
    // for (let baseFile of baseFiles) {
    //   let baseRes = await fn(baseFile);
    //   if (baseRes === false)
    //     break;
    // }

    // if (opts.plugin !== true)
    //   return;

    // const plugins = cache.plugins = cache.plugins || loadPluginPackages(root);
    // const pluginFiles = loadMatchPluginFiles(patterns, plugins);
    // for (let pluginFile of pluginFiles) {
    //   let pluginRes = await fn(pluginFile);
    //   if (pluginRes === false)
    //     break;
    // }
  }
}

exports.BootLoader = BootLoader;

const ROOT = Symbol('ROOT');
function loadProfiles(patterns, opts, childOpts, completed = {}) {
  const package = opts.package || ROOT;
  if (completed[package])
    return [{ ...opts, config: patterns }];

  completed[package] = true;
  const cwd = package === ROOT ? opts.cwd : resolveModule(package, childOpts);
  const profiles = loadMatchedModules(patterns, { cwd });
  const profileOpts = {};
  let count = 0;
  for (let profile of profiles) {
    Object.assign(profileOpts, profile);
    count++;
  }
  if (count <= 0)
    return [{ ...opts, cwd, config: patterns }];

  const parents = loadProfiles(profileOpts.config || patterns, profileOpts, { cwd }, completed);
  const plugin = opts.plugin || parents[0].plugin;
  return [{ ...opts, cwd, plugin, config: patterns }, ...parents];

}

