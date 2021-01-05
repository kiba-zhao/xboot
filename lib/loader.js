/**
 * @fileOverview 加载器类
 * @name loader.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const assert = require('assert');
const { pkg, isFunction } = require('./utils');

/**
 * 加载器基类
 * @class
 */
class Loader {

  /**
   * 过滤方法
   * @param {Function} fn 过滤函数
   * @yields {any} 匹配项
   */
  * filter(fn) {

    assert(isFunction(fn), `[${pkg.name}] Loader: wrong filter function`);
    for (const item of this) {
      const isMatched = fn(item);
      if (isMatched) {
        yield item;
      }
    }
  }

  /**
   * 遍历加载项方法
   * @param {Function} fn 加载项处理函数
   */
  forEach(fn) {

    assert(isFunction(fn), `[${pkg.name}] Loader: wrong forEach function`);
    let index = 0;
    for (const item of this) {
      fn(item, index++, this);
    }
  }
}

module.exports = Loader;
