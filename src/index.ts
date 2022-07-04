import * as path from 'path';
import { Config } from './Config';
import { FileLoader } from './FileLoader';
import detector from './EnvironmentDetector';
import _ from './helper';

class AppConfig {
    private _config: Config;
    private static instance: AppConfig;

    private constructor(configDirPath: string, environments: Object | Function | string) {
        environments = _.isset(environments) ? environments : {};
        configDirPath = _.isset(configDirPath) ? configDirPath : '';
        const env: string = process.env.APP_ENV = detector.detect(environments);

        this._config = new Config(new FileLoader(path.join(configDirPath, 'config')), env);

    }

    static getInstance(configDirPath: string, environments: Object | Function | string): AppConfig {
        if (!AppConfig.instance) {
            AppConfig.instance = new AppConfig(configDirPath, environments);
        }
        return AppConfig.instance;
    }
    getConfig(): Config {
        return this._config;
    }
}
export const config = (configDirPath: string, environments: Object | Function | string) => {
    const appConf: Config = AppConfig.getInstance(configDirPath, environments).getConfig();
    /**
     * Get the specified configuration value.
     *
     * @param  {string} key
     * @param  {*} defaultVal
     * @return {*}
     */
    return (key: string, defaultVal: Object | string | number | boolean = null): Object | string | number | boolean => {
        return appConf.get(key, defaultVal);
    }

}
export default config;