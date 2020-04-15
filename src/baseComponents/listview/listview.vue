<template>
  <v-scroll class="listview" :data="datas" ref="listview" :listenScroll="listenScroll" @scroll="scroll" :probeType="probeType">
    <ul>
        <li v-for="group in datas" class="list-group" ref="listGroup">
            <h2 class="list-group-title">{{group.title}}</h2>
            <ul>
                <li v-for="item in group.items" class="list-group-item" @click="selectItem(item)">
                    <img class="avatar" v-lazy="item.avatar">
                    <span class="name">{{item.name}}</span>
                </li>
            </ul>
        </li>
    </ul>
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
        <ul>
            <li class="item" v-for="(item,index) in shortcutList" :data-index="index"
            :class="{'current':currentIndex===index}"
            >
                {{item}}
            </li>
        </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixedWrap">
        <h2 class="fixed-title">{{fixedTitle}}</h2>
    </div>
  </v-scroll>
</template>

<script>
import bscroll from "baseComponents/scroll/scroll.vue";
import {toggleAttrData} from "common/js/dom.js"
// 每个锚点的高度，右边字母高度
const ANCHOR_HEIGHT = 18;
// 头部固定title的高度
const FIX_TITLE_HEIGHT = 30;
  export default {
    props:{
        datas:{
            type:Array,
            default:[]
        }
    },
    components:{
        "v-scroll":bscroll
    },
    data(){
        return {
            // 实时监听滚动的y值（scrollY的变化就会影响到哪个当前高亮）
            scrollY :-1,
            // 当前哪个是高亮
            currentIndex:0,
            // 滚动过程中标题的上限和滑动固定头部的偏移值
            diff:-1
        }
    },
    computed:{
        shortcutList(){
            return this.datas.map( (group) => {
                return group.title.substr(0,1);
            })
        },
        fixedTitle(){
            // 如果向上滚动超过顶部，那么就不显示固定头部了
            // console.log(this.scrollY)
            if(this.scrollY > 0){
                return "";
            }
            return this.datas[this.currentIndex] ? this.datas[this.currentIndex].title : '';
        }
    },
    watch:{
        // 监听如果data发生变化了就重新计算高度
        datas(){
            // console.log(datas)
            setTimeout( () => {
                this._calculateHeight();
            },20)
        },
        // 监听滚动y值发生变化
        scrollY(newY){
            // this.currentIndex是控制哪个字母高亮的
            let listHeight = this.listHeight;
            // 当滚动到顶部，newY > 0
            if(newY > 0){
                this.currentIndex = 0;
                return;
            }
            // 滚动在中间部分（通过判断listHeight数组能知道点击了哪个字母）
            for(let i = 0; i < listHeight.length -1; i++){
                let height1 = listHeight[i];
                let height2 = listHeight[i+1];
                // 往下滑动的y值是负数，所以要取反（因为传进来的newY是负值）
                if(-newY >= height1
                     && -newY < height2){
                    this.currentIndex = i;
                // 监听diff值(newY为负值，滚动监听的值)
                this.diff = height2 + newY ;
                return;
                }
                // 滚动到最后一个
                // this.currentIndex = listHeight - 2;
                // console.log(this.currentIndex)

            }

        },
        diff(newVal){
            // console.log(newVal)
            let fixedTop = (newVal > 0 && newVal < FIX_TITLE_HEIGHT) ? newVal-FIX_TITLE_HEIGHT:0;
            // if(fixedTop === this.fixedTop){
            //     return;
            // }
            // this.fixedTop = fixedTop;
            // 操作dom进行偏移，y轴负值往上偏移
            this.$refs.fixedWrap.style.transform = `translate3d(0,${fixedTop}px,0)`;
        }

    },
    created(){
        // 在this下面绑定个变量touch，为了给组件内的方法都能获取到这个变量
        this.touch = {};
        this.listenScroll = true;
        this.listHeight = [];
        this.probeType = 3;
    },
    methods:{
        onShortcutTouchStart(event){
          
            // 获取右侧点击了哪个字母下标（index）
            let anchorIndex = toggleAttrData(event.target,'index');
            // 获取触碰的第一个手指的位置
            let firstTouch = event.touches[0];
            // console.log(firstTouch)
            this.touch.y1 = firstTouch.pageY; // 获取第一个手指距离页面的y坐标值
            this.touch.anchorIndex = anchorIndex;
            this._scrollTo(anchorIndex);


        },
        onShortcutTouchMove(event){
            let firstTouch = event.touches[0];
            this.touch.y2 = firstTouch.pageY; 
            console.log(this.touch.y1)
            console.log(this.touch.y2)

            // 偏移了几个锚点值
            // 往上滑delta为正值，往下滑delta为负值
            let delta = -Math.floor((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT )  ;
            let anchorIndex = parseInt(this.touch.anchorIndex ) + delta;
            this._scrollTo(anchorIndex);

        },
        scroll(pos){
            // scrollY监听better-scroll实时滚动的 y值
            this.scrollY = pos.y;
        },
        // 暴露个接口能够给父组件刷新scroll组件
        refresh(){
            this.$refs.listview.refresh();
        },
        selectItem(item){
            this.$emit('select',item);
        },
        _scrollTo(index){
            console.log(index)
            // 如果点到的不是字母，而是父元素的空白处，那么直接不需要滚动
            if(index === null){
                return;
            }
            // 处理拖动字母超出边界问题
            if(index < 0){
                index = 0;
            }else if(index > this.listHeight.length -2){
                index = this.listHeight.length -2;
            }
            // 为了使点击的时候高亮随着变，那么叫改变监听的scrollY值
            this.scrollY = -this.listHeight[index];
            console.log(this.scrollY)
            this.$refs.listview.scrollToElement(this.$refs.listGroup[index],0);

        },
        // 计算每一列字母对应组的高度
        _calculateHeight(){
            this.listHeight = [];
            let list = this.$refs.listGroup;
            let height = 0;
            this.listHeight.push(height);
            for(let i = 0; i < list.length; i++){
                let item = list[i];
                height += item.clientHeight;
                this.listHeight.push(height);
            }
        }
        
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: -1px
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
