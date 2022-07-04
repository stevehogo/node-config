/**
 * config value in second
 */
 exports.default = {
    stream_read_timeout: 1,
    listen_timeout: 0,
    read_limit: 100,
    read_sleep: 0.2,
    domain: process.env.APP_NAME || ''
};