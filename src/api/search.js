// 给获取每一部分的数据封装成一个方法，放在api文件夹中
import jsonp from 'common/js/jsonp.js';
import {commonParams,options} from "./config.js"
import axios from 'axios'

// 轮播图获取数据的方法
export function getSearchKey(){
    let url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg';
    // Object.assign()对象的合并方法
    let data = Object.assign({},commonParams,{
        g_tk: 5381,
        uin: 0,
        platform: 'h5',
        needNewCode: 1,

    });
    return jsonp (url ,data ,options);

}


// 获取搜索数据
export function searchList(keyword,page,zhida,perpage){
    // let url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp';
    let url = '/apis/getSearchList';
    // Object.assign()对象的合并方法
    let data = Object.assign({},commonParams,{
        g_tk: 5381,
        uin: 0,
        platform: 'h5',
        needNewCode: 1,
        w: keyword,
        zhidaqu: 1,
        catZhida: zhida ? 1 : 0,
        t: 0,
        flag: 1,
        ie: 'utf-8',
        sem: 1,
        aggr: 0,
        perpage: perpage,
        n: perpage,
        p: page,
        format :"json",
        remoteplace: 'txt.mqq.all',

    });
    // return jsonp (url ,data ,options);
    return axios.get(url,{
        params:data
    }).then( (res) => {
        return Promise.resolve(res.data);
    })
}




