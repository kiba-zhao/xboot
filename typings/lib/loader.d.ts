export = Loader;
/**
 * 加载器基类
 * @class
 */
declare class Loader {
    /**
     * 过滤方法
     * @param {Function} fn 过滤函数
     * @yields {any} 匹配项
     */
    filter(fn: Function): Generator<any, void, unknown>;
    /**
     * 遍历加载项方法
     * @param {Function} fn 加载项处理函数
     */
    forEach(fn: Function): void;
}
