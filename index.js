/**
 * @fileOverview 目录文件
 * @name index.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

/**
 * @module xboot
 */


const BootLoader = require('./lib/boot_loader');
const { setup } = require('./lib/utils');

/**
 * @type {BootLoader}
 */
exports.BootLoader = BootLoader;

/**
 * @type {setup}
 */
exports.setup = setup;

/**
 * 创建引导加载器
 * @static
 * @param {Array<String> | String} patterns 引导文件匹配模式
 * @param {Object} context 模块引导上下文缓存字典
 * @param {BootLoaderOpts} opts 引导加载器可选项
 * @return {BootLoader} 引导加载对象实例
 */
function createBootLoader(patterns, context, opts = {}) {
  const loader = new BootLoader(patterns, { ...opts, context });
  return loader;
}

exports.createBootLoader = createBootLoader;
