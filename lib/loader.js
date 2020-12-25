/**
 * @fileOverview 加载器类
 * @name loader.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const assert = require('assert');
const { pkg, isFunction } = require('./utils');

class Loader {

  * filter(fn) {

    assert(isFunction(fn), `[${pkg.name}] Loader: wrong filter function`);

    for (const item of this) {
      const isMatched = fn(item);
      if (isMatched) {
        yield item;
      }
    }
  }

  forEach(fn) {
    assert(isFunction(fn), `[${pkg.name}] Loader: wrong forEach function`);
    let index = 0;
    for (const item of this) {
      fn(item, index++, this);
    }
  }
}

module.exports = Loader;
