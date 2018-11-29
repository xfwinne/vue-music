// vuex 的入口文件
// 导入必备的插件依赖
import Vue from "vue";
import Vuex from "vuex"; 
// 导入js文件
import * as actions from "./actions.js";
import * as getters from "./getters.js";
import state from "./state.js";
import mutations from "./mutations.js";
// 引入一个插件来观看vuex状态修改的 控制台日志
import createLogger from "vuex/dist/logger"

// 注册vuex插件
Vue.use(Vuex)

// 开启调试工具
const debug = process.env.NODE_ENV !== "production"
// 单例模式导出vuex实例
export default new Vuex.Store({
    actions,
    getters,
    state,
    mutations,
    // 开启严格模式，调试state的修改是否来源于mutation，不然就报错（开发环境使用）
    strict:debug,
    plugins:debug?[createLogger()] :[]  //这样控制台会打印state的每次修改前后的数据变化
})







