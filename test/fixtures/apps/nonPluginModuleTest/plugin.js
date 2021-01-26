/**
 * @fileOverview 插件配置
 * @name plugin.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

exports.B = {
  package: '../../plugins/pluginModuleTestB',
};

exports.C = {
  package: '../../plugins/pluginModuleTestC',
  dependencies: [ 'B' ],
  modes: [ 'test', 'dev' ],
};

exports.D = {
  package: '../../plugins/pluginModuleTestD',
  optionalDependencies: [ 'C' ],
  modes: [ 'dev' ],
};
