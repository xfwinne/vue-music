'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    ///////proxyTable代理原本是空的，现在进行跨域配置
    proxyTable: {
        '/apis/getSongLyric': { 
            target: 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric.fcg',//设置你调用的接口域名和端口号 别忘了加http 
            changeOrigin: true,
            // 设置请求头
            bypass:function(req,res,proxyOptions){
                req.headers.referer = "https://c.y.qq.com";
                req.headers.host = "c.y.qq.com";
            },
            pathRewrite: { 
            '^/apis/getSongLyric': '' //这里理解成用‘/apis/getSongLyric’代替target里面的地址
            }
        },
        '/apis/getSongList': { 
            target: 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg',//设置你调用的接口域名和端口号 别忘了加http 
            changeOrigin: true,
            // 设置请求头
            bypass:function(req,res,proxyOptions){
                req.headers.referer = "https://y.qq.com";
                req.headers.host = "y.qq.com";
            },
            pathRewrite: { 
            '^/apis/getSongList': '' //这里理解成用‘/apis/getSongList’代替target里面的地址
            }
        },
        '/apis/getSearchList': { 
            target: 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp',//设置你调用的接口域名和端口号 别忘了加http 
            changeOrigin: true,
            // 设置请求头
            bypass:function(req,res,proxyOptions){
                req.headers.referer = "https://y.qq.com";
                req.headers.host = "y.qq.com";
            },
            pathRewrite: { 
            '^/apis/getSearchList': '' //这里理解成用‘/apis/getSongList’代替target里面的地址
            }
        },


    },
    // host: '0.0.0.0',/////////自己改的，不然输入ip地址不能访问
    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    
    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',

    /**
     * Source Maps
     */

    productionSourceMap: false,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}