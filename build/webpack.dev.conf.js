'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')


//////////////模拟请求本地数据代码添加start
// 增加express
const express = require('express')
const app = express()
//加载本地数据文件
var appData = require('../singerData.json') //获取json对象
var singers = appData.singers   //获取字段名
var apiRoutes = express.Router()
//为了统一管理api接口，我们在要请求的路由前边都加上‘/api’来表明这个路径是专门用来提供api数据的
app.use('/apidata', apiRoutes)  

//////////////模拟请求本地数据代码添加end

//////////////添加 代码start
// 如果跨域请求需要指定请求头的时候就需要用到这种方法vue2.0的低版本，高版本不再适用
// const express = require('express')
// const axios = require('axios')
// var app = express()
// var apiRoutes = express.Router()
// apiRoutes.get('/getDiscList', function (req, res) {
//   var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
//   axios.get(
//     url, 
//     {
//     headers: {
//       referer: 'https://c.y.qq.com',
//       host: 'c.y.qq.com'
//     },
//     params: req.query
//   }).then((response) => {
//     // 把response.data数据透出给浏览器前端res
//     res.json(response.data)
//   }).catch((e) => {
//     console.log(e)
//   })
// })


// 请求歌词接口
// apiRoutes.get('/getSongLyric', function (req, res) {
//   var url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric.fcg'
//   axios.get(
//     url, 
//     {
//     headers: {
//       referer: 'https://c.y.qq.com',
//       host: 'c.y.qq.com'
//     },
//     params: req.query
//   }).then((response) => {
//     // 把response.data数据透出给浏览器前端res
//     res.json(response.data)
//   }).catch((e) => {
//     console.log(e)
//   })
// })


// app.use('/apidata', apiRoutes)
//////////////添加 代码end
const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    /////////////// 增加路由规则before()
    before(app) {
      app.get('/apidata/singers', (req, res) => {
        res.json({
          code: 0,
          datas: singers
        })
      })
    },
    ///////////////
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
