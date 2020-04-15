// 给获取每一部分的数据封装成一个方法，放在api文件夹中
import jsonp from 'common/js/jsonp.js';
import {commonParams,options} from "./config.js"
// import axios from 'axios'

// 轮播图获取数据的方法
export function getRankList(){
    let url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg';
    // Object.assign()对象的合并方法
    let data = Object.assign({},commonParams,{
        g_tk: 5381,
        uin: 0,
        platform: 'h5',
        needNewCode: 1,
        format :"jsonp"

    });
    return jsonp (url ,data ,options);

}



export function getRankDetial(topId){
    let url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg';
    // Object.assign()对象的合并方法
    let data = Object.assign({},commonParams,{
        g_tk: 5381,
        uin: 0,
        platform: 'h5',
        needNewCode: 1,
        tpl: 3,
        page: 'detail',
        type: 'top',
        topid: topId,

    });
    return jsonp (url ,data ,options);

}





