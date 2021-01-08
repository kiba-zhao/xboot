# xboot #
nodejs下引导加载模块工具．

## Install ##

``` shell
npm install xboot
```

## Usage ##
xboot支持命令行，以及在代码中使用两种方式

### 命令行 ###
使用`xboot`加载引导模块文件

``` shell
./node_modules/.bin/xboot
```

### javascript ###
在代码中使用`BootLoader`匹配加载模块

#### 简单加载模块 ####

``` javascript
const {BootLoader} = requre('xboot');

const patterns = 'module.js';
const opts = {};
const loader = new BootLoader(patterns, opts);
loader.forEach(() => {});
```

#### 自定义模块加载后续处理 ####

``` javascript
const {BootLoader} = requre('xboot');

const patterns = 'module.js';
const opts = {};
const loader = new BootLoader(patterns, opts);
for(module of loader){
    const {path,content,cwd} = module;
    // 功能逻辑处理
}
```

## Documentations ##
使用`jsdoc`生成注释文档

``` shell
git clone https://github.com/kiba-zhao/xboot.git
cd xboot
npm install
npm run docs
open docs/index.html
```

## License ##
[MIT](LICENSE)
