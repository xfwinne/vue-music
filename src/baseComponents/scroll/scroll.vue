<!-- better-scroll封装成组件，这样直接在需要使用滚动的地方加个标签然后传数据就可以了 -->
<template>
  <div ref="scrollWrap">
  <slot></slot>
  </div>
</template>

<script>
import BScroll from 'better-scroll';
  export default {
    props:{
        probeType:{
            type:Number,
            default:1
        },
        click:{
            type: Boolean,
            default :true
        },
        data:{
            type:Array,
            default:null
        },
        // 标志scroll组件是否需要监听滚动事件，默认不监听
        listenScroll:{
            type :Boolean,
            default:false
        },
        // 是否开启上拉刷新
        pullup:{
            type:Boolean,
            default:false
        },
        // 在滚动scroll组件前会派发beforeScrollStart事件，我们在这里监听看是否需要收起键盘
        beforeScroll:{
            type:Boolean,
            default:false
        },
        refreshDelay:{
            type:Number,
            default:20
        }
    },
    mounted(){
        setTimeout(() => {
            this._initScroll();
        },20)
        // this.$nextTick(function () {
        //     this._initScroll();
        // })

    },
    watch:{
        // 监听上面props的data，如果发生变化就重新渲染scroll
        data(){
            setTimeout(() => {
                this.refresh();
                //刷新时间作为动态是为了防止动画时间影响，刷新scroll不正确的表现
            },this.refreshDelay)
        }
    },
    methods:{
        _initScroll(){
            if(!this.$refs.scrollWrap){
                return false;
            }
            this.scroll = new BScroll(this.$refs.scrollWrap,{
                probeType:this.probeType,
                click: this.click,

            });
            // 如果需要监听滚动事件，那么在初始化时就派发事件
            if(this.listenScroll){
                let vueThis = this;
                this.scroll.on('scroll',(pos) => {
                    // 派发scroll事件，让父级监听到
                    vueThis.$emit('scroll',pos)
                })
            }

            if(this.pullup){
                // 如果需要上拉刷新，那么就 要 判断是都到达底部了
                this.scroll.on('scrollEnd',() => {
                    if(this.scroll.y <= (this.scroll.maxScrollY + 50)){
                        this.$emit('scrollToEnd');
                    }
                })
            }

            // 好像不需要自己额外设置失去焦点收起键盘
            if(this.beforeScroll){
                this.scroll.on("beforeScrollStart", () => {
                    this.$emit("beforeScroll");
                })
            }



        },
        enable(){
            this.scroll && this.scroll.enable();
        },
        disable(){
            this.scroll && this.scroll.disable();
        },
        refresh(){
            this.scroll && this.scroll.refresh();
        },
        scrollTo(){
            // this.scroll是better-scroll实例
            this.scroll && this.scroll.scrollTo.apply(this.scroll,arguments)
        },
        scrollToElement(){
            this.scroll && this.scroll.scrollToElement.apply(this.scroll,arguments)
        },

    },

  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>