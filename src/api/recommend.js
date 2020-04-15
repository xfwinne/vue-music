// 给获取每一部分的数据封装成一个方法，放在api文件夹中
import jsonp from 'common/js/jsonp.js';
import {commonParams,options} from "./config.js"
import axios from 'axios'

// 轮播图获取数据和热门歌单推荐数据的方法
export function getRecommend(){
    let url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg';
    // Object.assign()对象的合并方法
    let data = Object.assign({},commonParams,{
        platform :'h5',
        uin: 441466981,
        needNewCode: 1

    });
    return jsonp (url ,data ,options);

}

// 获取热门歌单中的具体歌曲列表数据（接口数据改了，所以请求不到了）
export function getSongList(discId){
    
    // 这里的url请求是config/index.js文件里面配置的后台代理地址
    let url = '/apis/getSongList';
    // Object.assign()对象的合并方法
    let data = Object.assign({},commonParams,{
        g_tk: 5381,
        uin: 0,
        platform: 'h5',
        needNewCode: 1,
        new_format: 1,
        pic: 500,
        disstid: discId,
        type: 1,
        json: 1,
        utf8: 1,
        onlysong: 0,
        picmid: 1,
        nosign: 1,
        song_begin: 0,
        song_num: 15,

    });
    // return jsonp (url ,data ,options);
    return axios.get(url, {
        params: data
    }).then((res) => {
        //  // 下面是对获取到的数据进行处理，可以吧jsonp格式的数据处理成json数据
        // let ret = res.data;
        // if(typeof res.data === "string"){            
        //     // 返回的还是jsonp类型的数据，所以要用正则表达式来匹配截取json数据
        //     let reg = /^\w+\((\{[^()]+\})\)$/;
        //     let matches = ret.match(reg);
        //     // matches匹配到的是数组，数组第一个是所有正则表达式匹配的字符串，第二个是第一个小括号匹配到的字符串
        //     if(matches){
        //         ret = JSON.parse(matches[1]);
        //     }            

        // }
        // return Promise.resolve(ret)
        return Promise.resolve(res)
    })






    
}





