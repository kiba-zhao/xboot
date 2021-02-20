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
const { defaults, loadMatchedModules, resolveModule, pkg, isPatterns, isString, isBoolean, isPlainObject } = require('./utils');

const PROFILES_KEY = Symbol('PROFILES_KEY');
const PROPERTY_MODULE_LOADER = Symbol('MODULE_LOADER');
const PROPERTY_PLUGIN_MODULE_LOADER = Symbol('PLUGIN_MODULE_LOADER');
const DEFAULT_OPTS = {
  chdir: process.cwd(),
  config: `${pkg.name}.config.js`,
  reverse: false,
  plugin: true,
  mode: pkg.name,
  expand: true,
};

/**
 * 引导加载器
 * @class
 */
class BootLoader extends Loader {

  /**
   * 模块可选项
   * @typedef {Object} BootLoaderOpts
   * @property {Array<String> | String} config 配置文件匹配模式
   * @property {String} chdir 引导运行目录
   * @property {Boolean} reverse 是否逆序加载
   * @property {Boolean} expand 是否展开目录
   * @property {Array<String> | String} plugin 插件设置文件匹配模式
   * @property {String} mode 引导过滤模式
   * @property {String} context 上下文字典
   */

  /**
   * 构造方法
   * @param {Array<String> | String} patterns 引导文件匹配模式
   * @param {BootLoaderOpts} opts 引导加载器可选项
   */
  constructor(patterns, opts = {}) {

    assert(isPatterns(patterns), `[${pkg.name}] BootLoader: constructor must have argument`);
    assert(isPlainObject(opts), `[${pkg.name}] BootLoader: wrong opts`);

    const _opts = defaults(opts, DEFAULT_OPTS);
    assert(isPatterns(_opts.config), `[${pkg.name}] BootLoader: wrong opts.config`);
    assert(isString(_opts.chdir), `[${pkg.name}] BootLoader: wrong opts.chdir`);
    assert(isBoolean(_opts.reverse), `[${pkg.name}] BootLoader: wrong opts.reverse`);
    assert(isBoolean(_opts.expand), `[${pkg.name}] BootLoader: wrong opts.expand`);
    assert(isBoolean(_opts.plugin) || isPatterns(_opts.plugin), `[${pkg.name}] BootLoader: wrong opts.plugin`);
    assert(_opts.mode === undefined || isString(_opts.mode), `[${pkg.name}] BootLoader: wrong opts.mode`);
    assert(_opts.context === undefined || isPlainObject(_opts.context), `[${pkg.name}] BootLoader: wrong opts.context`);

    super();

    const context = _opts.context;
    let profiles;
    if (context && context[PROFILES_KEY]) {
      profiles = context[PROFILES_KEY];
    } else {
      profiles = loadProfiles(_opts.config, { engine: _opts.chdir, plugin: isPatterns(_opts.plugin) ? _opts.plugin : undefined });
    }

    if (context && !context[PROFILES_KEY]) {
      context[PROFILES_KEY] = profiles;
    }

    this[PROPERTY_MODULE_LOADER] = new ModuleLoader(patterns, profiles, { mode: _opts.mode, expand: opts.expand, reverse: _opts.reverse });
    if (_opts.plugin) { this[PROPERTY_PLUGIN_MODULE_LOADER] = new PluginModuleLoader(patterns, profiles, { mode: _opts.mode, expand: opts.expand, context }); }
  }

  /**
   * 类实例迭代器方法
   * @yields {any} 加载模块项
   */
  * [Symbol.iterator]() {

    const moduleLoader = this[PROPERTY_MODULE_LOADER];
    yield* moduleLoader;

    const pluginModuleLoader = this[PROPERTY_PLUGIN_MODULE_LOADER];
    if (pluginModuleLoader) { yield* pluginModuleLoader; }
  }

}

module.exports = BootLoader;

/**
 * 引导配置文件可选项
 * @typedef {Object} ProfileOpts
 * @property {String} engine 引导包名或包目录路径
 * @property {Array<String> | String} plugin 插件设置文件匹配模式
 * @property {Array<String>} modes 引导模式
 */

/**
 * 子引导配置文件可选项
 * @typedef {Object} ChildProfileOpts
 * @property {String} cwd 子引导包目录
 */

/**
 * 引导配置
 * @typedef {Object} Profile
 * @property {String} engine 引导包名或包目录路径
 * @property {String} cwd 包目录路径
 * @property {Array<String> | String} plugin 插件设置文件匹配模式
 * @property {Array<String>} modes 引导模式
 * @property {Array<String> | String} patterns 当前配置匹配模式
 */

/**
 * 加载引导配置文件
 * @param {Array<String> | String} patterns 引导配置文件匹配模式
 * @param {ProfileOpts} opts 引导配置文件可选项
 * @param {ChildProfileOpts} childOpts 子引导配置文件可选项
 * @param {Object.<string,Boolean>} completed 引导配置文件加载完成字典
 * @return {Array<Profile>} 引导配置数组
 */
function loadProfiles(patterns, opts, childOpts, completed = {}) {

  assert(opts.engine, `[${pkg.name}] BootLoader: wrong profile opts`);

  const cwd = resolveModule(opts.engine, childOpts);
  assert(isString(cwd), `[${pkg.name}] BootLoader:  profile not found, engine=${opts.engine}`);
  assert(!completed[cwd], `[${pkg.name}] BootLoader: repeat load profile ${cwd}`);
  completed[cwd] = true;

  const profiles = loadMatchedModules(patterns, null, { cwd });
  const profileOpts = {};
  let count = 0;
  for (const profile of profiles) {
    Object.assign(profileOpts, profile.module);
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
