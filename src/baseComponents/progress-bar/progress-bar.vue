<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
      @touchstart.prevent="progressTouchStart"
      @touchmove.prevent="progressTouchMove"
      @touchend="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
import {prefixStyle} from "common/js/dom.js"
let progressBtnWidth = 16;
let transform = prefixStyle('transform');
  export default{
    props:{
      percent:{
        type:Number,
        default:0
      }
    },
    created(){
      // 操作不同的touch事件共享的数据都挂在到这个对象上
      this.touch = {}
    },
    watch:{
      percent(newPercent){
        if(newPercent >= 0){
          // 获取进度条的总宽度
          let barWidth = this.$refs.progressBar.clientWidth -progressBtnWidth;
          // 已播放的偏移量
          let playOffsetWidth = newPercent * barWidth ;
          this._offset(playOffsetWidth);

        }
      }
    },
    methods:{
      _offset(playOffsetWidth){
        // 设置已播放的进度条宽度
        this.$refs.progress.style.width = `${playOffsetWidth}px`;
        // 小球进度的偏移
        this.$refs.progressBtn.style[transform] = `translate3d(${playOffsetWidth}px,0,0)`;
      },
      _triggerPercent(){
        // 进度条总宽度
        let barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
        // 播放百分比(已播放的进度除以总进度)
        let percent = this.$refs.progress.clientWidth / barWidth;
        // 派发事件出去通知父级
        this.$emit('percentChange', percent);
      },
      // 触碰屏幕
      progressTouchStart(e){
        // 设置初始接触为true
        this.touch.initiated = true;
        // 获取到第一个手指触碰的位置
        this.touch.startX = e.touches[0].pageX;
        // 获取已播放的进度条宽度
        this.touch.left = this.$refs.progress.clientWidth;

      },
      progressTouchMove(e){
        // 如果没有先触碰屏幕就直接拖动，那么不做任何动作
        if(!this.touch.initiated){
          return;
        }
        // 实时获取到移动的偏移量值
        let deltaX = e.touches[0].pageX - this.touch.startX;
        // 得到歌曲播放设置的 进度条宽度,大于等于0且小于进度条总宽度
        let playOffsetWidth =Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth,Math.max(0,this.touch.left+deltaX))  ;
        // 设置播放相关的值
        this._offset(playOffsetWidth);

      },
      progressTouchEnd(){
        this.touch.initiated = false;
        // 当拖动到 指定位置之后要通知父组件percent发生变化了，需要修改当前歌曲播放时间
        this._triggerPercent();
      },
      // 点击进度条播放到相关位置
      progressClick(e){
        let rect = this.$refs.progressBar.getBoundingClientRect();
        let playOffsetWidth = e.pageX - rect.left;
        this._offset(playOffsetWidth);
        // e.offsetX为点击进度条的时候，x的偏移值;但是这里点击小球的时候获取不正确
        // this._offset(e.offsetX);
        this._triggerPercent();
      }
    }

  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>