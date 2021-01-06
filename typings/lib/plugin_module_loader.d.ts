export = PluginModuleLoader;
/**
 * 插件模块加载器
 * @class
 */
declare class PluginModuleLoader extends Loader {
    /**
     * 模块可选项
     * @typedef {Object} ModuleOpts
     * @property {String} cwd 模块加载执行目录
     * @property {Array<String> | String} plugin 插件匹配模式
     * @property {Array<String> | String} pluginConfig 插件配置匹配模式
     */
    /**
     * 模块加载器可选项
     * @typedef {Object} PluginModuleLoaderOpts
     * @property {Array<String> | String} mode 匹配模式
     */
    /**
     * 构造方法
     * @param {Array<String> | String} patterns 插件模块匹配模式
     * @param {Array<ModuleOpts>} modulesOpts 模块可选项
     * @param {PluginModuleLoaderOpts} opts 插件模块加载器可选项
     */
    constructor(patterns: Array<string> | string, modulesOpts: {
        /**
         * 模块加载执行目录
         */
        cwd: string;
        /**
         * 插件匹配模式
         */
        plugin: Array<string> | string;
        /**
         * 插件配置匹配模式
         */
        pluginConfig: Array<string> | string;
    }[], opts?: {
        /**
         * 匹配模式
         */
        mode: Array<string> | string;
    });
    /**
     * 类实例迭代器方法
     * @yields {any} 加载模块项
     */
    [Symbol.iterator](): Generator<any, void, undefined>;
}
declare namespace PluginModuleLoader {
    export { PluginConfig, PluginSettings };
}
import Loader = require("./loader");
/**
 * 插件配置
 */
type PluginConfig = {
    /**
     * 模块加载可选项
     */
    opts: {
        /**
         * 模块加载执行目录
         */
        cwd: string;
        /**
         * 插件匹配模式
         */
        plugin: Array<string> | string;
        /**
         * 插件配置匹配模式
         */
        pluginConfig: Array<string> | string;
    };
    /**
     * 插件配置文件匹配模式
     */
    config: string;
    /**
     * 插件包名/包路径
     */
    package: string;
};
/**
 * 插件设置
 */
type PluginSettings = {
    /**
     * 模块加载可选项
     */
    opts: {
        /**
         * 模块加载执行目录
         */
        cwd: string;
        /**
         * 插件匹配模式
         */
        plugin: Array<string> | string;
        /**
         * 插件配置匹配模式
         */
        pluginConfig: Array<string> | string;
    };
    /**
     * 插件配置文件匹配模式
     */
    config: string;
    /**
     * 插件包名/插件包路径
     */
    package: string;
    /**
     * 插件包目录
     */
    cwd: string;
    /**
     * 插件包名称
     */
    name: string;
    /**
     * 插件模式
     */
    modes: Array<string>;
    /**
     * 依赖项
     */
    dependencies: Array<string>;
    /**
     * 可选依赖项
     */
    optionalDependencies: Array<string>;
};
