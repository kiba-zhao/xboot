/**
 * @fileOverview 插件模块加载类
 * @name plugin_module_loader.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';
const assert = require('assert');
const Loader = require('./loader');
const ModuleLoader = require('./module_loader');
const { pkg, loadMatchedModules, resolveModule, readPkg, isArray, isString, isPlainObject, isPatterns } = require('./utils');

const PROPERTY_MODULE_LOADER = Symbol('MODULE_LOADER');

class PluginModuleLoader extends Loader {
  constructor(patterns, modulesOpts, opts = {}) {

    assert(isPatterns(patterns), `[${pkg.name}] PluginModuleLoader: constructor must have argument`);
    assert(isArray(modulesOpts) && modulesOpts.length > 0 && modulesOpts.every(_ => isPlainObject(_) && isString(_.cwd)), `[${pkg.name}] PluginModuleLoader: wrong modulesOpts`);
    assert(isPlainObject(opts), `[${pkg.name}] PluginModuleLoader: wrong opts`);
    assert(opts.mode === undefined || isString(opts.mode), `[${pkg.name}] PluginModuleLoader: wrong opts.mode`);

    super();

    const completed = {};
    const plugins = loadPlugins(modulesOpts, completed);
    const orderedPlugins = sortPlugins(plugins, completed);
    this[PROPERTY_MODULE_LOADER] = new ModuleLoader(patterns, orderedPlugins, { reverse: false, mode: opts.mode });
  }

  * [Symbol.iterator]() {
    const loader = this[PROPERTY_MODULE_LOADER];
    yield* loader;
  }
}

module.exports = PluginModuleLoader;

function loadPluginsProfile(modulesOpts) {

  const profile = {};
  for (const opts of modulesOpts) {
    const modules = loadMatchedModules(opts.plugin, opts);
    for (const m of modules) {
      if (!m || !isPlainObject(m.content)) { continue; }
      for (const key in m.content) { profile[key] = { ...m.content[key], opts }; }
    }
  }
  return profile;
}

function loadPlugins(modulesOpts, completed) {
  const profile = loadPluginsProfile(modulesOpts);
  const plugins = [];

  for (const key in profile) {
    const item = profile[key];
    const cwd = resolveModule(item.package, item.opts);
    const pkg = readPkg.sync({ cwd });
    const plugin = { ...item, cwd, name: pkg.name };
    const pattern = item.settings || item.opts.pluginSettings;
    if (pattern) {
      const modules = loadMatchedModules(pattern, { cwd });
      for (const m of modules) {
        const content = m.content;
        if (content.modes && !item.modes) { plugin.modes = content.modes; }
        if (content.dependencies) { plugin.dependencies = content.dependencies; }
        if (content.optionalDependencies) { plugin.optionalDependencies = content.optionalDependencies; }
      }
    }

    plugins.push(plugin);
    completed[plugin.name] = false;
  }

  return plugins;
}

function sortPlugins(plugins, completed) {
  const res = [];
  const pendings = [];
  let count = 0;
  for (const plugin of plugins) {
    if (!checkPluginDependencies(plugin, completed) || !checkPluginOptionalDependencies(plugin, completed)) {
      pendings.push(plugin);
      continue;
    }
    res.push(plugin);
    completed[plugin.name] = true;
    count++;
  }

  assert(count > 0 || pendings.length <= 0, `[${pkg.name}] PluginLoader: plugins ${pendings.map(_ => _.name).join(',')} always pending`);

  if (pendings.length <= 0) { return res; }
  return res.concat(sortPlugins(pendings, completed));
}

function checkPluginDependencies(plugin, completed) {
  if (!plugin.dependencies || plugin.dependencies.length <= 0) { return true; }

  let res = true;
  for (const dep of plugin.dependencies) {
    if (completed[dep] === false) {
      res = false;
      break;
    }
    assert(completed[dep], `[${pkg.name}] PluginLoader: Undefined Plugin Dependency ${plugin.name} > ${dep}`);
  }

  return res;
}

function checkPluginOptionalDependencies(plugin, completed) {
  if (!plugin.optionalDependencies || plugin.optionalDependencies.length <= 0) { return true; }

  let res = true;
  for (const optDep of plugin.optionalDependencies) {
    if (completed[optDep] === false) {
      res = false;
      break;
    }
  }

  return res;
}

