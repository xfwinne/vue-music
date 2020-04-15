<template>
  <div class="search">
    <div class="search-box-wrapper">
        <v-search-box @query="onQueryChange" ref="searchBox"></v-search-box>
    </div>
    <div ref="shortcutWrapper" class="shortcut-wrapper" v-show="!query">
        <v-scroll :refreshDelay="20" ref="shortcut" class="shortcut" :data="shortcut">
        <div>
            <div class="hot-key">
                <h1 class="title">热门搜索</h1>
                <ul>
                    <li @click="addQuery(item.k)" class="item" v-for="item in searchKey">
                        <span>{{item.k}}</span>
                    </li>
                </ul>
            </div>
            <div class="search-history" v-show="searchHistory.length">
              <h1 class="title">
                <span class="text">搜索历史</span>
                <span @click="showConfirm"  class="clear">
                  <i class="icon-clear"></i>
                </span>
              </h1>
              <v-search-history-list @select="addQuery"  @delete="deleteItem"
              :searches="searchHistory"></v-search-history-list>
          </div>
        </div>
        </v-scroll>
    </div>
    <div ref="searchResult" class="search-result" v-show="query">
        <!-- <v-search-suggest @listScroll="blurInput" :query="query" @selectSong="saveSearchKey" ref="suggest"></v-search-suggest> -->
        <v-search-suggest :query="query" @selectSong="saveSearchKey" ref="suggest"></v-search-suggest>
    </div>
    <!-- 弹框组件需要监听confirm事件，不需要监听cancel事件 -->
    <v-confirm ref="confirm" text="是否清空所有搜索历史记录" confirmBtnText="清空" @confirm="clearSearchHistory"></v-confirm>
    <router-view /> 
  </div>
</template>

<script>
import searchBox from 'baseComponents/search-box/search-box.vue'
import {getSearchKey} from 'api/search.js'
import {ERR_OK} from "api/config.js";
import searchSuggest from 'components/search-suggest/search-suggest.vue'
import {mapActions,mapGetters} from 'vuex'
import searchHistoryList from 'baseComponents/search-list/search-list.vue'
import confirm from 'baseComponents/confirm/confirm.vue'
import scroll from 'baseComponents/scroll/scroll.vue'
import {playlistMixin,searchMixin} from "common/js/mixin.js"

export default{
  mixins:[playlistMixin,searchMixin],
    components:{
        'v-search-box':searchBox,
        'v-search-suggest':searchSuggest,
        'v-search-history-list':searchHistoryList,
        'v-confirm':confirm,
        'v-scroll':scroll,
    },
    mounted(){
        this._getSearchKey();
    },
    data(){
        return {
            searchKey:[],
            // query:""
        }
    },
    computed:{
      // ...mapGetters([
      //   "searchHistory"
      // ]),
      shortcut(){
        //搜索历史的滚动组件中要传入的数据
        return this.searchKey.concat(this.searchHistory)
      }
    },
    watch:{
      query(newQuery){
        //监听query变化，手动刷新历史记录的滚动插件
        if(!newQuery){
          setTimeout(() => {
            this.$refs.shortcut.refresh();
          },20)
        }

      }
    },
    methods:{
      ...mapActions([
        // 'saveSearchHistory',
        // 'deleteSearchHistory',
        'clearSearchHistory'
        ]),
        _getSearchKey(){
            getSearchKey().then( (res) => {
                if(res.code === ERR_OK){
                    this.searchKey = res.data.hotkey.slice(0,10);
                }

            }).catch(() => {

            })
        },
        // addQuery(key){
        //     this.$refs.searchBox.setQuery(key);
        // },
        // onQueryChange(query){
        //     this.query =query;
        // },
        // // 滚动列表的时候让input元素失去焦点从而达到收起键盘的效果
        // blurInput(){
        //   // 调用子组件的blurInput()方法
        //   // this.$refs.searchBox.blurInput();
        // },
        // saveSearchKey(){
        //   // 当输入框输入 搜索 数据之后，点击了列表中的歌曲了就会缓存搜索词到本地，并且会保存到vuex的searchHistory数组中
        //   this.saveSearchHistory(this.query);

        // },
        deleteItem(item){
          // 可以直接在结构点击函数中换上deleteSearchHistory方法名（参数默认是派发过来的参数），这样就不需要在写deleteItem这个方法名了（当函数就调用一个方法时没其他参数就可以这样写）
          this.deleteSearchHistory(item);
        },
        showConfirm(){
          //调用confirm子组件的show函数
          this.$refs.confirm.show();
          // this.clearSearchHistory();
        },
        handlePlaylist(playlist){
        // 如果有播放列表存在了，那么就给scroll组件元素添加一个bottom
        let bottom = playlist.length > 0? '60px' : '';
        this.$refs.shortcutWrapper.style.bottom = bottom;
        this.$refs.searchResult.style.bottom = bottom;
        // 直接重新刷新scroll
        this.$refs.shortcut.refresh();
        //调用子组件的函数来刷新scroll
        this.$refs.suggest.refresh();
      }
    }

}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>