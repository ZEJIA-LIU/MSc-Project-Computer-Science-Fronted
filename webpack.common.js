'use strict';

// Node.js文件模块
const path = require('path');

// 插件都是一个类, 命名的时候尽量用大写开头
// 拆分css样式的插件
// const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

module.exports = {
	// 入口在dev和prod里各自定义
  // 直接写'./src/index.js'等同{ main: './src/index.js' }, 后续HtmlWebpackPlugin引用会出问题
  // entry: {
  //   index: './src/index.js'
  // },

  // 出口
  output: {
    // filename在dev和prod里各自定义
  	// 打包后的目录, 必须是绝对路径
    path: path.join(__dirname, 'dist'),
    // 引用资源加上的路径, ip + publicPath + filename
    publicPath: '/'
  },

  // loaders
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        use: ['eslint-loader'],
        include: /src/,
        exclude: /node_modules/
      },
      {
        // 转义ES6和react
        test: /\.js$/,
        use: ['babel-loader'],
        // 只转化src目录下的js
        include: /src/,
        // 排除掉node_modules, 优化打包速度
        exclude: /node_modules/
      },
      {
        // 解析css
        test: /\.css$/,
        // 写法1, 从左向右解析
        use: ['style-loader', 'css-loader', 'postcss-loader']

        // 写法2, 这种方式方便写一些配置参数
        // use: [
        //   {loader: 'style-loader'},
        //   {loader: 'css-loader'}
        // ]

        // 1和2都是打包到HTML行内样式

        // 拆分css
        // use: ExtractTextWebpackPlugin.extract({
        //   // 将css用link的方式引入就不再需要style-loader了
        //   fallback: 'style-loader',
        //   use: ['css-loader', 'postcss-loader']
        // })
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
      },
      {
        // css引用图片
        test: /\.(jpe?g|png|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              // 小于8k的图片自动转成base64格式, 并且不会存在实体图片
              limit: 8192,
              // 图片打包后存放的目录
              outputPath: 'assets/images'
            }
          }
        ]
      },
      {
        // HTML引用图片
        test: /\.(htm|html)$/,
        use: 'html-withimg-loader'
      },
      {
        // 引用字体图标和svg图片
        test: /\.(eot|ttf|woff|svg)$/,
        use: 'file-loader'
      }
    ]
  },

  // 模块解析
  resolve: {
    // 省略后缀
    extensions: ['.js', '.jsx', '.json', '.css'],
    // 别名
    alias: {
      pages: path.join(__dirname, 'src/pages'),
      components: path.join(__dirname, 'src/components'),
      styles: path.join(__dirname, 'src/styles'),
      images: path.join(__dirname, 'src/images'),
      config: path.join(__dirname, 'src/config')
    }
  },

  //提取公共代码, 等同webpack4-的CommonsChunkPlugin
  // optimization: {
  //   splitChunks: {
  //     cacheGroups: {
  //       // 抽离第三方插件
  //       vendor: {
  //         // 指定是node_modules下的第三方包
  //         test: /node_modules/,
  //         chunks: 'initial',
  //         // 打包后的文件名, 任意命名 
  //         name: 'vendor',
  //         // 设置优先级, 防止和自定义的公共代码提取时被覆盖, 不进行打包
  //         priority: 10
  //       },
  //       'antd-vendor': {
  //         test: /antd/,
  //         priority: 12,
  //         // reuseExistingChunk: false,
  //         chunks: 'initial',
  //         name: 'antd-vendor'
  //       },
  //       // 抽离自己写的公共代码, utils里面是一个公共类库
  //       utils: {
  //         chunks: 'initial',
  //         // 任意命名
  //         name: 'utils',
  //         // 只要超出0字节就生成一个新包
  //         minSize: 0
  //       }
  //     }
  //   }
  // }
};