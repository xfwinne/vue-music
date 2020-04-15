// 获取state数据的映射（一般都是直接从这个文件获取数据到组件的computed中）


// state => state.singer 为带state参数的箭头函数，返回state.singer
export let singer = state => state.singer;

// 播放器的数据映射
export let playing = state => state.playing;
export let fullScreen = state => state.fullScreen;
export let playList = state => state.playList;
export let sequenceList = state => state.sequenceList;
export let mode = state => state.mode;
export let currentIndex = state => state.currentIndex;

export let currentSong = (state) => {
    return state.playList[state.currentIndex] || {} ;
}


export let disc = state => state.disc;
export let rankTopList = state => state.rankTopList;


export let searchHistory = state => state.searchHistory;


export let playHistory = state => state.playHistory;

export let favoriteList = state => state.favoriteList;












