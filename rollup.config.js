import del from 'rollup-plugin-delete';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import strip from '@rollup/plugin-strip';
import typescript from '@rollup/plugin-typescript';

import path from 'path';
const extensions = [
	'.js',
    '.ts'
];

const stripFuncs = ['console.time', 'console.timeEnd', 'assert.*', 'debug', 'alert'];
const disable_log = parseInt(process.env.DISABLE_LOG || '1');

if (disable_log == 1) {	
	stripFuncs.push('console.log');
}
export default {
	input: './src/index.ts',
	output: {
		dir: path.resolve(__dirname, 'dist'),
		format: 'cjs',
		esModule: true,
		exports: "named",
	},
	plugins: [
		del({
			targets: 'dist/*'
		}),
		resolve({
			extensions
		}),
        typescript(),
		commonjs(),
		strip({
			// set this to `false` if you don't want to
			// remove debugger statements
			debugger: true,

			// defaults to `[ 'console.*', 'assert.*' ]`
			functions: stripFuncs,

			// remove one or more labeled blocks by name
			// defaults to `[]`
			labels: ['unittest'],

			// set this to `false` if you're not using sourcemaps –
			// defaults to `true`
			sourceMap: false
		})
	]
};