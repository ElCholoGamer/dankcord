const webpack = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const pkg = require('../package.json');
const path = require('path');

// Dev proxy settings
const { proxy = '/' } = pkg;
const secure = proxy.startsWith('https');

const config = merge(common, {
	mode: 'development',
	devtool: 'eval-source-map',
	devServer: {
		contentBase: path.resolve(__dirname, '../build'),
		port: 3000,
		hot: true,
		historyApiFallback: true,
		overlay: true,
		stats: 'minimal',
		open: true,
		proxy: {
			'/': {
				target: proxy,
				secure,
				bypass: req =>
					req.method === 'GET' &&
					req.headers.accept?.indexOf('text/html') !== -1
						? '/index.html' // Skip proxy
						: null, // Continue with proxy
			},
		},
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('development'),
		}),
	],
});

module.exports = config;
