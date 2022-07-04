import _ from './helper'
class EnvironmentDetector {
    /**
     * Set the application environment for a web request.
     *
     * @param {Object|function} environments
     * @return string
     */
    detect(environments: any): string {
        // If the given environment is just a Closure, we will defer the environment check
        // to the Closure the developer has provided, which allows them to totally swap
        // the webs environment detection logic with their own custom Closure's code.
        if (typeof environments === 'function') {
            return environments()
        }
        let hosts;
        for (var environment in environments) {
            hosts = environments[environment];

            // To determine the current environment, we'll simply iterate through the possible
            // environments and look for the host that matches the host for this request we
            // are currently processing here, then return back these environment's names.
            hosts = _.parseObject(hosts);
            let k, host;
            for (k in hosts) {
                host = hosts[k];
                if (_.isMachine(host)) return environment;
            }
        }

        return 'production';
    }
}

export default new EnvironmentDetector();