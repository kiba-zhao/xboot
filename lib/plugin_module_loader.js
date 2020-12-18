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
const { pkg, loadMatchedModules, resolveModule, readPkg } = require('./utils');

const PROPERTY_MODULE_LOADER = Symbol('MODULE_LOADER');

class PluginModuleLoader extends Loader {
  constructor(patterns, modulesOpts) {

    super();

    const plugins = loadPlugins(modulesOpts);
    this[PROPERTY_MODULE_LOADER] = new ModuleLoader(patterns, plugins, { reverse: false });
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
    const modules = loadMatchedModules(opts.plugin, opts.cwd);
    for (const m of modules) {
      for (const key in m) { profile[key] = { ...m[key], opts }; }
    }
  }
  return profile;
}

function loadPlugins(modulesOpts) {
  const profile = loadPluginsProfile(modulesOpts);
  const plugins = [];
  const completed = {};

  for (const key in profile) {
    const item = profile[key];
    if (item.enabled === false || item.disabled === true) { continue; }
    const cwd = item.cwd || resolveModule(item.package, item.opts);
    const pkg = readPkg.sync({ cwd });
    const modules = loadMatchedModules(item.settings || item.opts.settings, { cwd });
    const plugin = { ...item, cwd, name: pkg.name, dependencies: [], optionalDependencies: [] };
    for (const m of modules) {
      plugin.dependencies = m.dependencies ? plugin.dependencies.contact(m.dependencies) : plugin.dependencies;
      plugin.optionalDependencies = m.optionalDependencies ? plugin.optionalDependencies.contact(m.optionalDependencies) : plugin.optionalDependencies;
    }
    plugins.push(plugins);
    completed[plugin.name] = false;
  }

  return sortPlugins(plugins, completed);
}

function sortPlugins(plugins, completed) {
  const res = [];
  const pendings = [];
  let count = 0;
  for (const plugin of plugins) {
    if (!checkPlugin(plugin, completed)) {
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

function checkPlugin(plugin, completed) {
  if (!plugin.dependencies || plugin.dependencies.length <= 0) { return true; }

  let res = true;
  for (const dep of plugin.dependencies) {
    if (completed[dep] === false) {
      res = false;
      break;
    }
    assert(completed[dep], `[${pkg.name}] PluginLoader: Undefined Plugin Dependency ${plugin.name} > ${dep}`);
  }

  if (!res || !plugin.optionalDependencies || plugin.optionalDependencies.length <= 0) { return res; }

  for (const optDep of plugin.optionalDependencies) {
    if (completed[optDep] === false) {
      res = false;
      break;
    }
  }

  return res;
}
