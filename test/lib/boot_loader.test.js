/**
 * @fileOverview 引导加载测试
 * @name boot_loader.test.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';
const path = require('path');
const BootLoader = require('@/lib/boot_loader');

const APP_PATH = path.join(__dirname, '..', 'fixtures', 'apps', 'bootTest');
const APP_ENGINE_PATH = path.join(__dirname, '..', 'fixtures', 'apps', 'bootEngineTest');
const BOOT_ENTRY = require('../fixtures/apps/bootTest/boot_entry');
const BOOT_PLUGIN_A_ENTRY = require('../fixtures/node_modules/bootPluginA/boot_entry');
const BOOT_PLUGIN_B_ENTRY = require('../fixtures/node_modules/bootPluginB/boot_entry');
const BOOT_ENGINE_ENTRY = require('../fixtures/node_modules/bootEngine/boot_entry');

describe('lib/boot_loader', () => {

  it('load entry', () => {
    const patterns = 'boot_entry.js';
    const opts = { config: 'xboot.config.js', chdir: APP_PATH };

    const loader = new BootLoader(patterns, opts);
    const modules = [];
    for (const m of loader) {
      modules.push(m);
    }

    expect(modules.length).toBe(1);
    expect(modules[0].content).toEqual(BOOT_ENTRY);
  });

  it('load engine entry and plugin entry', () => {
    const patterns = 'boot_entry.js';
    const opts = { config: 'xboot.config.js', chdir: APP_ENGINE_PATH };

    const loader = new BootLoader(patterns, opts);
    const modules = [];
    for (const m of loader) {
      modules.push(m);
    }

    expect(modules.length).toBe(3);
    expect(modules[0].content).toEqual(BOOT_ENGINE_ENTRY);
    expect(modules[1].content).toEqual(BOOT_PLUGIN_A_ENTRY);
    expect(modules[2].content).toEqual(BOOT_PLUGIN_B_ENTRY);

  });

  it('load engine entry', () => {
    const patterns = 'boot_entry.js';
    const opts = { config: 'xboot.config.js', chdir: APP_ENGINE_PATH, plugin: false };

    const loader = new BootLoader(patterns, opts);
    const modules = [];
    for (const m of loader) {
      modules.push(m);
    }

    expect(modules.length).toBe(1);
    expect(modules[0].content).toEqual(BOOT_ENGINE_ENTRY);

  });

});
