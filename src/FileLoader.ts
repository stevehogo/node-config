import * as fs from 'fs';
import * as path from 'path';
import _ from './helper'
export class FileLoader {
    private __exists: any;
    private __defaultPath: string;
    /**
     * Create a new file configuration loader.
     *
     * @param  {string}  defaultPath
     * @return {void}
     * @constructor
     */
    constructor(defaultPath: string) {
        this.__defaultPath = defaultPath;
        this.__exists = [];
    }
    /**
     * Load the given configuration group.
     *
     * @param  {string}  environment
     * @param  {string}  group
     * @return {Array}
     */
    load(environment: string, group: string) {
        let items = [];

        // First we'll get the root configuration path for the environment which is
        // where all of the configuration files live for that namespace, as well
        // as any environment folders with their specific configuration items.
        const _path = this.__defaultPath;

        if (_.is_null(_path)) {
            return items;
        }

        // First we'll get the main configuration file for the groups. Once we have
        // that we can check for any environment specific files, which will get
        // merged on top of the main arrays to make the environments cascade.
        const allows=['.js', '.json'];
        let file;
        for(const ext in allows){
            file = path.join(_path, group + allows[ext]);
            if (fs.existsSync(file)) {
                items = require(file);
                break;
            }
        }
        // Finally we're ready to check for the environment specific configuration
        // file which will be merged on top of the main arrays so that they get
        // precedence over them if we are currently in an environments setup.
        for(const ext in allows){
            file = path.join(_path, environment, group + allows[ext]);
            if (fs.existsSync(file)) {
                items = this.__mergeEnvironment(items, file);
                break;
            }
        }
        return items;
    }
    /**
     * Merge the items in the given file into the items.
     *
     * @param  {Array}   items
     * @param  {string}  file
     * @return {Array}
     * @protected
     */
    __mergeEnvironment(items: Array<any>, file: string): any {
        // clone workaround: else when you require same config file again node will return the overwritten object.
        let new_items: any = require(file);
        if(_.isset(new_items['default'])){
            new_items = new_items['default'];
        }

        return [...items, ...new_items];
    }

    /**
     * Determine if the given group exists.
     *
     * @param  {string}  group
     * @return {boolean}
     */
    exists(group: string): boolean {
        // We'll first check to see if we have determined if this group
        // has been checked before. If it has, we will just return the
        // cached result so we don't have to hit the disk.
        if (_.isset(this.__exists[group])) {
            return this.__exists[group];
        }

        const file = path.join(this.__defaultPath, group + ".json");

        // We can simply check if this file exists. We will also cache
        // the value in an array so we don't have to go through this process
        // again on subsequent checks for this group.
        var exists = fs.existsSync(file);

        return this.__exists[group] = exists;
    }
}