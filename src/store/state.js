import {playMode} from "common/js/configVariable.js"
import {loadSearch,loadPlaySong,loadFavoriteSong} from "common/js/cache.js"


// 定义state，相关的底层数据

let state = {
    // 歌手的歌曲数据
    singer:{},
    // 播放状态，默认不播放
    playing:false,
    // 播放器的展开和收缩,默认收缩
    fullScreen:false,
    // 播放列表（不同播放模式下的播放列表不一样）
    playList:[],
    // 顺序播放列表(原始歌曲列表)
    sequenceList:[],
    // 播放模式
    mode:playMode.sequence,
    // 当前播放歌曲的索引
    currentIndex:-1,


    // 推荐列表的歌单对象 
    disc:{},

    // 排行歌曲详细
    rankTopList:{},

    // 搜索历史(从本地存储中获取数据)
    searchHistory:loadSearch(),

    //播放历史
    playHistory:loadPlaySong(),

    //我喜欢的歌曲列表
    favoriteList:loadFavoriteSong()
}


// 传递出去
export default state;





