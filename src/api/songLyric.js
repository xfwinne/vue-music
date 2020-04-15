// 获取歌曲的歌词，qq官网做了保护，所以要用自己模拟的后端代理
import {commonParams} from "./config.js"
import axios from 'axios'

export function getLyric(songid){
    // 这里的url请求是config/index.js文件里面配置的后台代理地址
    let url = '/apis/getSongLyric';
    // Object.assign()对象的合并方法
    let data = Object.assign({},commonParams,{
        musicid: songid,
        g_tk: 1439643096,
        uin: 782416218,
        platform: 'h5',
        needNewCode: 1,
        nobase64: 0,
        songtype: 0,

    });
    // return jsonp (url ,data ,options);
    return axios.get(url, {
        params: data
    }).then((res) => {
        // console.log(res)  
         // 下面是对获取到的数据进行处理，可以吧jsonp格式的数据处理成json数据
        let ret = res.data;
        if(typeof res.data === "string"){            
            // 返回的还是jsonp类型的数据，所以要用正则表达式来匹配截取json数据
            let reg = /^\w+\((\{[^()]+\})\)$/;
            let matches = ret.match(reg);
            // matches匹配到的是数组，数组第一个是所有正则表达式匹配的字符串，第二个是第一个小括号匹配到的字符串
            if(matches){
                ret = JSON.parse(matches[1]);
            }            

        }
        return Promise.resolve(ret)
    })

}















