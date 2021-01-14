const webpack = require('webpack');
const { merge } = require('webpack-merge');
const { resolve } = require('path');
const common = require('./webpack.common');
const pkg = require('../package.json');

// Dev proxy settings
const { proxy } = pkg;
const secure = proxy.startsWith('https');
const host = proxy.replace(/^https?:\/\//, '').replace(/\/$/, '');

const config = merge(common, {
	mode: 'development',
	devtool: 'eval-source-map',
	devServer: {
		contentBase: resolve(__dirname, '../build'),
		publicPath: '/',
		port: 3000,
		historyApiFallback: true,
		overlay: true,
		stats: 'minimal',
		open: process.env.NO_OPEN?.toLowerCase() !== 'true',
		inline: true,
		proxy: proxy
			? {
					'/': {
						target: proxy,
						secure,
						bypass: req =>
							req.method === 'GET' &&
							req.headers.accept?.indexOf('text/html') !== -1
								? '/index.html' // Skip proxy
								: null, // Continue with proxy
					},
					'/gateway': {
						target: `${secure ? 'wss' : 'ws'}://${host}/gateway`,
						ws: true,
					},
			  }
			: {},
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('development'),
		}),
	],
});

module.exports = config;
