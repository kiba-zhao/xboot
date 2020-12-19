export = ModuleLoader;
declare class ModuleLoader extends Loader {
    constructor(patterns: any, modulesOpts: any, opts: any);
    [Symbol.iterator](): Generator<any, void, unknown>;
    [PROPERTY_PATTERNS]: any;
    [PROPERTY_MODULES_OPTS]: any[];
}
import Loader = require("./loader");
declare const PROPERTY_PATTERNS: unique symbol;
declare const PROPERTY_MODULES_OPTS: unique symbol;
