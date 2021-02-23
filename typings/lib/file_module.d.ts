export = FileModule;
/**
 * 文件模块类
 * @class
 */
declare class FileModule {
    constructor(filepath: any, opts: any);
    /**
     * 路径属性
     * @return {string}
     */
    get path(): string;
    /**
     * 执行目录
     * @return {string}
     */
    get cwd(): string;
    /**
     * 完整文件路径
     * @return {string}
     */
    get filePath(): string;
    /**
     * plugin.js中定义的插件key
     * @return {String}
     */
    get plugin(): string;
    /**
     * 文件模块
     * @return {any}
     */
    get module(): any;
    [PATH]: any;
    [OPTIONS]: any;
    [MODULE]: any;
}
declare const PATH: unique symbol;
declare const OPTIONS: unique symbol;
declare const MODULE: unique symbol;
