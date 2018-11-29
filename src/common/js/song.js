import {getLyric} from "api/songLyric.js";
import {ERR_OK} from "api/config.js";
import {Base64} from "js-base64"
// 创建歌曲列表类，因为多个页面都用到相同的数据结构

export default class Song{  
    constructor({id,mid,singer,name,album,duration,image,url}){
        this.id = id;
        this.mid = mid;
        this.singer = singer;
        this.name = name;
        this.album = album;
        this.duration = duration;
        this.image = image || '../image/default.png';
        this.url = url;
    }

    // song类的方法
    getLyric(){
        // 如果有歌词了就直接返回
        if(this.lyric){
            return Promise.resolve(this.lyric);
        }

        return new Promise((resolve,reject) => {
            getLyric(this.id).then( (res) => {
                // console.log(res);
                if(res.retcode === ERR_OK){
                    // 对返回的base64编码的字符串进行解码成中文可以识别的字符
                    this.lyric = Base64.decode(res.lyric);
                    // console.log(this.lyric);
                    resolve(this.lyric);
                }else{
                    reject("no lyric");
                }
            });
        })

        
    }
}


export function createSong(musicData,imgid){
    return new Song({
        id:musicData.songid,
        mid:musicData.songmid,
        singer:filterSinger(musicData.singer),
        name:musicData.songname,
        album:musicData.albumname,
        duration:musicData.interval,
        // 图片地址需要自己去查看和拼接
        image:`https://y.gtimg.cn/music/photo_new/T001R150x150M000${imgid}.jpg?max_age=2592000`,
        // image:`https://y.gtimg.cn/music/photo_new/T002R300x300M000${imgid}.jpg?max_age=2592000`,
        // 播放地址需要自己去查看和拼接
        url:`http://dl.stream.qqmusic.qq.com/C400${musicData.songmid}.m4a?vkey=A06EAEDB9782CE47A21B64E0D9E70EC405E1FB52A132833B779437FAB73578DBBFA76F14675ACEF91E120B7A7E7225EA6242AF3BC7617754&guid=3830665470&uin=101&fromtag=38`,

    })
}

// 歌手有有多，用斜线隔开，所以要对数据进行处理一下
function filterSinger(singer){
    let ret = [];
    if(!singer || singer.length === 0){
        return "";
    }
    singer.forEach((item) => {
        ret.push(item.name)
    });
    return ret.join("/");
}



