/**
 * @fileOverview Boot类
 * @name boot.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';
const assert = require('assert');
const { isObject, pkg, load } = require('utils');

const PROPERTY_OPTS = Symbol('opts');

class Boot {
  constructor(opts) {

    assert(isObject(opts), `${pkg.name}[Boot]: opts must be a Object`);

    this[PROPERTY_OPTS] = opts;
  }

  async init(run) {
    const opts = this[PROPERTY_OPTS];
    const files = load(opts);
    for (let file of files) {
      if (!run)
        continue;
      run(file);
    }
  }
}

exports.Boot = Boot;
