/**
 * @fileOverview 插件加载类
 * @name plugin_loader.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';
const ModuleLoader = require('./module_loader');
const { pkg, loadMatchedModules, resolveModule } = require('./utils');

const PROPERTY_MODULE_LOADER = Symbol('MODULE_LOADER');

class PluginModuleLoader {
  constructor(patterns, modulesOpts) {

    const plugins = loadPlugins(modulesOpts);
    this[PROPERTY_MODULE_LOADER] = new ModuleLoader(patterns, plugins, { reverse: false });

  }

  async load() {

    const loader = this[PROPERTY_MODULE_LOADER];
    const plugins = await loader.load();
    return plugins;

  }
}

module.exports = PluginModuleLoader;

function loadPluginsProfile(modulesOpts) {
  const profile = {};
  for (let opts of modulesOpts) {
    const modules = loadMatchedModules(opts.plugin, opts.cwd);
    for (let m of modules)
      for (let key in m)
        profile[key] = { ...m[key], opts };
  }
  return profile;
}

function loadPlugins(modulesOpts) {
  const profile = loadPluginsProfile(modulesOpts);
  const plugins = [];
  const completed = {};

  for (let key in profile) {
    const item = profile[key];
    if (item.enabled === false || item.disabled === true)
      continue;
    const cwd = item.cwd || resolveModule(item.package, item.opts);
    const pkg = readPkg.sync({ cwd });
    const modules = loadMatchedModules(item.opts.config, { cwd });
    const plugin = { ...item, cwd, name: pkg.name, dependencies: [], optionalDependencies: [] };
    for (let m of modules) {
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
  for (let plugin of plugins) {
    if (!checkPlugin(plugin, completed)) {
      pendings.push(plugin);
      continue;
    }
    res.push(plugin);
    completed[plugin.name] = true;
    count++;
  }

  if (count <= 0 && pendings.length > 0)
    throw new Error(`[${pkg.name}] PluginLoader: plugins ${pendings.map(_ => _.name).join(',')} always pending`);

  if (pendings.length <= 0)
    return res;
  return res.concat(sortPlugins(pendings, completed));
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
      throw new Error(`[${pkg.name}] PluginLoader: Undefined Plugin Dependency ${plugin.name} > ${dep}`);
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
