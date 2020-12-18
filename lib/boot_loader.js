/**
 * @fileOverview 引导加载类
 * @name boot_loader.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';
const assert = require('assert');
const Loader = require('./loader');
const ModuleLoader = require('./module_loader');
const PluginModuleLoader = require('./plugin_module_loader');
const { loadMatchedModules, resolveModule, pkg, isPatterns, isString, isBoolean, isPlainObject } = require('utils');

const PROPERTY_MODULE_LOADER = Symbol('MODULE_LOADER');
const PROPERTY_PLUGIN_MODULE_LOADER = Symbol('PLUGIN_MODULE_LOADER');

class BootLoader extends Loader {
  constructor(patterns, opts) {

    assert(isPatterns(patterns), `[${pkg.name}] BootLoader: constructor must have argument`);
    assert(isPlainObject(opts), `[${pkg.name}] BootLoader: wrong opts`);
    assert(isPatterns(opts.settings), `[${pkg.name}] BootLoader: wrong opts.settings`);
    assert(isString(opts.dir), `[${pkg.name}] BootLoader: wrong opts.dir`);
    assert(isBoolean(opts.reverse), `[${pkg.name}] BootLoader: wrong opts.reverse`);
    assert(isBoolean(opts.plugin) || isPatterns(opts.plugin), `[${pkg.name}] BootLoader: wrong opts.plugin`);

    const profiles = loadProfiles(opts.settings, { cwd: opts.dir, plugin: isPatterns(opts.plugin) ? opts.plugin : undefined });
    this[PROPERTY_MODULE_LOADER] = new ModuleLoader(patterns, profiles, { reverse: opts.reverse });
    if (opts.plugin)
      this[PROPERTY_PLUGIN_MODULE_LOADER] = new PluginModuleLoader(patterns, profiles);
  }

  *[Symbol.iterator]() {

    const moduleLoader = this[PROPERTY_MODULE_LOADER];
    yield* moduleLoader.load();

    const pluginModuleLoader = this[PROPERTY_PLUGIN_MODULE_LOADER];
    if (pluginModuleLoader)
      yield* pluginModuleLoader.load();
  }
}

exports.BootLoader = BootLoader;

function loadProfiles(patterns, opts, childOpts, completed = {}) {

  assert(!!(opts.package || opts.cwd), `[${pkg.name}] BootLoader: wrong profile opts`);

  const cwd = opts.cwd || resolveModule(opts.package, childOpts);
  assert(!completed[cwd], `[${pkg.name}] BootLoader: repeat load profile ${cwd}`);
  completed[cwd] = true;

  const profiles = loadMatchedModules(patterns, { cwd });
  const profileOpts = {};
  let count = 0;
  for (let profile of profiles) {
    Object.assign(profileOpts, profile);
    count++;
  }
  if (count <= 0)
    return [{ ...opts, cwd, patterns }];

  const _patterns = profileOpts.patterns || patterns;
  if (!profileOpts.package && !profileOpts.cwd)
    return [{ ...opts, cwd, patterns: _patterns }];

  const parents = loadProfiles(_patterns, profileOpts, { cwd }, completed);
  const plugin = opts.plugin || parents[0].plugin;
  return [...parents, { ...opts, cwd, plugin, patterns: _patterns }];

}
