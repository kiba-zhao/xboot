/**
 * @fileOverview 工具
 * @name utils.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const path = require('path');

const pkg = require('../package.json');
exports.pkg = pkg;

const { isObject } = require('lodash');

exports.isObject = isObject;

const globby = require('globby');

function* load(opts) {

}

exports.load = load;

const CWD_NAME = '.';
const CWD_PATHS = path.relative(__dirname, process.cwd()).split(path.sep);
function loadPackageJson(name) {
  if (name === CWD_NAME) {
    const targetPath = [...CWD_PATHS, 'package.json'].join('/');
    return require(targetPath);
  }
  return require(`${name}/package.json`);
}
