<!-- 轮播图组件（基础组件） -->
<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
        <span class="dot" v-for="(item,index) in dots" :class="{active:currentPageIndex === index}"></span>
    </div>
  </div>
</template>

<script>
  import {addClass} from 'common/js/dom.js'
  import BScroll from 'better-scroll';

  export default {
    props:{
        // 是否能循环轮播（默认能）
        loop:{
            type: Boolean,
            default: true
        },
        // 是否自动轮播
        autoPlay:{
            type:Boolean,
            default:true
        },
        // 几秒进行一次切换轮播
        interval:{
            type:Number,
            default:4000
        },
    },
    data(){
        return{
            // 轮播图中的点点
            dots:[],
            // 当前是哪张轮播图
            currentPageIndex:0
        }
        
    },
    mounted(){
        // 为了让视图dom渲染好了才初始化better-scroll，这样不会报错,可以使用延迟函数，或者使用this.$nextTick
        setTimeout(() => {
            this._setSliderWidth();
            this._initDots();
            this._initSlider();
            if(this.autoPlay){
                this._autoplay();
            }


        },20);

        // 监听视图窗口大小发生变化就会渲染轮播图宽度
        window.addEventListener('resize',() => {
            // 如果slider没有初始化就什么都不做
            if (!this.slider) {
                return false;
            }
            // 重新渲染的时候不能再加两倍宽度了
            this._setSliderWidth(true);
            // 重新初始化better-scroll
            this.slider.refresh();
        })


    },
    destroyed(){
        // 当组件切换完了就调用这个生命结束周期（一般有定时器的话就习惯性要这样优化下）
        clearTimeout(this.timer);
    },
    methods:{
        // 获取到内层滚动的轮播总长度，那么超出了外层的宽度之后才能进行横向滚动
        _setSliderWidth(isResize){
            // this.children获取到内部子节点数组
            this.children = this.$refs.sliderGroup.children;
            let sliderWidth = 0;
            // 获取到最外层slider宽度，屏幕宽度
            let sliderWrapWidth = this.$refs.slider.clientWidth;
            for(let i = 0; i < this.children.length ; i++){
                let child = this.children[i];
                // 给内部的每个item元素加上slider-item类名
                addClass(child,'slider-item');
                // 设置每一个的宽度是父元素的宽度
                child.style.width = sliderWrapWidth + 'px';
                sliderWidth += sliderWrapWidth;
            }
            // 如果能够循环轮播，那么就需要左右各克隆一份，为了保证能够正常的循环轮播
           if(!isResize){
            if(this.loop){
                sliderWidth += 2 * sliderWrapWidth;
            }
           }
            

            // 设置内部轮播的总宽度
            this.$refs.sliderGroup.style.width = sliderWidth + 'px';

        },
        _initDots(){
            // 初始化轮播图上面的点点
            this.dots = new Array(this.children.length);
        },
        _initSlider(){
            this.slider = new BScroll(this.$refs.slider,{
                scrollX:true,
                scrollY:false,
                momentum:false,
                // snap:true,
                // snapLoop:this.loop,
                // snapThreshold:0.3,
                // snapSpeed:400,
                click:true,
                snap:{
                    loop:this.loop,
                    threshold:0.3,
                    speed:400

                }

            });
            // 能够无线轮播的滑动初始化时，滑动过程中会scrollEnd派发一个事件，在这个事件能够获取到当前是哪个轮播图
            this.slider.on('scrollEnd', () => {
                // 获取到当前的轮播图的index
                let pageIndex = this.slider.getCurrentPage().pageX;
               
                this.currentPageIndex = pageIndex;
                // 如果是手动拖拉轮播图，那么要清除定时器
                if(this.autoPlay){
                    clearTimeout(this.timer);
                    this._autoplay();
                }


            });


        },
        _autoplay(){
            let pageIndex = this.currentPageIndex +1;

            this.timer = setTimeout(() => {
                this.slider.goToPage(pageIndex,0,400);
            },this.interval)
        }

    }

    
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
/*样式这里引入路径前面要写个 ~ 波浪线，暂时还搞不清楚*/
  @import "~common/stylus/variable" 

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>