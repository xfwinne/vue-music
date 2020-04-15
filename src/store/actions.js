// 异步操作处理,对mutation的封装（某个动作触发多个mutation的修改时封装）

import * as types from "./mutation-types.js"
import {playMode} from "common/js/configVariable.js"
import {shuffle} from "common/js/util.js"
import {saveSearch,deleteSearch,clearSearch,savePlay,saveFavorite,deleteFavorite} from "common/js/cache.js"
// 点击歌曲播放会修改多个mutation，所以封装起来
export let selectPlay = function({commit,state},{list,index}){
    // list是歌曲列表，index是当前播放歌曲的索引
    commit(types.SET_SEQUENCE_LIST,list);
    if(state.mode === playMode.random){
        let randomList = shuffle(list);
        commit(types.SET_PLAY_LIST,randomList);
        // 获取随机播放的歌曲对应随机播放歌曲的索引
        index = findSongIndex(randomList,list[index])
    }else{
        commit(types.SET_PLAY_LIST,list);
    }
    
    commit(types.SET_CURRENT_INDEX,index);
    commit(types.SET_FULL_SCREEN,true);
    commit(types.SET_PLAYING_STATE,true);


}


// 随机播放全部
export let randomPlay = function ({commit},{list}) {

    commit(types.SET_PLAY_MODE,playMode.random);
    commit(types.SET_SEQUENCE_LIST,list);
    let randomList = shuffle(list);
    commit(types.SET_PLAY_LIST,randomList);
    commit(types.SET_CURRENT_INDEX,0);
    commit(types.SET_FULL_SCREEN,true);
    commit(types.SET_PLAYING_STATE,true);
}



// 搜索页的歌曲切换
export let insertSong = function ({commit,state},song) {
    // 需要进行深拷贝复制，不然会影响到之前的playList数组
    let  playList = state.playList.slice();
    let  sequenceList = state.sequenceList.slice();
    let  currentIndex = state.currentIndex;
    // 记录当前歌曲
    let currentSong = playList[currentIndex];
    // 查找要 插入的歌曲是否已经在播放列表中，并返回其索引
    let fpIndex = findSongIndex(playList,song);
    // 插入歌曲到当前索引位置
    currentIndex++; 
    console.log(currentIndex)   
    console.log(playList)   
    playList.splice(currentIndex,0,song);
    // 如果已经包含了这首歌（需要删除已存在的歌曲）
    if(fpIndex > -1){
        // 如果当前插入歌曲的序号大于列表中已存在歌曲的序号
        if(currentIndex > fpIndex){
            playList.splice(fpIndex,1);
            currentIndex--;
        }else{
            playList.splice(fpIndex + 1,1);
        }
        
    }
    // console.log(playList)

    // 操作sequenceList要插入的位置

    // 获取当前歌曲需要插到列表的哪个位置
    let currentSequenceIndex = findSongIndex(sequenceList,currentSong) + 1 ;
    // 是否包含我们需要插入的歌曲，返回下标
    let  fSequenceIndex = findSongIndex(sequenceList,song);
    // 插入歌曲
    sequenceList.splice(currentSequenceIndex,0,song);
    // 删除列表中已存在的歌曲
    if(fSequenceIndex > -1){
        // 如果当前插入歌曲的序号大于列表中已存在歌曲的序号
        if(currentSequenceIndex > fSequenceIndex){
            sequenceList.splice(fSequenceIndex,1);
        }else{
            sequenceList.splice(fSequenceIndex + 1,1);
        }
        
    }


    // 
    commit(types.SET_PLAY_LIST,playList);
    commit(types.SET_SEQUENCE_LIST,sequenceList);
    commit(types.SET_CURRENT_INDEX,currentIndex);
    commit(types.SET_FULL_SCREEN,true);
    commit(types.SET_PLAYING_STATE,true);


}


//删除单首歌曲
export let deleteSong = function({commit,state},song){
    let  playList = state.playList.slice();
    let  sequenceList = state.sequenceList.slice();
    let  currentIndex = state.currentIndex;
    //找到playList列表中要删除的那首歌下标，然后删除
    let pIndex = findSongIndex(playList,song);
    playList.splice(pIndex,1);

    let sIndex = findSongIndex(sequenceList,song);
    sequenceList.splice(sIndex,1);

    if(currentIndex > pIndex || currentIndex === playList.length){
        currentIndex--;
    }


    commit(types.SET_PLAY_LIST,playList);
    commit(types.SET_SEQUENCE_LIST,sequenceList);
    commit(types.SET_CURRENT_INDEX,currentIndex);
    // commit(types.SET_FULL_SCREEN,true);
    // commit(types.SET_PLAYING_STATE,true);
    //当列表删除完了，就停止播放
    let playState = playList.length > 0;
    commit(types.SET_PLAYING_STATE,playState);
    // if(!playList.length){
    //     commit(types.SET_PLAYING_STATE,false);
    // }else{
    //     commit(types.SET_PLAYING_STATE,true);
    // }
}


//清空播放列表

export let deleteSongList = function({commit}){
    commit(types.SET_PLAY_LIST,[]);
    commit(types.SET_SEQUENCE_LIST,[]);
    commit(types.SET_CURRENT_INDEX,-1);
    commit(types.SET_PLAYING_STATE,false);
}







// 对搜索关键词进行封装，既能保存到本地，又能存入searchHistory数组中
export let saveSearchHistory = function ({commit},query){
    commit(types.SET_SEARCH_HISTORY,saveSearch(query));
}


// 删除本地存储的历史歌曲
export const deleteSearchHistory = function ({commit},query){
    commit(types.SET_SEARCH_HISTORY,deleteSearch(query));

}

//清空历史歌曲记录
export const clearSearchHistory = function ({commit}){
    commit(types.SET_SEARCH_HISTORY,clearSearch());

}



//历史播放歌曲
export const savePlayHistory = function({commit},song){
    commit(types.SET_PLAY_HISTORY,savePlay(song));
}


//保存我喜欢的歌曲
export const saveFavoriteList = function({commit},song){
    commit(types.SET_FAVORITE_LIST,saveFavorite(song));
}

//删除我喜欢的歌曲
export const deleteFavoriteList = function({commit},song){
    commit(types.SET_FAVORITE_LIST,deleteFavorite(song));
}



function findSongIndex(list,song){
    return list.findIndex((item) => {
        return item.id === song.id;
    })
}









