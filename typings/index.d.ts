import BootLoader = require("./lib/boot_loader");
import { setup } from "./lib/utils";
/**
 * 创建引导加载器
 * @static
 * @param {Array<String> | String} patterns 引导文件匹配模式
 * @param {Object} context 模块引导上下文缓存字典
 * @param {BootLoaderOpts} opts 引导加载器可选项
 * @return {BootLoader} 引导加载对象实例
 */
export function createBootLoader(patterns: Array<string> | string, context: any, opts?: any): BootLoader;
export { BootLoader, setup };
