// 给获取每一部分的数据封装成一个方法，放在api文件夹中
//引入封装好后的jsonp
import jsonp from 'common/js/jsonp.js';
import {commonParams,options} from "./config.js" //公共变量

// 歌手获取数据的方法
export function getSingerList(){
    let url = 'https://u.y.qq.com/cgi-bin/musicu.fcg';
    // Object.assign()对象的合并方法
    let datas = Object.assign({},commonParams,{
        g_tk: 1412489437,
        loginUin: 782416218,
        hostUin: 0,
        platform: 'yqq',
        needNewCode: 0,
        data: '%7B%22comm%22%3A%7B%22ct%22%3A24%2C%22cv%22%3A10000%7D%2C%22singerList%22%3A%7B%22module%22%3A%22Music.SingerListServer%22%2C%22method%22%3A%22get_singer_list%22%2C%22param%22%3A%7B%22area%22%3A-100%2C%22sex%22%3A-100%2C%22genre%22%3A-100%2C%22index%22%3A-100%2C%22sin%22%3A0%2C%22cur_page%22%3A1%7D%7D%7D'

    });
    return jsonp (url ,datas ,{}); 
    //最后一个参数，jsonp原始库中要传入的参数，就是callback（如果不是jsonp而是ajax，那么将不需要管这个，直接写{}就好了）
    //如果是jsonp要传入callback参数，那么就写{param :'jsonpCallback'}

}


export function getSingerDetial(singerId){
    let url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg';
    // Object.assign()对象的合并方法
    let datas = Object.assign({},commonParams,{
        g_tk: 5381,
        singerid: singerId,
        uin: 0,
        platform: 'h5page',
        needNewCode: 1,
        order: 'listen',
        from: 'h5',
        num: 100,
        begin: 0,
     });

return jsonp (url ,datas ,options);
}



