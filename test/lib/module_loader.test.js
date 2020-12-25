/**
 * @fileOverview 模块加载测试
 * @name module_loader.test.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const path = require('path');
const ModuleLoader = require('@/lib/module_loader');

const APP_PATH = path.join(__dirname, '..', 'fixtures', 'apps', 'moduleTest');
const PLUGIN_PATH = path.join(__dirname, '..', 'fixtures', 'plugins', 'moduleTest');
const APP_MODULE_ENTRY = require('../fixtures/apps/moduleTest/module_load_entry');
const PLUGIN_MODULE_ENTRY = require('../fixtures/plugins/moduleTest/module_load_entry');

describe('lib/module_loader', () => {

  it('load entry', () => {

    const patterns = 'module_load_entry.js';
    const modulesOpts = [{ cwd: APP_PATH }, { cwd: PLUGIN_PATH }];
    const loader = new ModuleLoader(patterns, modulesOpts);
    const modules = [];
    for (const m of loader) {
      modules.push(m);
    }

    expect(modules.length).toBe(2);
    expect(modules[0].content).toEqual(APP_MODULE_ENTRY);
    expect(modules[1].content).toEqual(PLUGIN_MODULE_ENTRY);

  });

  it('load entry reverse', () => {

    const patterns = 'module_load_entry.js';
    const modulesOpts = [{ cwd: APP_PATH }, { cwd: PLUGIN_PATH }];
    const loader = new ModuleLoader(patterns, modulesOpts, { reverse: true });
    const modules = [];
    for (const m of loader) {
      modules.push(m);
    }

    expect(modules.length).toBe(2);
    expect(modules[0].content).toEqual(PLUGIN_MODULE_ENTRY);
    expect(modules[1].content).toEqual(APP_MODULE_ENTRY);

  });

  it('load entry with mode matched', () => {

    const patterns = 'module_load_entry.js';
    const modulesOpts = [{ cwd: APP_PATH }, { cwd: PLUGIN_PATH }];
    const loader = new ModuleLoader(patterns, modulesOpts, { mode: 'some' });
    const modules = [];
    for (const m of loader) {
      modules.push(m);
    }

    expect(modules.length).toBe(2);
    expect(modules[0].content).toEqual(APP_MODULE_ENTRY);
    expect(modules[1].content).toEqual(PLUGIN_MODULE_ENTRY);

  });

  it('load entry with mode none matched', () => {

    const patterns = 'module_load_entry.js';
    const modulesOpts = [{ cwd: APP_PATH, modes: [] }, { cwd: PLUGIN_PATH, modes: [] }];
    const loader = new ModuleLoader(patterns, modulesOpts, { mode: 'unmatched' });
    const modules = [];
    for (const m of loader) {
      modules.push(m);
    }

    expect(modules.length).toBe(0);

  });

  it('load entry with mode some matched', () => {

    const patterns = 'module_load_entry.js';
    const modulesOpts = [{ cwd: APP_PATH, modes: [ 'matched' ] }, { cwd: PLUGIN_PATH, modes: [ 'unmatched' ] }];
    const loader = new ModuleLoader(patterns, modulesOpts, { mode: 'matched' });
    const modules = [];
    for (const m of loader) {
      modules.push(m);
    }

    expect(modules.length).toBe(1);
    expect(modules[0].content).toEqual(APP_MODULE_ENTRY);

  });

});
