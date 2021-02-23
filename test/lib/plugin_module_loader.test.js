/**
 * @fileOverview 插件模块加载测试
 * @name plugin_module_loader.test.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const path = require('path');
const PluginModuleLoader = require('@/lib/plugin_module_loader');

const APP_PATH = path.join(__dirname, '..', 'fixtures', 'apps', 'pluginModuleTest');
const NON_APP_PATH = path.join(__dirname, '..', 'fixtures', 'apps', 'nonPluginModuleTest');
const PLUGIN_MODULE_ENTRY = require('../fixtures/node_modules/pluginModuleTest/module_entry');
const PLUGIN_MODULE_ENTRY_A = require('../fixtures/plugins/pluginModuleTestA/module_entry');
const PLUGIN_MODULE_ENTRY_B = require('../fixtures/plugins/pluginModuleTestB/module_entry');
const PLUGIN_MODULE_ENTRY_C = require('../fixtures/plugins/pluginModuleTestC/module_entry');
const PLUGIN_MODULE_ENTRY_D = require('../fixtures/plugins/pluginModuleTestD/module_entry');

describe('lib/plugin_module_loader', () => {

  it('load entry', () => {
    const patterns = 'module_entry.js';
    const modulesOpts = [{ cwd: APP_PATH, plugin: 'plugin.js' }, { cwd: NON_APP_PATH, plugin: 'plugin.js' }];
    const loader = new PluginModuleLoader(patterns, modulesOpts);
    const modules = [];
    for (const m of loader) {
      modules.push(m);
    }
    expect(modules.length).toBe(5);
    expect(modules[0].module).toEqual(PLUGIN_MODULE_ENTRY);
    expect(modules[0].plugin).toEqual('package');
    expect(modules[1].module).toEqual(PLUGIN_MODULE_ENTRY_A);
    expect(modules[1].plugin).toEqual('A');
    expect(modules[2].module).toEqual(PLUGIN_MODULE_ENTRY_B);
    expect(modules[2].plugin).toEqual('B');
    expect(modules[3].module).toEqual(PLUGIN_MODULE_ENTRY_C);
    expect(modules[3].plugin).toEqual('C');
    expect(modules[4].module).toEqual(PLUGIN_MODULE_ENTRY_D);
    expect(modules[4].plugin).toEqual('D');

  });

  it('filter entry with mode', () => {
    const patterns = 'module_entry.js';
    const modulesOpts = [{ cwd: APP_PATH, plugin: 'plugin.js' }, { cwd: NON_APP_PATH, plugin: 'plugin.js' }];
    const loader = new PluginModuleLoader(patterns, modulesOpts, { mode: 'test' });
    const modules = [];
    for (const m of loader) {
      modules.push(m);
    }

    expect(modules.length).toBe(4);
    expect(modules[0].module).toEqual(PLUGIN_MODULE_ENTRY);
    expect(modules[1].module).toEqual(PLUGIN_MODULE_ENTRY_A);
    expect(modules[2].module).toEqual(PLUGIN_MODULE_ENTRY_B);
    expect(modules[3].module).toEqual(PLUGIN_MODULE_ENTRY_C);
  });

  it('load entry with context', () => {
    const patterns = 'module_entry.js';
    const modulesOpts = [{ cwd: APP_PATH, plugin: 'plugin.js' }, { cwd: NON_APP_PATH, plugin: 'plugin.js' }];
    const context = {};
    const loader = new PluginModuleLoader(patterns, modulesOpts, { context });
    const loaderWithContext = new PluginModuleLoader(patterns, [{ cwd: '' }], { context });
    const modules = [];
    for (const m of loader) {
      modules.push(m);
    }
    let count = 0;
    for (const mc of loaderWithContext) {
      expect(mc).toEqual(modules[count++]);
    }

    expect(modules.length).toBe(count);
    expect(modules.length).toBe(5);
    expect(modules[0].module).toEqual(PLUGIN_MODULE_ENTRY);
    expect(modules[1].module).toEqual(PLUGIN_MODULE_ENTRY_A);
    expect(modules[2].module).toEqual(PLUGIN_MODULE_ENTRY_B);
    expect(modules[3].module).toEqual(PLUGIN_MODULE_ENTRY_C);
    expect(modules[4].module).toEqual(PLUGIN_MODULE_ENTRY_D);

  });

  it('filter entry with mode', () => {
    const patterns = 'module_entry.js';
    const modulesOpts = [{ cwd: APP_PATH, plugin: 'plugin.js' }, { cwd: NON_APP_PATH, plugin: 'plugin.js' }];
    const context = {};
    const loader = new PluginModuleLoader(patterns, modulesOpts, { mode: 'test', context });
    const loaderWithContext = new PluginModuleLoader(patterns, [{ cwd: '' }], { mode: 'test', context });
    const modules = [];
    for (const m of loader) {
      modules.push(m);
    }
    let count = 0;
    for (const mc of loaderWithContext) {
      expect(mc).toEqual(modules[count++]);
    }

    expect(modules.length).toBe(count);
    expect(modules.length).toBe(4);
    expect(modules[0].module).toEqual(PLUGIN_MODULE_ENTRY);
    expect(modules[1].module).toEqual(PLUGIN_MODULE_ENTRY_A);
    expect(modules[2].module).toEqual(PLUGIN_MODULE_ENTRY_B);
    expect(modules[3].module).toEqual(PLUGIN_MODULE_ENTRY_C);
  });

});
