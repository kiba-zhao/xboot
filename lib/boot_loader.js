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
const { loadMatchedModules, resolveModule, pkg, isPatterns, isString, isBoolean, isPlainObject } = require('./utils');

const PROPERTY_MODULE_LOADER = Symbol('MODULE_LOADER');
const PROPERTY_PLUGIN_MODULE_LOADER = Symbol('PLUGIN_MODULE_LOADER');
const DEFAULT_OPTS = {
  chdir: process.cwd(),
  settings: `${pkg.name}.settings.js`,
  reverse: false,
  plugin: true,
  mode: pkg.name,
};

class BootLoader extends Loader {
  constructor(patterns, opts = {}) {

    assert(isPatterns(patterns), `[${pkg.name}] BootLoader: constructor must have argument`);
    assert(isPlainObject(opts), `[${pkg.name}] BootLoader: wrong opts`);

    const _opts = { ...DEFAULT_OPTS, ...opts };
    assert(isPatterns(_opts.settings), `[${pkg.name}] BootLoader: wrong opts.settings`);
    assert(isString(_opts.chdir), `[${pkg.name}] BootLoader: wrong opts.chdir`);
    assert(isBoolean(_opts.reverse), `[${pkg.name}] BootLoader: wrong opts.reverse`);
    assert(isBoolean(_opts.plugin) || isPatterns(_opts.plugin), `[${pkg.name}] BootLoader: wrong opts.plugin`);
    assert(_opts.mode === undefined || isString(_opts.mode), `[${pkg.name}] BootLoader: wrong opts.mode`);

    super();

    const profiles = loadProfiles(_opts.settings, { engine: _opts.chdir, plugin: isPatterns(_opts.plugin) ? _opts.plugin : undefined });
    this[PROPERTY_MODULE_LOADER] = new ModuleLoader(patterns, profiles, { mode: _opts.mode, reverse: _opts.reverse });
    if (_opts.plugin) { this[PROPERTY_PLUGIN_MODULE_LOADER] = new PluginModuleLoader(patterns, profiles, { mode: _opts.mode }); }
  }

  * [Symbol.iterator]() {

    const moduleLoader = this[PROPERTY_MODULE_LOADER];
    yield* moduleLoader;

    const pluginModuleLoader = this[PROPERTY_PLUGIN_MODULE_LOADER];
    if (pluginModuleLoader) { yield* pluginModuleLoader; }
  }
}

module.exports = BootLoader;

function loadProfiles(patterns, opts, childOpts, completed = {}) {

  assert(opts.engine, `[${pkg.name}] BootLoader: wrong profile opts`);

  const cwd = resolveModule(opts.engine, childOpts);
  assert(isString(cwd), `[${pkg.name}] BootLoader:  profile not found, engine=${opts.engine}`);
  assert(!completed[cwd], `[${pkg.name}] BootLoader: repeat load profile ${cwd}`);
  completed[cwd] = true;

  const profiles = loadMatchedModules(patterns, { cwd });
  const profileOpts = {};
  let count = 0;
  for (const profile of profiles) {
    Object.assign(profileOpts, profile.content);
    count++;
  }
  if (count <= 0) { return [{ ...opts, cwd, patterns }]; }
  if (!profileOpts.engine) { return [{ ...opts, ...profileOpts, cwd, patterns }]; }

  const _patterns = profileOpts.patterns || patterns;
  const parents = loadProfiles(_patterns, profileOpts, { cwd }, completed);
  const plugin = opts.plugin || parents[0].plugin;
  const modes = opts.modes || parents[0].modes;
  return [ ...parents, { ...opts, cwd, plugin, modes, patterns: _patterns }];

}

