#!/usr/bin/env node

/**
 * @fileOverview 命令行入口
 * @name xboot.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const { Boot } = require('..');
const pkg = require('../package.json');
const { program } = require('commander');
program.version(pkg.version);

program
  .option('-a, --all', 'load all match files',false)
  .option('-d, --dir <type>', 'target directory',process.cwd())
  .option('-r, --reverse', 'reverse load base files ',false)
  .option('-p, --plugin', 'load plugin files',false);

program.parse(process.argv);

let patterns = [];
if(program.args.length>0)
  patterns.push(...program.args);
else
  patterns.push(`${pkg.name}.js`);

const {all,...opts} = program.opts();
(new Boot(patterns,opts)).init(()=>all);
