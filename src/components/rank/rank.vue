<template>
  <div class="rank" ref="rank">
    <v-scroll :data="topList" class="toplist" ref="toplist">
        <ul>
            <li @click="selectItem(item)" class="item" v-for="item in topList">
                <div class="icon">
                    <img v-lazy="item.picUrl" height="100" width="100">
                </div>
                <ul class="songlist">
                    <li v-for="(song,index) in item.songList" class="song">
                        <span>{{index + 1}}</span>
                        <span>{{song.songname}}-{{song.singername}}</span>
                    </li>
                </ul>
            </li>
        </ul>
        <div class="loading-container" v-show="!topList.length">
            <v-loading></v-loading>
        </div>
    </v-scroll>
    <router-view />
  </div>
</template>

<script>
import {getRankList} from "api/rank.js"
import {ERR_OK} from "api/config.js";
import scroll from 'baseComponents/scroll/scroll.vue'
import loading from 'baseComponents/loading/loading.vue'
import {playlistMixin} from "common/js/mixin.js"
import {mapMutations} from 'vuex'

    export default{
        mixins:[playlistMixin],
        created(){

            this._getRankList();
        },
        data(){
            return {
                topList:[]
            }
        },
        components:{
            'v-scroll':scroll,
            'v-loading':loading,
        },
        methods:{
            ...mapMutations({
                setTopList:"SET_RANKTOPLIST"
            }),
            _getRankList(){
                getRankList().then( (res) => {
                    if(res.code === ERR_OK){
                    
                    this.topList = res.data.topList;
                    console.log(this.topList);
                    
                }

                }).catch( () => {

                })
            },
            handlePlaylist(playlist){
                // 如果有播放列表存在了，那么就给scroll组件元素添加一个bottom
                let bottom = playlist.length > 0? '60px' : '';
                this.$refs.rank.style.bottom = bottom;
                // 重新刷新scroll
                this.$refs.toplist.refresh();
              },
              selectItem(item){
                // 二级路由跳转
                this.$router.push({
                    path:`/rank/${item.id}`
                })
                this.setTopList(item)

              }
        }

    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .rank
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .toplist
      height: 100%
      overflow: hidden
      .item
        display: flex
        margin: 0 20px
        padding-top: 20px
        height: 100px
        &:last-child
          padding-bottom: 20px
        .icon
          flex: 0 0 100px
          width: 100px
          height: 100px
        .songlist
          flex: 1
          display: flex
          flex-direction: column
          justify-content: center
          padding: 0 20px
          height: 100px
          overflow: hidden
          background: $color-highlight-background
          color: $color-text-d
          font-size: $font-size-small
          .song
            no-wrap()
            line-height: 26px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>