export class BootLoader extends Loader {
    constructor(patterns: any, opts?: {});
    [Symbol.iterator](): Generator<any, void, any>;
    [PROPERTY_MODULE_LOADER]: ModuleLoader;
    [PROPERTY_PLUGIN_MODULE_LOADER]: PluginModuleLoader;
}
import Loader = require("./loader");
declare const PROPERTY_MODULE_LOADER: unique symbol;
import ModuleLoader = require("./module_loader");
declare const PROPERTY_PLUGIN_MODULE_LOADER: unique symbol;
import PluginModuleLoader = require("./plugin_module_loader");
export {};
