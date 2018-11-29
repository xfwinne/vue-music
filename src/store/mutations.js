// 定义修改方法的操作//
// 导入所有的mutation的字符串常量
import * as types from "./mutation-types.js"
// 里面定义了方法。方法名是mutation-types.js里面的常量，带两个参数，第一个参数是state.js文件中的状态值，第二个参数是自定义传入的参数(修改后的值)
let mutations = {
    [types.SET_SINGER](state,singer){
        // 直接修改state中的singer值为自定的singer参数值
        state.singer = singer;
    },
    [types.SET_PLAYING_STATE](state,flag){
        state.playing = flag;
    },
    [types.SET_FULL_SCREEN](state,flag){
        state.fullScreen = flag;
    },
    [types.SET_PLAY_LIST](state,list){
        state.playList = list;
    },
    [types.SET_SEQUENCE_LIST](state,list){
        state.sequenceList = list;
    },
    [types.SET_PLAY_MODE](state,mode){
        state.mode = mode;
    },
    [types.SET_CURRENT_INDEX](state,index){
        state.currentIndex = index;
    },

    [types.SET_DISC](state,disc){
        state.disc = disc;
    },
    [types.SET_RANKTOPLIST](state,rankTopList){
        state.rankTopList = rankTopList;
    },
    [types.SET_SEARCH_HISTORY](state,searchHistory){
        state.searchHistory = searchHistory;
    },
    [types.SET_PLAY_HISTORY](state,playHistory){
        state.playHistory = playHistory;
    },
    [types.SET_FAVORITE_LIST](state,favoriteList){
        state.favoriteList = favoriteList;
    },
}
export default mutations;


