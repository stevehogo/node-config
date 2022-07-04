import setupConfig from '../src/index';
const config = setupConfig(
    __dirname, process.env.NODE_ENV || 'local'
);

console.log('config', __dirname, config('app.ver'));
console.log('config', __dirname, config('vars'));