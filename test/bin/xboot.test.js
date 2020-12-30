/**
 * @fileOverview xboot命令行测试代码
 * @name xboot.test.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const path = require('path');
const coffee = require('coffee');

const APP_PATH = path.join(__dirname, '..', 'fixtures', 'apps', 'bootTest');
const APP_ENGINE_PATH = path.join(__dirname, '..', 'fixtures', 'apps', 'bootEngineTest');
const XBOOT_PATH = require.resolve('../../bin/xboot.js');

describe('bin/xboot', () => {

  it('simple app', () => {

    return coffee.fork(XBOOT_PATH, [], { cwd: APP_PATH })
      .expect('stdout', 'xboot_test_entry\n')
      .expect('code', 0)
      .end();

  });

  it('engine app', () => {
    return coffee.fork(XBOOT_PATH, [ '-d', APP_ENGINE_PATH ], { cwd: APP_PATH })
      .expect('stdout', 'xboot_engine_test_entry\nxboot_plugin_a_entry\nxboot_plugin_b_entry\n')
      .expect('code', 0)
      .end();
  });

  it('engine app only engine xboot', () => {
    return coffee.fork(XBOOT_PATH, [ '--no-plugin' ], { cwd: APP_ENGINE_PATH })
      .expect('stderr', '')
      .expect('stdout', 'xboot_engine_test_entry\n')
      .expect('code', 0)
      .end();
  });

});
