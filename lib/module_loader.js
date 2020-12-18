/**
 * @fileOverview 模块加载类
 * @name module_loader.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const assert = require('assert');

const Loader = require('./loader');
const {
  loadMatchedModules, pkg,
  isArray, isString, isPlainObject, isBoolean
} = require('./utils');

const PROPERTY_OPTS = Symbol('OPTS');
const PROPERTY_PATTERNS = Symbol('PATTERNS');
const PROPERTY_MODULES_OPTS = Symbol('MODULES_OPTS');

class ModuleLoader extends Loader {
  constructor(patterns, modulesOpts, opts) {
    assert(isArray(patterns) ? patterns.length > 0 : isString(patterns), `[${pkg.name}] ModuleLoader: constructor must have argument`);
    assert(isArray(modulesOpts) && modulesOpts.length > 0 && modulesOpts.every(_ => isPlainObject(_) && isString(_.cwd)), `[${pkg.name}] ModuleLoader: wrong modulesOpts`);

    if (opts) {
      assert(isPlainObject(opts), `[${pkg.name}] ModuleLoader: wrong opts`);
      assert(opts.reverse === undefined || isBoolean(opts.reverse), `[${pkg.name}] Boot: wrong opts.reverse`);
    }

    this[PROPERTY_PATTERNS] = patterns;
    this[PROPERTY_MODULES_OPTS] = modulesOpts;
    this[PROPERTY_OPTS] = opts || {};
  }

  *[Symbol.iterator]() {
    const patterns = this[PROPERTY_PATTERNS];
    const modulesOpts = this[PROPERTY_MODULES_OPTS];
    const opts = this[PROPERTY_OPTS];

    yield* loadMatchedModules(patterns, ...(opts.reverse !== true ? modulesOpts.slice(0).reverse() : modulesOpts));
  }
}

module.exports = ModuleLoader;
