<template>
<div class="player" v-show="playList.length>0">
  <transition name="normal"
              @enter="enter"
              @after-enter="afterEnter"
              @leave="leave"
              @after-leave="afterLeave"
  >
    <!-- 正常播放器 -->
    <div class="normal-player" v-show="fullScreen">
      <div class="background">
        <!-- onerror="javascript:this.src='https://y.gtimg.cn/music/photo_new/T001R150x150M000002J4UUk29y8BY.jpg?max_age=2592000';" -->
          <img width="100%" height="100%" :src="currentSong.image" onerror="javascript:this.src='https://y.gtimg.cn/music/photo_new/T001R150x150M000001t94rh4OpQn0.jpg?max_age=2592000';">
        </div>
        <div class="top">
          <div class="back" @click="backMiniPlay">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle"
            @touchstart.prevent="middleTouchStart"
            @touchmove.prevent="middleTouchMove"
            @touchend="middleTouchEnd"
        >
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdToggleRotate ">
                <img class="image" :src="currentSong.image" onerror="javascript:this.src='https://y.gtimg.cn/music/photo_new/T001R150x150M000001t94rh4OpQn0.jpg?max_age=2592000';">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>   
          <v-scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines" >
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyricLine" 
                   class="text" 
                   :class="{'current':currentLineNum === index}"
                   v-for="(line,index) in currentLyric.lines">{{line.txt}}</p>
              </div>
            </div>            
          </v-scroll>       
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentPageShow === 'cd'}"></span>
            <span class="dot" :class="{'active':currentPageShow === 'lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{formatTime(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <v-progress-bar :percent="percentBar" @percentChange="onProgressBarChange"></v-progress-bar>
            </div>
            <span class="time time-r">{{formatTime(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changeMode">
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left" >
              <i @click="prevSong" class="icon-prev"></i>
            </div>
            <div class="icon i-center" >
              <i :class="playIcon" @click="togglePlaying"></i>
            </div>
            <div class="icon i-right" >
              <i @click="nextSong" class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i  class="icon" :class="getFavoriteIcon(currentSong)" @click="toggleFavorite(currentSong)"></i>
            </div>
          </div>
        </div>      
    </div>
  </transition>
    <!-- 收缩后的迷你播放器 -->
  <transition name="mini">
    <div class="mini-player" v-show="!fullScreen" @click="openFullScreen">
      <div class="icon">
          <img :class="cdToggleRotate" width="40" height="40" :src="currentSong.image"  onerror="javascript:this.src='https://y.gtimg.cn/music/photo_new/T001R150x150M000001t94rh4OpQn0.jpg?max_age=2592000';">
          <!-- https://y.gtimg.cn/music/photo_new/T001R150x150M000001t94rh4OpQn0.jpg?max_age=2592000 -->
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control"> 
          <i @click.stop="togglePlaying" :class="miniPlayIcon"></i>       
        </div>
        <div class="control" @click.stop="showPlaylist">
          <i class="icon-playlist"></i>
        </div>
    </div>
  </transition>
    <!-- 播放列表组件 -->
    <!-- <v-playlist ref="playlist" v-show="showPlaylistTrue"></v-playlist> -->
    <v-playlist ref="playlist"></v-playlist>
    <!-- 音乐播放器标签 -->
    <audio ref="audio" :src="currentSong.url" @play="readyPlay" @error="errorPlay" @timeupdate="updateTime" @ended="endPlay"></audio>
</div>
</template>

<script>
import {mapGetters,mapMutations,mapActions} from "vuex";
import animations from "create-keyframe-animation" ;
import {prefixStyle} from "common/js/dom.js";
import Lyric from "lyric-parser" // https://github.com/ustbhuangyi/lyric-parser
import progressBar from "baseComponents/progress-bar/progress-bar.vue";

import {playMode} from "common/js/configVariable.js";
// import {shuffle} from "common/js/util.js"
import scroll from "baseComponents/scroll/scroll.vue";
import playlist from 'components/playlist/playlist.vue';

import {playerMixin} from "common/js/mixin.js";

let transform = prefixStyle('transform');
let transitionDuration = prefixStyle('transitionDuration');


export default{
  mixins:[playerMixin],
  data(){
    return{
      //播放歌曲是否准备好了的标志位
      songReady:false,
      currentTime:0,
      currentLyric:null,
      // 当前播放歌词所在的行
      currentLineNum:0,
      currentPageShow:'cd',
       // 当前播放歌曲的歌词
      playingLyric:''
      // showPlaylistTrue:fals
    }
  },
  created(){
    this.touch = {}
  },
  components:{
    "v-progress-bar":progressBar,
    "v-scroll":scroll,
    "v-playlist":playlist,
  },
  computed:{

    ...mapGetters([
      "fullScreen",
      "playList",
      // "sequenceList",
      // "currentSong",
      "playing",
      "currentIndex",
      // "mode"
      ]),
     playIcon(){
      return this.playing ? "icon-pause" : "icon-play";
    },
    miniPlayIcon(){
      return this.playing ? "icon-pause-mini" : "icon-play-mini";
    },
    cdToggleRotate(){
      return this.playing ? 'play' : "play pause";
    },
    percentBar(){
      return this.currentTime / this.currentSong.duration ;
    },
    // iconMode(){
    //   return this.mode === playMode.sequence ? 'icon-sequence' : this.mode===playMode.loop ? 'icon-loop':'icon-random';
    // }
  },
  watch:{

    // 当歌曲发生变化的时候调用audio的play方法来播放歌曲
    currentSong(newSong,oldSong){
      if(!newSong.id){
        return;  ///防止播放列表被删除完了报歌词找不到的错误
      }
      console.log("当前播放的歌曲信息")
      console.log(newSong)
      // 当切换模式的时候id不变，那么将不会切换歌曲的播放状态
      if(newSong.id === oldSong.id){
        return;
      }
      // 如果快速点击切换歌曲，那么判断是否还有歌词，有的话就停止动画
      if(this.currentLyric){
        this.currentLyric.stop();
      }
      // this.$nextTick(() => {
      //   this.$refs.audio.play();
      //   // 获取当前歌曲的歌词
      //   this.getLyricTrue();
      // })
      // 为了让用户在吧程序放到后台再切换到前台时音乐也能正常播放，那么就要延迟执行函数
      clearTimeout(this.timer);
      this.timer = setTimeout( () => {
        this.$refs.audio.play();
        // 获取当前歌曲的歌词
        this.getLyricTrue();
      },1000)


      
    },
    playing(newPlaying){
      let audio = this.$refs.audio;
      // 监听playing值的变化来设置歌曲的播放和暂停
      this.$nextTick(() => {
        newPlaying ? audio.play() :audio.pause();
      })
      
    }

  },
  methods:{
    ...mapMutations({
      setFullScreen:"SET_FULL_SCREEN",
      
      }),
    ...mapActions([
      'savePlayHistory'
      ]),
   
    // 动画的钩子函数
    enter(el,done){
      // es6对象扩展
      let {x,y,scale} = this._getPosAndScale();
      let animation = {
        0:{
          transform:`translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        60:{
          transform:`translate3d(0,0,0) scale(1.1)`
        },
        100:{
          transform:`translate3d(0,0,0) scale(1)`
        }
      }
      // animations的api函数(定义动画)
      animations.registerAnimation({
        // 动画名称
        name:"move",
        // 动画
        animation,
        // 动画的预设选项
        presets:{
          // 动画间隔
          duration:400,
          // 动画函数
          easing:"linear"

        }

      })

      // 调用动画(第一个参数是作用的dom元素，第二个参数是动画名，第三个参数是动画执行完后的回调函数)
      animations.runAnimation(this.$refs.cdWrapper,"move" ,done)

    },
    // 动画执行完后清空动画
    afterEnter(){
      animations.registerAnimation("move");
      this.$refs.cdWrapper.style.animation = "";
    },
    leave(el,done){
      this.$refs.cdWrapper.style.transition = "all 0.4s";
      let {x,y,scale} = this._getPosAndScale();
      this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`;
      // 调用动画结束
      this.$refs.cdWrapper.addEventListener('transitionend',done);
    },
    afterLeave(){
      this.$refs.cdWrapper.style.transition = "";
      this.$refs.cdWrapper.style[transform] = "";

    },
    // 获取迷你播放器唱片图像距离大的播放器唱片图像的中心到中心的距离和缩放比例
    _getPosAndScale(){
      // 小唱片的宽度
      let targetWidth = 40;
      let targetLeft = 40;
      let targetBottom = 30;
      // 大唱片的顶部距离
      let top = 80;
      // 因为宽度时80%，所以这样计算
      let width = window.innerWidth * 0.8;
      // 初始缩放比例
      let scale =  targetWidth / width ;
      let x = -(window.innerWidth / 2) -targetLeft;
      let y = window.innerHeight - top - width /2 - targetBottom ;
      return {
        x,
        y,
        scale
      }

    },
    backMiniPlay(){
      this.setFullScreen(false);
    },
    openFullScreen(){
      this.setFullScreen(true);
    },
    togglePlaying(){
      this.setPlayingState(!this.playing);
      // 歌词也要跟着 音乐的 播放和暂停而相应变化。调用歌词插件的内置api
      if(this.currentLyric){
        this.currentLyric.togglePlay();
      }
    },
    readyPlay(){
      this.songReady = true;
      this.savePlayHistory(this.currentSong);
    },
    errorPlay(){

    },
    endPlay(){
      if(this.mode === playMode.loop){
        this.loopSong();
      }else{
        this.nextSong();
      }
    },
    prevSong(){
      // 如果快速连续点击上一首，那么如果audio内置很熟canplay还没有正确准备好歌曲，那么将不会执行下面的切歌。不然会报错
      if(!this.songReady){
        return;
      }
      if(this.playList.length === 1){
        // 如果只有一条数据，那么点击上一首就直接循环歌曲
        this.loopSong();
      }else{
        let index = this.currentIndex - 1;
        // 顺序播放到第一首歌时，index回到最后一首
        if(index === -1){
          index = this.playList.length-1;
        }
        this.setCurrentIndex(index);
        // 切换歌曲了重新切换播放的状态值
        if(!this.playing){
          this.togglePlaying();
        }
      }
      
      // 点击了之后重新改变标志位
      this.songReady = false;
    },
    nextSong(){
      if(!this.songReady){
        return;
      }
      if(this.playList.length === 1){
        // 如果只有一条数据，那么点击下一首就直接循环歌曲
        this.loopSong();
      }else{
        let index = this.currentIndex +1;
        // 顺序播放到最后一首歌时，index回到第一首
        if(index === this.playList.length){
          index = 0;
        }
        this.setCurrentIndex(index);
        if(!this.playing){
          this.togglePlaying();
        }
      }
      
      this.songReady = false;
    },
    loopSong(){
      // audio的currentTime属性是可读写的
      this.$refs.audio.currentTime = 0;
      this.$refs.audio.play();
      // 单曲循环的时候让歌词回到第一句
      if(this.currentLyric){
        this.currentLyric.seek(0);
      }
    },
    updateTime(event){
      // 实时获取audio播放时间（时间戳）
      this.currentTime = event.target.currentTime ;
    },
    // 处理播放时间的时间戳
    formatTime(interval){
      interval = Math.floor(interval);
      let minute = Math.floor(interval / 60);
      let second = this._addZero(interval % 60)  ;
      return `${minute}:${second}`;

    },
    onProgressBarChange(percent){
      let time = this.currentSong.duration * percent;
      // 父组件监听到子组件派发过来事件，修改当前 播放时间
      let currentTime = time;
      // 修改audio的当前播放 时间
        this.$refs.audio.currentTime = currentTime;
        // 如果拖动时暂停了，那么就会拖动后播放
        if (!this.playing) {
          this.togglePlaying();
        }

        // 
        if(this.currentLyric){
          // 因为time中是ms，所以要乘以1000
          this.currentLyric.seek(time*1000)
        }



    },
    _addZero(num,n = 2){
      // time 为传入的值，n为补齐几位
      let len = num.toString().length;
      while(len < n){
        num = '0' + num ;
        len ++ ;
      }
      return num;

    },
   
    getLyricTrue(){
      console.log(this.currentSong)
      this.currentSong.getLyric().then((lyric) => {
        //为了防止快速切换歌曲后歌词进行异步加载慢对不上的问题，所以仅加载当前歌曲的歌词
        if(this.currentSong.lyric !== lyric){
          return;
        }
        // 对歌词进行解析，分解成我们需要的数据（使用我们安装的lyric插件）
        this.currentLyric = new Lyric(lyric,this.handleLyric);
        if(this.playing){
          // lyric插件的play()函数api
          this.currentLyric.play();
        }
      }).catch( () => {
        this.currentLyric = null;
        this.playingLyric = '';
        this.currentLineNum = 0;

      })
    },
    handleLyric({lineNum,txt}){
      this.currentLineNum = lineNum;
      // 为了让歌词播放的时候一直能在视野中看到高亮，那么需要主动触发滚动
      if(lineNum > 5){
        let lineEl = this.$refs.lyricLine[lineNum - 5];
        this.$refs.lyricList.scrollToElement(lineEl,1000);
      }else{
        this.$refs.lyricList.scrollTo(0,0,1000);
      }
      // 当前播放的歌词
      this.playingLyric = txt;
    }, 
    middleTouchStart(event){
      // 标志已被初始化了
      this.touch.initiated = true;
      this.moveTrue = false;
      // 获取第一个手指
      let touchFinger = event.touches[0];
      // 获取第一个手指的x坐标
      this.touch.startX = touchFinger.pageX;
      // 获取第一个手指的Y坐标
      this.touch.startY = touchFinger.pageY;
    },
    middleTouchMove(event){
      // console.log("move")
      if(!this.touch.initiated){
        return ;
      }
      this.moveTrue = true; // 用来标志是否为原地点击，如果没有滑动就不进行end后续程序处理
      // 获取第一个手指
      let touchFinger = event.touches[0];
      // 在滑动的时候x，y的偏移值
      let deltaX = touchFinger.pageX - this.touch.startX;
      let deltaY = touchFinger.pageY - this.touch.startY;
      
      // 横向滑动x偏移值大于y（切换cd和lyric），纵向滑动y偏移值大于x（上下拉取歌词）
      // 因为歌词 组件使用了滑动组件，所以当y轴方向的滑动偏移值大于X轴时就不切换X方向的动画
      if(Math.abs(deltaY) > Math.abs(deltaX)){
        return;
      }
      // 判断歌词界面处于什么位置，left值为多少(如果是cd界面那么left为0，右边的歌词在原来的位置；如果右边的歌词已经滑动出来了，那么left为窗口视图的负值)
      let left = this.currentPageShow === 'cd' ? 0 : -window.innerWidth;
      let offsetWidth = Math.min(0,Math.max(-window.innerWidth,left+deltaX)) ;
      // 获取到滑动后显示元素的宽度占整个屏幕的百分比
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth);
     
    },
    middleTouchEnd(){
      this.touch.initiated = false;
      // console.log("end")
      if(!this.moveTrue){
        return false;
      }
      let offsetWidth = null ;
      let opacity = null;
      // 从右向左滑显示歌词
      if(this.currentPageShow === 'cd'){
        if(this.touch.percent > 0.1){
          offsetWidth = -window.innerWidth;
          opacity = 0;
          this.currentPageShow = "lyric"
        }else{
          offsetWidth = 0;
          opacity = 1;
        }
      }else{
        // 从左向右滑显示cd唱片头像
        if(this.touch.percent < 0.9){
          offsetWidth = 0;
          this.currentPageShow = "cd"
          opacity = 1;
        }else{
          offsetWidth = -window.innerWidth;
          opacity = 0;
        }
      }
     
      this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`;
      // 设置动画时间
      this.$refs.lyricList.$el.style[transitionDuration] = '400ms';

      // 修改 cd唱片的渐显渐隐的动画效果
      this.$refs.middleL.style.opacity = opacity;
      this.$refs.middleL.style[transitionDuration] = '300ms';
    },
    showPlaylist(){
      // this.showPlaylistTrue = true;
      this.$refs.playlist.show();  // 调用子组件的show函数
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>