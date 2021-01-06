export = BootLoader;
/**
 * 引导加载器
 * @class
 */
declare class BootLoader extends Loader {
    /**
     * 模块可选项
     * @typedef {Object} BootLoaderOpts
     * @property {Array<String> | String} config 配置文件匹配模式
     * @property {String} chdir 引导运行目录
     * @property {Boolean} reverse 是否逆序加载
     * @property {Array<String> | String} plugin 插件设置文件匹配模式
     * @property {String} mode 引导过滤模式
     */
    /**
     * 构造方法
     * @param {Array<String> | String} patterns 引导文件匹配模式
     * @param {BootLoaderOpts} opts 引导加载器可选项
     */
    constructor(patterns: Array<string> | string, opts?: {
        /**
         * 配置文件匹配模式
         */
        config: Array<string> | string;
        /**
         * 引导运行目录
         */
        chdir: string;
        /**
         * 是否逆序加载
         */
        reverse: boolean;
        /**
         * 插件设置文件匹配模式
         */
        plugin: Array<string> | string;
        /**
         * 引导过滤模式
         */
        mode: string;
    });
    /**
     * 类实例迭代器方法
     * @yields {any} 加载模块项
     */
    [Symbol.iterator](): Generator<any, void, undefined>;
}
declare namespace BootLoader {
    export { ProfileOpts, ChildProfileOpts, Profile };
}
import Loader = require("./loader");
/**
 * 引导配置文件可选项
 */
type ProfileOpts = {
    /**
     * 引导包名或包目录路径
     */
    engine: string;
    /**
     * 插件设置文件匹配模式
     */
    plugin: Array<string> | string;
    /**
     * 引导模式
     */
    modes: Array<string>;
};
/**
 * 子引导配置文件可选项
 */
type ChildProfileOpts = {
    /**
     * 子引导包目录
     */
    cwd: string;
};
/**
 * 引导配置
 */
type Profile = {
    /**
     * 引导包名或包目录路径
     */
    engine: string;
    /**
     * 包目录路径
     */
    cwd: string;
    /**
     * 插件设置文件匹配模式
     */
    plugin: Array<string> | string;
    /**
     * 引导模式
     */
    modes: Array<string>;
    /**
     * 当前配置匹配模式
     */
    patterns: Array<string> | string;
};
