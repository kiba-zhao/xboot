export = PluginModuleLoader;
declare class PluginModuleLoader extends Loader {
    constructor(patterns: any, modulesOpts: any, opts?: {});
    [Symbol.iterator](): Generator<any, void, undefined>;
    [PROPERTY_MODULE_LOADER]: any[] | ModuleLoader;
}
import Loader = require("./loader");
declare const PROPERTY_MODULE_LOADER: unique symbol;
import ModuleLoader = require("./module_loader");
