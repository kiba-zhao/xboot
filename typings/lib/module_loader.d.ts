export = ModuleLoader;
/**
 * 模块加载器类
 * @class
 */
declare class ModuleLoader extends Loader {
    /**
     * 模块可选项
     * @typedef {Object} ModuleOpts
     * @property {String} cwd 模块加载执行目录
     */
    /**
     * 模块加载器可选项
     * @typedef {Object} ModuleLoaderOpts
     * @property {Boolean} reverse 是否逆序加载
     * @property {Array<String> | String} mode 匹配模式
     * @property {Boolean} expand 是否展开目录
     */
    /**
     * 构造方法
     * @param {Array<String> | String} patterns 模块匹配模式
     * @param {Array<ModuleOpts>} modulesOpts 模块可选项
     * @param {ModuleLoaderOpts} opts 模块加载器可选项
     */
    constructor(patterns: Array<string> | string, modulesOpts: {
        /**
         * 模块加载执行目录
         */
        cwd: string;
    }[], opts: {
        /**
         * 是否逆序加载
         */
        reverse: boolean;
        /**
         * 匹配模式
         */
        mode: Array<string> | string;
        /**
         * 是否展开目录
         */
        expand: boolean;
    });
    /**
     * 类实例迭代器方法
     * @yields {any} 加载模块项
     */
    [Symbol.iterator](): Generator<any, void, unknown>;
    [PROPERTY_PATTERNS]: string | string[];
    [PROPERTY_MODULES_OPTS]: {
        /**
         * 模块加载执行目录
         */
        cwd: string;
    }[];
    [PROPERTY_EXPAND]: boolean;
}
import Loader = require("./loader");
declare const PROPERTY_PATTERNS: unique symbol;
declare const PROPERTY_MODULES_OPTS: unique symbol;
declare const PROPERTY_EXPAND: unique symbol;
