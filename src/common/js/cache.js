// 引入插件
import storage from 'good-storage'
// 操作 本地存储的localstorage 中的数据

const SEARCH_KEY = "__search__";
const SEARCH_MAX_LENGTH = 15;

const PLAY_KEY = '__play__';
const PLAY_MAX_LENGTH = 200;

const FAVORITE_KEY = '__favorite__';
const FAVORITE_KEY_LENGTH = 200;

// 处理好的要插入本地保存的数据(搜索历史记录)
export function saveSearch(query){
    // 如果没有存过就设置成空数组
    let searches = storage.get(SEARCH_KEY,[])
    insertArray(searches,query,(item) => {
        return item === query;
    },SEARCH_MAX_LENGTH);
    storage.set(SEARCH_KEY,searches);
    return searches;


}
//读取搜索历史记录
export function loadSearch(){
    return storage.get(SEARCH_KEY,[]);
}

export function deleteSearch(query){
    let searches =  storage.get(SEARCH_KEY,[]);
    deleteFromArray(searches,(item) => {
        return item === query;
    });
    storage.set(SEARCH_KEY,searches);
    return searches;
}

export function clearSearch(){
    storage.remove(SEARCH_KEY);
    return [];
}

//保存播放的歌曲到本地
export function savePlay(song){
    let songs = storage.get(PLAY_KEY,[]);
    insertArray(songs,song,(item) => {
        return item.id === song.id;
    },PLAY_MAX_LENGTH)
    storage.set(PLAY_KEY,songs);
    return songs;

}
//读取本地保存的播放歌曲
export function loadPlaySong(){
    return storage.get(PLAY_KEY,[]);
}


//保存我喜欢的歌曲到本地
export function saveFavorite(song){
    let songs = storage.get(FAVORITE_KEY,[]);
    insertArray(songs,song,(item) => {
        return item.id === song.id;
    },FAVORITE_KEY_LENGTH)
    storage.set(FAVORITE_KEY,songs);
    return songs;

}
//删除本地的我喜欢的歌曲
export function deleteFavorite(song){
    let songs =  storage.get(FAVORITE_KEY,[]);
    deleteFromArray(songs,(item) => {
        return item.id === song.id;
    });
    storage.set(FAVORITE_KEY,songs);
    return songs;
}
//读取本地保存的我喜欢的歌曲
export function loadFavoriteSong(){
    return storage.get(FAVORITE_KEY,[]);
}





// 判断数组中是否有要插入的数据，是否超过规定存储长度
// arr为原数组，val为要插入的值，compare为比较函数，maxlen要保存数组的最大长度
function insertArray(arr,val,compare,maxlen){
    let index = arr.findIndex(compare);
    if(index === 0){
        return ;
    }
    if(index > 0){
        arr.splice(index,1);

    }
    arr.unshift(val);
    if(maxlen && arr.length > maxlen){
        arr.pop();
    }

}

//arr为数组，compare为删除匹配项
function deleteFromArray(arr,compare){
    let index  = arr.findIndex(compare);
    if(index >-1){
        arr.splice(index,1);
    }
}



