import { preg_quote } from "./preg_quote";
import * as os from 'os';
class Helper {
    /**
     * Determine if a given string matches a given pattern.
     *
     * @param pattern
     * @param value
     * @return boolean
     */
    str_is(pattern: string, value: string) {
        if (pattern == value) return true;

        pattern = preg_quote(pattern, '/');

        // Asterisks are translated into zero-or-more regular expression wildcards
        // to make it convenient to check if the strings starts with the given
        // pattern such as "library/*", making any string check convenient.
        pattern = pattern.replace('/\*/g', '.*') + '\\z';
        const reg = new RegExp('^' + pattern);

        return reg.test(value);
    }
    /**
     * Transform given input to object if it is not an object.
     *
     * @param {*} element
     * @return {object}
     */
    parseObject(element: any): Object {
        element = element instanceof Object ? element : { 0: element };
        return element;
    }
    /**
     * Checks whether given value is null or undefined.
     *
     * @returns {boolean}
     */
    isset(...args: any[]): boolean {
        //  discuss at: http://phpjs.org/functions/isset/
        // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // improved by: FremyCompany
        // improved by: Onno Marsman
        // improved by: Rafał Kukawski
        //   example 1: isset( undefined, true);
        //   returns 1: false
        //   example 2: isset( 'Kevin van Zonneveld' );
        //   returns 2: true

        var a = args,
            l = a.length,
            i = 0,
            undef;

        if (l === 0) {
            throw new Error('Empty isset');
        }

        while (i !== l) {
            if (a[i] === undef || a[i] === null) {
                return false;
            }
            i++;
        }
        return true;
    }
    /**
     * Checks whether given value is equal to null.
     *
     * @param variable
     * @returns {boolean}
     */
    is_null(variable: any): boolean {
        return (variable === null);
    }

    /**
     * Return current Unix timestamp with microseconds.
     *
     * @param get_as_float
     * @returns {number}
     */
    microtime(get_as_float) {
        //  discuss at: http://phpjs.org/functions/microtime/
        //  original by: Paulo Freitas
        //  example 1: timeStamp = microtime(true);
        //  example 1: timeStamp > 1000000000 && timeStamp < 2000000000
        //  returns 1: true

        const now: any = new Date().getTime() / 1000;
        const s: number = parseInt(now, 10);

        return (get_as_float) ? now : (Math.round((now - s) * 1000) / 1000) + ' ' + s;
    }

    /**
     * Get an object key value where key specified in dot notation.
     *
     * @param obj
     * @param path
     * @returns {*}
     */
    objectGet(obj, path): any {
        var pathArray = path.split('.');
        for (var i = 0; i < pathArray.length; i++) {
            obj = obj[pathArray[i]];
            if (!this.isset(obj))
                break;
        }
        return obj;
    }
    /**
     * Set an object key value where key specified in dot notation.
     *
     * @param obj
     * @param path
     * @param value
     */
    objectSet(obj: any, path: any, value): any {
        if (typeof (path) == 'string') {
            path = path.split('.');
        }
        if (!this.isset(obj[path[0]])) {
            obj[path[0]] = {};
        }
        if (path.length > 1) {
            this.objectSet(obj[path.shift()], path, value);
        } else {
            obj[path[0]] = value;
        }
    }
    /**
     * Determine if the name matches the machine name.
     *
     * @param {string} name
     * @return boolean
     */
    isMachine(name: string): boolean {
        return this.str_is(name, os.hostname());
    }
}

export default new Helper();