import {mapGetters,mapMutations,mapActions} from 'vuex';
import {playMode} from "common/js/configVariable.js"
import {shuffle} from "common/js/util.js"
// mixin是当多个组件中用到同一段类似的js代码逻辑来处理相同的事情的时候使用的，
//它可以在使用的时候自动添加到组件中，mixin的写法和一般vue组件中js部分写法一致。
//存在播放列表时计算scroll刷新的mixin(在很多组件只要是有滚动，下面播放小图标出现了都要使用)
export let playlistMixin = {
    computed:{
        ...mapGetters([
            'playList'
            ])
    },
    // 当组件的dom准备好了之后触发的
    mounted(){
        this.handlePlaylist(this.playList);

    },
    // 当视图的keepalive切换的时候触发的
    activated(){
        this.handlePlaylist(this.playList);
    },
    watch:{
        playList(newVal){
            this.handlePlaylist(newVal);
        }
    },
    methods:{
        handlePlaylist(){
            // 如果组件中没有定义handlePlaylist这个函数那么就会执行mixin里面的函数主动抛出异常
            throw new Error ('component must implement handlePlaylist method')
        }
    }
}


//播放模式的mixin（在player.vue和playlist.vue都用到）
export let playerMixin = {
    computed:{
        ...mapGetters([
          "sequenceList",
          "currentSong",
          "mode",
          "favoriteList"
            ]),
        iconMode(){
          return this.mode === playMode.sequence ? 'icon-sequence' : this.mode===playMode.loop ? 'icon-loop':'icon-random';
        }
    },
    methods:{
        ...mapMutations({
      setPlayingState:"SET_PLAYING_STATE",
      setCurrentIndex:"SET_CURRENT_INDEX",
      setPlayMode:"SET_PLAY_MODE",
      setPlayList:"SET_PLAY_LIST"
      }),
        ...mapActions([
          'saveFavoriteList',
          'deleteFavoriteList'
          ]),
        // 改变播放状态
      changeMode(){
        let mode = (this.mode + 1) % 3;
        this.setPlayMode(mode);
        // 定义一个空的播放列表
        let songPlayList = null;
        if(mode === playMode.random){
          // 打乱原来的播放列表赋值给空播放列表
          songPlayList = shuffle(this.sequenceList);
        }else{
          songPlayList = this.sequenceList;
        }
        this.resetCurrentIndex(songPlayList);
        this.setPlayList(songPlayList);

      },
      // 在切换播放模式的时候不改变当前歌曲
      resetCurrentIndex(list){
        let index = list.findIndex( (item) => {
          // findIndex()查找元素，返回找到的index，找不到返回-1。
          return item.id === this.currentSong.id;
        })
        this.setCurrentIndex(index); 
      },
      getFavoriteIcon(song){
        if(this.isFavorite(song)){
          return 'icon-favorite'
        }
        return 'icon-not-favorite'
      },
      toggleFavorite(song){
        if(this.isFavorite(song)){
          this.deleteFavoriteList(song);
        }else{
          this.saveFavoriteList(song);
        }
        return 'icon-not-favorite'
      },
      isFavorite(song){
        let index = this.favoriteList.findIndex( (item) =>{
          return item.id === song.id;
        })
        return index > -1 ;
      }
    }
}


//搜索歌曲相关的mixin
export let searchMixin = {
  data(){
    return{
      query:''
    }
  },
  computed:{
    ...mapGetters([
        "searchHistory"
      ]),
  },
  methods:{
    ...mapActions([
        'saveSearchHistory',
        'deleteSearchHistory',
        ]),
    addQuery(key){
        this.$refs.searchBox.setQuery(key);
    },
    // // 滚动列表的时候让input元素失去焦点从而达到收起键盘的效果
    // blurInput(){
    //   // 调用子组件的blurInput()方法
    //   this.$refs.searchBox.blurInput();
    // },
    saveSearchKey(){
      // 当输入框输入 搜索 数据之后，点击了列表中的歌曲了就会缓存搜索词到本地，并且会保存到vuex的searchHistory数组中
      this.saveSearchHistory(this.query);

    },
    onQueryChange(query){
      this.query =query;
    },
  }
}










