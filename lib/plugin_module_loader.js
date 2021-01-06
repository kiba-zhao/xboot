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

/**
 * 插件模块加载器
 * @class
 */
class PluginModuleLoader extends Loader {

  /**
   * 模块可选项
   * @typedef {Object} ModuleOpts
   * @property {String} cwd 模块加载执行目录
   * @property {Array<String> | String} plugin 插件匹配模式
   * @property {Array<String> | String} pluginConfig 插件配置匹配模式
   */

  /**
   * 模块加载器可选项
   * @typedef {Object} PluginModuleLoaderOpts
   * @property {Array<String> | String} mode 匹配模式
   */

  /**
   * 构造方法
   * @param {Array<String> | String} patterns 插件模块匹配模式
   * @param {Array<ModuleOpts>} modulesOpts 模块可选项
   * @param {PluginModuleLoaderOpts} opts 插件模块加载器可选项
   */
  constructor(patterns, modulesOpts, opts = {}) {

    assert(isPatterns(patterns), `[${pkg.name}] PluginModuleLoader: constructor must have argument`);
    assert(isArray(modulesOpts) && modulesOpts.length > 0 && modulesOpts.every(_ => isPlainObject(_) && isString(_.cwd)), `[${pkg.name}] PluginModuleLoader: wrong modulesOpts`);
    assert(isPlainObject(opts), `[${pkg.name}] PluginModuleLoader: wrong opts`);
    assert(opts.mode === undefined || isString(opts.mode), `[${pkg.name}] PluginModuleLoader: wrong opts.mode`);

    super();

    const completed = {};
    const plugins = loadPlugins(modulesOpts, completed);
    if (plugins.length > 0) {
      const orderedPlugins = sortPlugins(plugins, completed);
      this[PROPERTY_MODULE_LOADER] = new ModuleLoader(patterns, orderedPlugins, { reverse: false, mode: opts.mode });
    } else {
      this[PROPERTY_MODULE_LOADER] = plugins;
    }
  }

  /**
   * 类实例迭代器方法
   * @yields {any} 加载模块项
   */
  * [Symbol.iterator]() {
    const loader = this[PROPERTY_MODULE_LOADER];
    yield* loader;
  }
}

module.exports = PluginModuleLoader;

/**
 * 插件配置
 * @typedef {Object} PluginConfig
 * @property {ModuleOpts} opts 模块加载可选项
 * @property {String} config 插件配置文件匹配模式
 * @property {String} package 插件包名/包路径
 */

/**
 * 插件设置
 * @typedef {Object} PluginSettings
 * @property {ModuleOpts} opts 模块加载可选项
 * @property {String} config 插件配置文件匹配模式
 * @property {String} package 插件包名/插件包路径
 * @property {String} cwd 插件包目录
 * @property {String} name 插件包名称
 * @property {Array<String>} modes 插件模式
 * @property {Array<String>} dependencies 依赖项
 * @property {Array<String>} optionalDependencies 可选依赖项
 */

/**
 * 加载插件设置文件
 * @param {Array<ModuleOpts>} modulesOpts 模块可选项
 * @return {Object.<string, PluginSettings>} 插件设置内容
 */
function loadPluginsProfile(modulesOpts) {

  const profile = {};
  for (const opts of modulesOpts) {
    if (!isPatterns(opts.plugin)) { continue; }
    const modules = loadMatchedModules(opts.plugin, opts);
    for (const m of modules) {
      if (!m || !isPlainObject(m.content)) { continue; }
      for (const key in m.content) { profile[key] = { ...m.content[key], opts }; }
    }
  }
  return profile;
}

/**
 * 加载插件
 * @param {Array<ModuleOpts>} modulesOpts 模块可选项
 * @param {Object.<string, Boolean>} completed 完成记录字典
 * @return {Array<PluginConfig>} 插件列表数组
 */
function loadPlugins(modulesOpts, completed) {
  const profile = loadPluginsProfile(modulesOpts);
  const plugins = [];

  for (const key in profile) {
    const item = profile[key];
    const cwd = resolveModule(item.package, item.opts);
    const pkg = readPkg.sync({ cwd });
    const plugin = { ...item, cwd, name: pkg.name };
    const pattern = item.config || item.opts.pluginConfig;
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

/**
 * 排序插件
 * @param {Array<PluginConfig>} plugins 未排序的插件数组
 * @param {Object.<string, Boolean>} completed 完成状态插件字典
 * @return {Array<PluginConfig>} 排序后插件
 */
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

/**
 * 检查插件依赖
 * @param {PluginConfig} plugin 插件设置
 * @param {Object.<string, Boolean>} completed 插件完成字典
 * @return {Boolean} 依赖项是否已排序完成
 */
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

/**
 * 检查插件可选依赖项
 * @param {PluginConfig} plugin 插件设置
 * @param {Object.<string, Boolean>} completed 插件完成字典
 * @return {Boolean} 可选依赖项是否已排序完成
 */
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
