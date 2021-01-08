# xboot #
nodejs下引导加载模块工具．用于根据在engine包(父级包)以及plugin包中加载匹配的模块文件．类似[eggjs](https://eggjs.org/zh-cn/)中的`FileLoader`

## Install ##

``` shell
npm install xboot
```

## Usage ##
xboot支持命令行，以及在代码中使用两种方式

xboot默认从执行目录下的`xboot.config.js`中，获取engine以及plugin的配置

``` javascript
// {cwd}/xboot.config.js
module.exports = {
    engine:'server-blocks',  //父engine包名称或包绝对路径
    plugin:'plugin.js'  //插件设置文件
//    pluginConfig:'plugin.config.js', //插件内配置文件(可选)
//  modes:['koa','grpc']    //匹配模式
};
```

xboot根据配置的plugin内容，来匹配的插件设置文件．根据插件设置文件，来选择加载模块文件时候，查找匹配的加载的插件包．

``` javascript
// {cwd}/plugin.js
exports.koa = {
    package:'xkoa',
    modes:['koa']  // 匹配模式
// dependencies:['xprovider'],   //　依赖插件
// optionalDependencies:['xprovider'],  //　可选依赖插件
//    config::'plugin.config.js', //插件内配置文件(可选)    
};
```

支持plugin包内通过配置文件定义插件依赖，以及匹配模式等属性

``` javascript
module.exports = {
    modes:['koa']  // 匹配模式
    dependencies:['xprovider'],   //　依赖插件
    optionalDependencies:['xprovider'],  //　可选依赖插件
};
```

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
n
## License ##
[MIT](LICENSE)
