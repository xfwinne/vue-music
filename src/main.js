// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'   //必须在第一行引入
import Vue from 'vue'
import App from './App'
import router from './router'
// 引入vuex的相关文件
import store from "./store"
import fastclick from 'fastclick'
import axios from 'axios'
import VueLazyload from 'vue-lazyload'
// import VueResource from 'vue-resource'

// // 引入vConsole
// import vConsole from 'vconsole';

// // init vConsole
// var vconsole = new vConsole();
// //使用vConsole
// console.log('在手机上也能console调试项目啦！');

import 'common/stylus/index.styl'
Vue.config.productionTip = false

// 处理300ms延迟问题
fastclick.attach(document.body);

// 只是import进来是无法使用 axios 命令的。所以我们将 axios 改写为 Vue 的原型属性。那么在其他组件中就能使用$ajax方法了
Vue.prototype.$ajax= axios;



// or with options
Vue.use(VueLazyload, {
  // preLoad: 1.3,
  // error: 'dist/error.png',
  loading: require('common/image/default.png'),  //loading: 'dist/loading.gif',
  // attempt: 1
})


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,  //挂在vuex
  components: { App },
  template: '<App/>'
})
