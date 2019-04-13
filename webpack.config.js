const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');


/**
 * @enum {string}
 */
const TARGETS = {
	MODERN: 'MODERN',
	LEGACY: 'LEGACY',
};


/**
 * @param {TARGETS} target
 */
function getBabelLoader(target) {
	
	const ES5_BROWSERS_TARGET = [
		'last 2 versions',
		'not <1%',
		'Firefox ESR',
		'ie 11',
		'iOS 10',
	];
	
	/*
	 const ESM_BROWSERS_TARGET = [
	 // The last two versions of each browser, excluding versions
	 // that don't support <script type="module">.
	 'last 2 Chrome versions', 'not Chrome < 60',
	 'last 2 Safari versions', 'not Safari < 10.1',
	 'last 2 iOS versions', 'not iOS < 10.3',
	 'last 2 Firefox versions', 'not Firefox < 54',
	 'last 2 Edge versions', 'not Edge < 15',
	 ];
	 */
	
	return {
		loader: `babel-loader`,
		options: {
			plugins: [],
			presets: [
				[
					'@babel/preset-env',
					{
						useBuiltIns: false,
						
						targets: {
							...target === TARGETS.LEGACY
								? {browsers: ES5_BROWSERS_TARGET}
								: {esmodules: true},
						},
					},
				],
			],
		},
	};
}


/**
 * @param {boolean} devMode
 * @param {TARGETS} target
 */
function buildConfig({target, devMode}) {
	return {
		mode: devMode ? 'development' : 'production',
		
		entry: {
			'boot': './src/boot.esm.js',
		},
		output: {
			filename: `[name].${target === TARGETS.LEGACY ? 'es5.js' : 'esm.js'}`,
			chunkFilename: `[name].${target === TARGETS.LEGACY ? 'es5.js' : 'esm.js'}`,
		},
		
		module: {
			rules: [
				{
					test: /\.js$/,
					use: [
						getBabelLoader(target),
					],
				},
				{
					test: /\.css$/,
					use: ['style-loader', 'css-loader'],
				},
			],
		},
		
		plugins: [
			new CopyWebpackPlugin([
				{from: `./node_modules/@babel/polyfill/dist/polyfill.min.js`},
				{from: `./src/index.html`},
				{from: `./src/style.css`},
				{from: `./src/favicon.ico`},
			]),
		],
		
		optimization: {
			minimizer: [
				new TerserPlugin({
					...devMode && {sourceMap: true} || {},
					test: /\.js$/i,
					//exclude: /exclude/,
					terserOptions: {
						compress: {
							dead_code: true,
							drop_console: !devMode,
						},
						mangle: {
							properties: false,
						},
						safari10: true,
					},
					parallel: true,
				}),
			],
		},
		
	};
}


function getConfig(env, argv) {
	const devMode = argv['development'];
	
	return [
		buildConfig({
			devMode,
			target: TARGETS.LEGACY,
		}),
		buildConfig({
			devMode,
			target: TARGETS.MODERN,
		}),
	];
}


module.exports = getConfig;
