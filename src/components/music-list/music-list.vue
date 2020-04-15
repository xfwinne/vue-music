<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div class="play" v-show="songList.length>0" ref="playBtn" @click="randomPlaySong">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <v-scroll @scroll="scroll" :probe-type="probeType" :listen-scroll="listenScroll" :data="songList" class="list" ref="list">
      <div class="song-list-wrapper">
        <v-songlist @select="selectItem" :songs="songList" :rank="rank"></v-songlist>
      </div>
      <div class="loading-container" v-show="!songList.length">
        <v-loading></v-loading>
      </div>
    </v-scroll>
  </div>
</template>

<script>

import scroll from "baseComponents/scroll/scroll.vue";
import songlist from "baseComponents/song-list/song-list.vue";
import {prefixStyle} from "common/js/dom.js"
import loading from "baseComponents/loading/loading.vue"
import {playlistMixin} from "common/js/mixin.js"

// 想要修改vuex的action中的数据，使用vuex提供的语法糖
import {mapActions} from "vuex"

const RESERVED_HEIGHT = 40;
// 定义前缀变量
let transform = prefixStyle('transform');
let backdrop = prefixStyle('backdrop-filter');

  export default{
    mixins:[playlistMixin],
    props: {
      bgImage:{
        type:String,
        default:''
      },
      songList:{
        type:Array,
        default:[]
      },
      title:{
        type:String,
        default:""
      },
      rank:{
        type:Boolean,
        default:false
      }
    },
    computed: {
      bgStyle(){
        return `background-image:url(${this.bgImage})`;
      }
    },
    components:{
      "v-scroll":scroll,
      "v-songlist":songlist,
      "v-loading":loading

    },
    created(){
      this.probeType = 3;
      this.listenScroll = true;

    },
    mounted(){
      this.imageHeight = this.$refs.bgImage.clientHeight;
      // 往上滚是负值，取最大能滚动到背景图的顶部
      this.minTranslateY = -this.imageHeight+ RESERVED_HEIGHT;
      // v-scroll组件上面的引用需要加$el，因为要获取到里面的dom元素
      this.$refs.list.$el.style.top=`${this.imageHeight}px`;
    },
    data(){
      return{
        scrollY :0
      }
    },
    methods:{
      ...mapActions([
        "selectPlay",
        "randomPlay"
        ]),
      scroll(pos){
        this.scrollY = pos.y;
      },
      back(){
        // 返回路由上一级
        this.$router.back();
      },
      selectItem(item,index){
        // 扩展了之后就 只能能通过this.来调用actions中的函数了
        this.selectPlay({
          list:this.songList,
          index:index
        })
      },
      randomPlaySong(){
        this.randomPlay({list:this.songList});
      },
      handlePlaylist(playlist){
        // 如果有播放列表存在了，那么就给scroll组件元素添加一个bottom
        let bottom = playlist.length > 0? '60px' : '';
        this.$refs.list.$el.style.bottom = bottom;
        // 重新刷新scroll
        this.$refs.list.refresh();
      }
    },
    watch:{
      scrollY(newY){
        // layer最大滚动量
        let translateY = Math.max(this.minTranslateY,newY);
        let zIndex = 0;
        let scale = 1;
        let blur = 0;
        this.$refs.layer.style[transform] = `translate3d(0,${translateY}px,0)`;
        // 当歌曲列表往下拉时，背景图有放大效果
        // 缩放的计算比例
        let percent = Math.abs(newY / this.imageHeight);
        if(newY > 0){
          scale = 1 + percent ;
          zIndex = 10;
        }else{
          // 当歌曲列表网上滑时，背景图出现高斯模糊效果
          blur = Math.min(20 * percent,20);
        }

        this.$refs.filter.style[backdrop] = `blur(${blur}px)`;

        // 当滚动超出layer时，改变背景图的 高度和层级，为了覆盖超出的文字
        if(newY < this.minTranslateY){
          zIndex = 10;
          this.$refs.bgImage.style.paddingTop = 0;
          this.$refs.bgImage.style.height = RESERVED_HEIGHT +"px";
            // 让播放按钮消失
            this.$refs.playBtn.style.display = "none";

        }else{
          this.$refs.bgImage.style.paddingTop = '70%';
          this.$refs.bgImage.style.height = 0;
          this.$refs.playBtn.style.display = "block";
        }
        this.$refs.bgImage.style.zIndex = zIndex;
        // 设置下拉缩放效果
        this.$refs.bgImage.style[transform] = `scale(${scale})`;

      }
    }

  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
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
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
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
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>