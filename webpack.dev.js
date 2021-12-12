'use strict';

// const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

// HTML打包插件
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 拆分css样式的插件
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

module.exports = merge(common, {
	mode: 'development',

  entry: {
    index: [
      'core-js/es6',
      './src/setPrototypeOf',
      'react-hot-loader/patch',
      './src/index.dev.js'
    ]
  },

	output: {
		filename: 'assets/js/[name].js',
    chunkFilename: 'assets/js/[name].js'
	},

	// 本地服务器
  devServer: {
    // contentBase: './dev/',
    // index: 'dev/index.html',
    port: 8090,
    // 自动打开浏览器
    open: true,
    // openPage: 'dev/',
    // 开启热更新
    hot: true,
    // 浏览器页面上显示错误
    overlay: true,
    // 不跳转
    historyApiFallback: true,
    publicPath: '/'
  },

  // 只有开发环境才需要调试
  devtool: 'inline-source-map',

	plugins: [
		new HtmlWebpackPlugin({
      template: './src/index.html',
      // chunks: ['vendor', 'antd-vendor', 'index', 'utils'],
      chunks: ['index'],
      filename: 'index.html',
      // filename: path.join(__dirname, 'dist/index.html'),
      chunksSortMode: 'none' // 循环依赖的问题
    }),
    // new ExtractTextWebpackPlugin('assets/css/[name].css'),
    // 热更新, 热更新不是刷新
    new webpack.HotModuleReplacementPlugin()
	],

  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom'
    }
  }
});