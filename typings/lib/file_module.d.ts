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
     * 是否为插件
     * @return {boolean}
     */
    get plugin(): boolean;
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
