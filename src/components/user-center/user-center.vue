<template>
  <transition name="slide">
    <div class="user-center">
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <div class="switches-wrapper">
        <v-switch-tab :switches="switches" :currentIndex="currentIndex" @switch="switchItem"></v-switch-tab>
      </div>
      <div ref="playBtn" class="play-btn" @click="randomPlayMusic">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-wrapper" ref="listWrapper">
        <v-scroll ref="favoriteListScroll" class="list-scroll" v-if="currentIndex===0"  :data="favoriteList">
        <div class="list-inner">
          <v-song-list :songs="favoriteList" @select="selectSong"></v-song-list>
        </div>          
        </v-scroll>
        <v-scroll ref="playHistoryScroll" class="list-scroll" v-if="currentIndex===1" :data="playHistory">
          <div class="list-inner">
            <v-song-list :songs="playHistory" @select="selectSong"></v-song-list>
          </div>
        </v-scroll>
      </div>
    <div class="no-result-wrapper">
      <v-no-result v-show="noresult" :title="noResultTitle"></v-no-result>
    </div>
    </div>
  </transition>
</template>

<script>
import switchTab from 'baseComponents/switches-tab/switches-tab.vue';
import {mapGetters,mapActions} from 'vuex';
import scroll from 'baseComponents/scroll/scroll.vue';
import songList from 'baseComponents/song-list/song-list.vue';
import Song from 'common/js/song.js';
import noResult from 'baseComponents/no-result/no-result.vue';

import {playlistMixin} from "common/js/mixin.js"

  export default {  
  mixins:[playlistMixin], 
   
    computed:{
       ...mapGetters([
        'favoriteList',
        'playHistory'
        ]),
       noresult(){
        //根据不同的tab展示
        if(this.currentIndex === 0){
          return  !this.favoriteList.length;
        }else{
          return !this.playHistory.length;
        }
       },
       noResultTitle(){
        if(this.currentIndex === 0){
          return  '暂无喜欢歌曲';
        }else{
          return '暂无播放歌曲';
        }
       }
    },
    data(){
      return{
        switches:[
        {name:"我喜欢的"},
        {name:"最近听的"},
        ],
        //当前是哪个switch
        currentIndex:0,
        title:"暂无数据"
      }
    },
    components:{
      'v-switch-tab':switchTab,
      'v-song-list':songList,
      'v-scroll':scroll,
      'v-no-result':noResult,
    },
    methods:{
      ...mapActions([
        'insertSong',
        'randomPlay'
        ]),
      switchItem(index){
        this.currentIndex = index;
      },
      selectSong(song){
        this.insertSong(new Song(song))
      },
      back(){
        this.$router.back();
      },
      randomPlayMusic(){
        let list = this.currentIndex=== 0 ? this.favoriteList : this.playHistory;
        //当没有歌曲的时候就什么都不做
        if(list.length === 0){
          return;
        }
        list = list.map( (song) => {
          return new Song(song);
        })
        this.randomPlay({
          list
        })
      },
      handlePlaylist(playlist){
        let bottom = playlist.length > 0? '60px' : '';
        //设置外层的高度
        this.$refs.listWrapper.style.bottom = bottom;
    
        // （因为使用了v-if，所以要判断存在了才能调用方法）直接重新刷新scroll
        this.$refs.favoriteListScroll && this.$refs.favoriteListScroll.refresh();
        //调用子组件的函数来刷新scroll
        this.$refs.playHistoryScroll && this.$refs.playHistoryScroll.refresh();
      }

    }

  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .user-center
    position: fixed
    top: 0
    bottom: 0
    z-index: 100
    width: 100%
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .switches-wrapper
      margin: 10px 0 30px 0
    .play-btn
      box-sizing: border-box
      width: 135px
      padding: 7px 0
      margin: 0 auto
      text-align: center
      border: 1px solid  $color-text-l
      color: $color-text-l
      border-radius: 100px
      font-size: 0
      .icon-play
        display: inline-block
        vertical-align: middle
        margin-right: 6px
        font-size: $font-size-medium-x
      .text
        display: inline-block
        vertical-align: middle
        font-size: $font-size-small
    .list-wrapper
      position: absolute
      top: 110px
      bottom: 0
      width: 100%
      .list-scroll
        height: 100%
        overflow: hidden
        .list-inner
          padding: 20px 30px
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>