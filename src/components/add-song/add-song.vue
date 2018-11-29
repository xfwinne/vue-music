<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag" @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click="hide">
          <i class="icon-close"></i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <v-search-box ref="searchBox" placeholder="搜索歌曲" @query="onQueryChange"></v-search-box>
      </div>
      <!-- 当输入框有关键字时显示搜索歌曲列表 -->
      <div class="shortcut" v-show="!query">
        <v-switches-tab :switches="switches" :currentIndex="currentIndex" @switch="clickSwitchItem"></v-switches-tab>
        <div class="list-wrapper">
          <v-scroll ref="playSongScroll" class="list-scroll" v-if="currentIndex===0"  :data="playHistory">
          <div class="list-inner">
            <v-song-list :songs="playHistory" @select="selectSong"></v-song-list>
          </div>
            
          </v-scroll>
          <v-scroll ref="searchSongScroll" class="list-scroll" v-if="currentIndex===1" :data="searchHistory">
            <div class="list-inner">
              <v-search-list :searches="searchHistory" @delete="deleteSearchHistory" @select="addQuery"></v-search-list>
            </div>
          </v-scroll>
        </div>
      </div>
      <div class="search-result" v-show="query">
        <v-search-suggest :query="query" :showSinger="showSinger" @selectSong="selectSuggest" @listScroll="blurInput"></v-search-suggest>
      </div>
      <!-- 选中歌曲添加后的提示 -->
      <v-top-tip ref="topTip" :delay="1000">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">1首歌曲已经 添加到播放列表</span>
        </div>
      </v-top-tip>
    </div>
  </transition>
</template>

<script>
import searchBox from 'baseComponents/search-box/search-box.vue';
import switchesTab from 'baseComponents/switches-tab/switches-tab.vue';
import searchSuggest from 'components/search-suggest/search-suggest.vue'
import {searchMixin} from "common/js/mixin.js"
import scroll from 'baseComponents/scroll/scroll.vue';
import songList from 'baseComponents/song-list/song-list.vue';
import searchList from 'baseComponents/search-list/search-list.vue';
import topTip from 'baseComponents/top-tip/top-tip.vue';
import {mapGetters,mapActions} from 'vuex';
import Song from "common/js/song.js"


  export default {
    mixins:[searchMixin],
    data(){
      return{
        showFlag:false,
        // query:'',
        showSinger:false,
        currentIndex:0,
        switches:[
        {
          name:"最近播放"
        },
        {
          name:"搜索历史"
        }
        ]
      }
    },
    components:{
      'v-search-box':searchBox,
      'v-search-suggest':searchSuggest,
      'v-switches-tab':switchesTab,
      'v-scroll':scroll,
      'v-song-list':songList,
      'v-search-list':searchList,
      'v-top-tip':topTip,
    },
    computed:{
      ...mapGetters([
        'playHistory'
        ])
    },
    methods:{
      ...mapActions([
        "insertSong"
        ]),
      show(){
        this.showFlag = true;
        //显示的时候为了让列表鞥呢滚动，所以要刷新
        setTimeout(() => {
          if(this.currentIndex===0){
            this.$refs.playSongScroll.refresh();
          }else{
            this.$refs.searchSongScroll.refresh();
          }
        },20)
      },
      hide(){
        this.showFlag = false;
      },
      selectSuggest(){
        this.saveSearchKey();
        this.showTopTip();
      },
      clickSwitchItem(index){
        this.currentIndex = index;
      },
      selectSong(song,index){
        if(index !== 0){
          //从缓存中获取的song不是实例，需要new歌曲类
          this.insertSong(new Song(song));
          this.showTopTip();
        }
      },
      showTopTip(){
        this.$refs.topTip.show();
      }
    }

  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .add-song
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    z-index: 200
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .header
      position: relative
      height: 44px
      text-align: center
      .title
        line-height: 44px
        font-size: $font-size-large
        color: $color-text
      .close
        position: absolute
        top: 0
        right: 8px
        .icon-close
          display: block
          padding: 12px
          font-size: 20px
          color: $color-theme

    .search-box-wrapper
      margin: 20px
    .shortcut
      .list-wrapper
        position: absolute
        top: 165px
        bottom: 0
        width: 100%
        .list-scroll
          height: 100%
          overflow: hidden
          .list-inner
            padding: 20px 30px
    .search-result
      position: fixed
      top: 124px
      bottom: 0
      width: 100%
    .tip-title
      text-align: center
      padding: 18px 0
      font-size: 0
      .icon-ok
        font-size: $font-size-medium
        color: $color-theme
        margin-right: 4px
      .text
        font-size: $font-size-medium
        color: $color-text
</style>