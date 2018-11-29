<template>
  <div class="singer" ref="singer">
    <v-listview @select="selectSinger" :datas="singers" ref="listview"></v-listview>
    <keep-alive>
        <router-view />
    </keep-alive>
  </div>
</template>

<script>
import {getSingerList} from 'api/singer.js';
import {ERR_OK} from "api/config.js";
import listview from "baseComponents/listview/listview.vue"
// vuex状态管理提供了设置数据的语法糖
// 使用 mapMutations 辅助函数将组件中的 methods 映射为 store.commit 调用
import {mapMutations} from "vuex" 
import {playlistMixin} from "common/js/mixin.js"
// import BScroll from "better-scroll"

const HOT_NAME = "热门";
const HOT_SINGER_LEN = 10;
  export default {
    mixins:[playlistMixin],
    data(){
        return {
            singers:[]
        }
        
    },
    created(){
       
        this._getSingerList();
    },
    components:{
        "v-listview":listview
    },
    methods:{
        // 监听到的子组件派发的自定义事件的函数
        selectSinger(singerItem){
            console.log(singerItem)
            // 内置的路由对象
            this.$router.push({
                path : `/singer/${singerItem.id}`
            });
            // 往vuex的state中写入了singerItem
            this.setSinger(singerItem);
        },
        // 封装成一个私有的函数
        _getSingerList(){
            // 因为getRecommend()返回的是一个promise实例
            // 所以：
            // .then(function(){
                //异步操作成功后执行的操作，处理resolve()返回的内容
            // }).catch(function(){
                //异步操作失败后执行的操作，处理reject()返回的内容
            // });
           
             // axios的请求方式
               this.$ajax({
                    method: 'get',
                    url: '/apidata/singers'
                 }).then(response => {
                    // success
                    this.singers = this._normalizeSinger(response.data.datas);
                    console.log(this.singers);
                    // this.$nextTick(function () {
                    //     this.singerWrapScroll = new BScroll(this.$refs.singerWrap,{
                    //          click:true,
                    //      });
                    // });
                    

                },response =>{
                    // error
                });

        },
        _normalizeSinger(singerList){
            let map = {
                hot:{
                    title:HOT_NAME,
                    items:[]
                }
            };
            // 热门为歌手前十位
            singerList.forEach((item,index) => {
                if(index < HOT_SINGER_LEN){
                    map.hot.items.push({
                        id : item.singer_id,
                        name : item.singer_name,
                        avatar :`https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.singer_mid}.jpg?max_age=2592000`

                    });
                }
                // 以每个字母为键名，做 聚合
                const KEY = item.Findex;
                if(!map[KEY]){
                    map[KEY] = {
                        title: KEY,
                        items:[]
                    }

                }

                map[KEY].items.push({
                    id : item.singer_id,
                    name : item.singer_name,
                    avatar :`https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.singer_mid}.jpg?max_age=2592000`
                });

                

                }

            )

            // 因为对象的遍历是 无序的，为了得到有序列表A-z，我们需要处理 map
            let ret = []
            let hot = []
            for (let key in map) {
              let val = map[key]
              if (val.title.match(/[a-zA-Z]/)) {
                ret.push(val)
              } else if (val.title === HOT_NAME) {
                hot.push(val)
              }
            }
            ret.sort((a, b) => {
              return a.title.charCodeAt(0) - b.title.charCodeAt(0)
            })
            return hot.concat(ret)

        },
        // this.setSinger() 将映射为 this.$store.commit('SET_SINGER')  
        //这样通过语法糖扩展就很方便了
        ...mapMutations({
          setSinger: 'SET_SINGER' 
        }),
        handlePlaylist(playlist){
        // 如果有播放列表存在了，那么就给scroll组件元素添加一个bottom
        let bottom = playlist.length > 0? '60px' : '';
        this.$refs.singer.style.bottom = bottom;
        // 重新刷新scroll
        this.$refs.listview.refresh();
      }
       
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>