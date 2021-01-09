const { resolve, join } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const context = resolve(__dirname, '../');
const configFile = join(context, 'tsconfig.app.json');

/** @type {import('webpack').Configuration} */
const config = {
	context,
	entry: join(context, 'src/app/index.tsx'),
	output: {
		filename: 'js/[name].[contenthash:8].js',
		path: join(context, 'build'),
		chunkFilename: 'js/[name].[contenthash:8].chunk.js',
		publicPath: '/',
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},
	module: {
		rules: [
			{
				test: /\.[jt]sx?$/i,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							cacheDirectory: true,
							presets: [
								'@babel/preset-env',
								'@babel/preset-react',
								'@babel/preset-typescript',
							],
							plugins: [
								['@babel/plugin-transform-runtime', { regenerator: true }],
							],
						},
					},
					{
						loader: 'ts-loader',
						options: {
							transpileOnly: true,
							configFile,
						},
					},
				],
			},
			{
				test: /\.s?css$/i,
				use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
			},
			{
				test: /\.(jpe?g|png|gif|ico|svg|mp4|ttf|woff2?|otf)$/i,
				loader: 'file-loader',
				options: {
					name: '[folder]/[name].[ext]',
					outputPath: 'assets/',
				},
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: join(context, 'public/index.html'),
		}),
		new ForkTsCheckerWebpackPlugin({ typescript: { configFile } }),
		new CleanWebpackPlugin(),
		new CopyWebpackPlugin({ patterns: [{ from: 'public/' }] }),
		new MiniCssExtractPlugin({
			filename: 'css/[name].[contenthash:8].css',
			chunkFilename: 'css/[name].[contenthash:8].chunk.css',
		}),
	],
};

module.exports = config;
