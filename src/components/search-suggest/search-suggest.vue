<template>
<v-scroll :data="queryList" class="suggest" :pullup="pullup" :beforeScroll="beforeScroll" @beforeScroll="listScroll"  @scrollToEnd="searchMore" ref="suggest">
  <ul class="suggest-list">
    <!-- <li @click="selectItem(item)" v-for="item in queryList" class="suggest-item"> -->
    <li v-for="item in queryList" class="suggest-item">
      <div class="icon">
        <i :class="getIconCls(item)"></i>
      </div>
      <div class="name">
        <p class="text" v-html="getDisplayName(item)"></p>
      </div>
    </li>
    <li>
      <v-loading v-show="hasMore" title=""></v-loading>
    </li>
  </ul>
  <div v-show="!hasMore && !queryList.length" class="no-result-wrapper">
    <v-no-result :title="title"></v-no-result>
  </div>
</v-scroll>
</template>

<script>
import {searchList} from 'api/search.js'
import {ERR_OK} from "api/config.js";
import scroll from "baseComponents/scroll/scroll.vue"
import loading from "baseComponents/loading/loading.vue"
import noResult from "baseComponents/no-result/no-result.vue"
import {mapMutations,mapActions} from "vuex" 

const TPYE_SINGER = "singer";
// 每次上拉加载请求多少条数据
const PERPAGE = 20;

export default{
  props:{
    query:{
      type:String,
      default:""
    },
    showSinger:{
      type:Boolean,
      default:true
    }
  },
  components:{
    "v-scroll":scroll,
    "v-loading":loading,
    "v-no-result":noResult,
  },
  watch:{
    query(newQuery){
      this.search(newQuery);
    }
  },
  data(){
    return {
      page:1,
      queryList:[],
      pullup:true,
      beforeScroll:true,
      hasMore:true,
      title:"暂无搜索结果"
    }
  },
  methods:{
    // 抓取搜索后的检索数据
    search(){
      // 第一次搜索让page为1
      this.page = 1;
      this.hasMore = true;
      // 当下拉刷新时为了让输入框中内容发生变化滚动到顶部展示数据
      this.$refs.suggest.scrollTo(0,0 );
      searchList(this.query,this.page,this.showSinger,PERPAGE).then( (res) => {
          if(res.code === ERR_OK){
            this.queryList = this._dealSearchList(res.data);
              console.log(this.queryList)
              this._checkMore(res.data);

          }

      }).catch(() => {

      })

    },
    // 对接口 数据进行处理，处理成我们需要的数据
    _dealSearchList(list){
      let ret = [];

      if(list.zhida && list.zhida.albumid){
        // 对象扩展
        ret.push({...list.zhida, ...{type:TPYE_SINGER}});
      }
      if(list.song){
        // 把两个数组相连接
        ret = ret.concat(list.song.list)
      }
      return ret;

    },
    getIconCls(item){
      if(item.type === TPYE_SINGER){
        return "icon-mine"
      }else{
        return "icon-music"
      }
    },
    getDisplayName(item){
      if(item.type === TPYE_SINGER){
        return item.singername;

      }else{
        return item.songname;
        }
    },
    searchMore(){
      if(!this.hasMore){
        return;
      }
      this.page++;
      searchList(this.query,this.page,this.showSinger,PERPAGE).then( (res) => {
        // console.log(res)
          if(res.code === ERR_OK){
            // 数组拼接
            this.queryList =this.queryList.concat(this._dealSearchList(res.data)) ;
              // console.log(this.queryList)
              this._checkMore(res.data);

          }

      }).catch(() => {

      })
    },
    _checkMore(datas){
      let song = datas.song;
      // 判断是否没数据了
      if(!song.list.length || (song.curnum + song.curpage*PERPAGE) >= song.totalnum){
        this.hasMore = false;
      }
    },
    ...mapMutations({
          setSinger: 'SET_SINGER' 
        }),
    ...mapActions([
          "insertSong" 
        ]),
    // selectItem(item){
    //   if(item.type === TPYE_SINGER){
    //     let singer = {
    //       id : item.songid,
    //       name:item.songname,
    //       avatar :`https://y.gtimg.cn/music/photo_new/T002R300x300M000000NHJaS27ScbT.jpg?max_age=2592000`
    //     }
    //     this.$router.push({
    //       path:`/search/${singer.id}`
    //     })
    //     this.setSinger(singer);
    //   }else{
    //     console.log(item)
    //     this.insertSong(item);
    //   }

    //   // 派发事件(让父组件知道它被点击了)
    //   this.$emit("selectSong")
    // },
    listScroll(){
      // 派发listScroll事件出去
      this.$emit("listScroll");//没用了这个
    },
    refresh(){
      //给父组件刷新scroll组件用的函数
      this.$refs.suggest.refresh();
    }
  }

}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>