#!/usr/bin/env node

/**
 * @fileOverview 命令行入口
 * @name xboot.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const { BootLoader } = require('..');
const { pkg } = require('../lib/utils');
const { program } = require('commander');
program.version(pkg.version);

program
  .option('-d, --dir <type>', 'target directory', process.cwd())
  .option('-p, --plugin', 'load plugin files', true)
  .option('-r, --reverse', 'reverse load base files ', false)
  .option('-s, --settings <type>', 'patterns of settings file');

program.parse(process.argv);

const patterns = [];
if (program.args.length > 0) {
  patterns.push(...program.args);
} else {
  patterns.push(`${pkg.name}.js`);
}

const loader = (new BootLoader(patterns, program.opts()));
loader.forEach(() => {});
