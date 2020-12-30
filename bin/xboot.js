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
  .option('-d, --chdir <type>', 'change directory')
  .option('--no-plugin', 'never load plugin files')
  .option('-r, --reverse', 'reverse load base files')
  .option('-s, --settings <type>', 'settings file name')
  .option('-m, --mode <type>', 'boot loader mode');

program.parse(process.argv);

const patterns = [];
if (program.args.length > 0) {
  patterns.push(...program.args);
} else {
  patterns.push(`${pkg.name}.js`);
}

const loader = (new BootLoader(patterns, program.opts()));
loader.forEach(() => {});
