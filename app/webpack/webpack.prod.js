const webpack = require('webpack');
const { merge } = require('webpack-merge');
const { GenerateSW } = require('workbox-webpack-plugin');
const common = require('./webpack.common');

const config = merge(common, {
	mode: 'production',
	plugins: [
		new webpack.optimize.SplitChunksPlugin(),
		new GenerateSW({ clientsClaim: true, skipWaiting: true }),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('production'),
		}),
	],
	optimization: {
		splitChunks: {
			chunks: 'all',
		},
	},
});

module.exports = config;
