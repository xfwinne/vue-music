<template>
  <div class="recommend" ref="recommend">
    <v-bscroll ref="scroll" :data="discList" class="recommend-content">
        <!-- 添加一个div来包住内容，让better-scroll能滚动 -->
        <div>
            <div v-if="recommends.length" class="slider-wrapper">
              <!-- slider组件中使用了slot插槽，其内部的元素是直接替换到插槽中的 -->
              <v-slider>
                  <div v-for="item in recommends">
                      <a :href="item.linkUrl">
                          <img @load="loadImage" :src="item.picUrl">
                      </a>
                  </div>
              </v-slider>
            </div>
            <div class="recommend-list">
                <h1 class="list-title">热门歌单推荐</h1>
                <ul>
                   <li @click="selectItem(item)" v-for="item in discList" class="item">
                       <div class="icon">
                           <img width="60" height="60" v-lazy="item.picUrl">
                       </div>
                       <div class="text">
                           <h2 class="name">{{item.songListDesc}}</h2>
                           <p class="desc">{{item.songListAuthor}}</p>
                       </div>
                   </li> 
                </ul>
            </div>
        </div>
        <!-- 缓冲加载提示 -->
        <div class="loading-container" v-show="!discList.length">
            <v-loading :title="title"></v-loading>
        </div>
    </v-bscroll>
    <keep-alive>
        <router-view />
    </keep-alive>
  </div>
</template>

<script>

import {getRecommend} from 'api/recommend.js';
import slider from 'baseComponents/slider/slider.vue';
import {ERR_OK} from "api/config.js";
import bscroll from "baseComponents/scroll/scroll.vue"
import loading from "baseComponents/loading/loading.vue"
import {playlistMixin} from "common/js/mixin.js"
import {mapMutations} from "vuex";



  export default {
    mixins:[playlistMixin],
    components:{
        "v-slider":slider,
        "v-bscroll":bscroll,
        "v-loading":loading,

    },
    data(){
        return {
            recommends:[],
            discList:[],
            title:"歌曲正在载入..."
        }
    },
    created(){
        this._getRecommend();
        this._getDiscList();
    },
    methods:{
        // 封装成一个私有的函数
        _getRecommend(){
            // getRecommend()返回的是一个promise实例            
            getRecommend().then((res) => {
                if(res.code === ERR_OK){
                    // console.log(res.data);
                    this.recommends = res.data.slider;                    
                }                

            }).catch(() => {
                // error
            })

        },
        _getDiscList(){          
           getRecommend().then((res) => {
                if(res.code === ERR_OK){
                    // console.log(res.data);
                    this.discList = res.data.songList;
                    
                }               

            }).catch(() => {
                // error
            })

        },
        loadImage(){
            // 监听图片的onload方法，加载了就调用loadImage这个方法，就是为了让better-scroll能正常滚动，因为有两批数据异步获取的
            // 为了防止多张图片都会触发load事件，这里只执行一次就可以了
            if(!this.checkLoaded){
                this.$refs.scroll.refresh();
                this.checkLoaded = true;
            }
            
        },
        handlePlaylist(playlist){
        // 如果有播放列表存在了，那么就给scroll组件元素添加一个bottom
        let bottom = playlist.length > 0? '60px' : '';
        this.$refs.recommend.style.bottom = bottom;
        // 重新刷新scroll
        this.$refs.scroll.refresh();
      },
      selectItem(item){
        console.log(item);
        this.$router.push({
          path:`/recommend/${item.id}`
        });
        // 写入state，这样其他组件也能访问了
        this.setDisc(item);
      },
      ...mapMutations({
        setDisc:'SET_DISC'
      })
    }

  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%       
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>