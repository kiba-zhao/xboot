export = Loader;
declare class Loader {
    filter(fn: any): Generator<any, void, unknown>;
    forEach(fn: any): void;
}
