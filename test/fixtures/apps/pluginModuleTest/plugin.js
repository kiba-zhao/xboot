/**
 * @fileOverview 插件配置
 * @name plugin.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

exports.package = {
  package: 'pluginModuleTest',
};


exports.A = {
  package: '../../plugins/pluginModuleTestA',
};

exports.C = {
  package: '../../plugins/pluginModuleTestC',
  config: 'setting.js',
};
