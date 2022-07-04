import { FileLoader } from "./FileLoader";
import _ from './helper';
export class Config {
    private __loader: FileLoader;
    private __environment: string;
    private __items: Array<any>;
    /**
     * Create a new configuration instance.
     *
     * @param  {FileLoader} loader
     * @param  {string}  environment
     * @return void
     * @constructor
     */
    constructor(loader: FileLoader, environment: string) {
        /**
         * The loader implementation.
         *
         * @var {FileLoader}
         * @protected
         */
        this.__loader = loader;

        /**
         * The current environment.
         *
         * @var {string}
         * @protected
         */
        this.__environment = environment;

        /**
         * All of the configuration items.
         *
         * @var {Array}
         * @protected
         */
        this.__items = [];
    }
    /**
     * Determine if the given configuration value exists.
     *
     * @param {string}  key
     * @return boolean
     */
    has(key: string): boolean {
        let defaultVal = _.microtime(true);

        return this.get(key, defaultVal) !== defaultVal;
    }
    /**
     * Determine if a configuration group exists.
     *
     * @param  {string} key
     * @return boolean
     */
    hasGroup(key: string): boolean {
        let output = this.parseKey(key);

        return this.__loader.exists(output['group']);
    }
    /**
     * Converts a configuration key to group and item.
     *
     * @param {string} key
     * @returns {{group: *, item: *}}
     */
    parseKey(key: string): any {
        const segments = key.split('.');
        let item;
        if (segments.length == 1)
            item = null;
        else
            item = (segments.slice(1)).join('.');

        return {
            group: segments[0],
            item: item
        };
    }

    /**
     * Get the specified configuration value.
     *
     * @param  {string} key
     * @param  {*} defaultVal
     * @return {*}
     */
    get(key: string, defaultVal: any): any {
        if (!_.isset(defaultVal)) {
            defaultVal = null;
        }
        const output = this.parseKey(key);

        this.__load(output['group']);

        let item;
        return _.isset(output['item']) ? (_.isset(item = _.objectGet(this.__items[output['group']], output['item'])) ? item : defaultVal) : this.__items[output['group']];
    }
    /**
     * Load a configuration group.
     *
     * @param  {string}  group
     * @return {void}
     * @protected
     */
    __load(group: string) {
        const env = this.__environment;

        // If we've already loaded this group, we will just bail out since we do
        // not want to load it again. Once items are loaded a first time they will
        // stay kept in memory within this class and not loaded from disk again.
        if (_.isset(this.__items[group])) {
            return;
        }

        this.__items[group] = this.__loader.load(env, group);
    }
    /**
     * Get the loader implementation.
     *
     * @return {FileLoader}
     */
    getLoader(): FileLoader {
        return this.__loader;
    }
    /**
     * Set the loader implementation.
     *
     * @param  {FileLoader}  loader
     * @return {void}
     */
    setLoader(loader: FileLoader) {
        this.__loader = loader;
    }

    /**
     * Get or check the current configuration environment.
     *
     * @return string
     */
    environment(...args: any[]): any {
        if (args.length > 0) {
            return !!~Array.prototype.indexOf.call(args, this.__environment);
        }
        else {
            return this.__environment;
        }
    }

    /**
     * Get all of the configuration items.
     *
     * @return {object}
     */
    getItems(): any {
        return this.__items;
    }
}