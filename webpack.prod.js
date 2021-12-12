'use strict';

const merge = require('webpack-merge');
const common = require('./webpack.common.js');

// HTML打包插件
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 清空打包目录插件
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// 拆分css样式的插件
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
// Visualize size of webpack output files
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = merge(common, {
	mode: 'production',

  devtool: false,

	entry: {
    index: [
    	'core-js/es6',
    	'./src/index.prod.js'
    ]
  },

	output: {
		// 打包后的文件名称, 添加hash可以防止文件缓存, 每次都会生成hash串
		filename: 'assets/js/[name].[chunkhash].js',
		chunkFilename: 'assets/js/[name].[chunkhash].js'
	},
	
	plugins: [
		new HtmlWebpackPlugin({
      template: './src/index.html',
      hash: true, // 会在打包好的bundle.js后面加上hash串
      // chunks: ['vendor', 'index', 'utils'], // 引入需要的chunk
      chunks: ['index'],
      filename: 'index.html', // 输出到assets的同级目录
      chunksSortMode: 'none' // 循环依赖的问题
    }),
    // 拆分后会把css文件放到dist目录下的css/style.css
    // new ExtractTextWebpackPlugin('assets/css/style.[chunkhash].css'),
    new CleanWebpackPlugin(),
    new BundleAnalyzerPlugin({
      analyzerPort: 9999
    })
	]
});
