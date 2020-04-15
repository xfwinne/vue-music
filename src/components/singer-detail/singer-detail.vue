<template>
<transition name="slider"> 
    <v-musiclist :songList="songs" :title="title" :bg-image="bgImage"></v-musiclist>
</transition>
  
</template>

<script>
import {getSingerDetial} from 'api/singer.js';
import {ERR_OK} from "api/config.js";
import {createSong} from "common/js/song.js"
// vuex为我们取数据也设置了语法糖
import {mapGetters} from "vuex"
import musiclist from "components/music-list/music-list.vue"


  export default {
    // 把 `this.singer` 映射为 `this.$store.getters.singer`
    computed:{
        ...mapGetters([
            "singer"
            ]),
        title(){
            return this.singer.name;
        },
        bgImage(){
            return this.singer.avatar
        }
    },
    data(){
        return{
            songs:[]
        }
    },
    activated(){ // 如果路由有变化，会再次执行该方法（解决路由改变了页面数据不刷新的情况）
        this._getDetail();
    },
    components:{
        "v-musiclist":musiclist
    },
    methods:{
        _getDetail(){
            // 如果没有获取到id，那么路由回退到歌手列表页
            if(!this.singer.id){
                this.$router.push("/singer");
                return;
            }
            getSingerDetial(this.singer.id).then((res) => {
                if(res.code === ERR_OK){
                    // console.log(res.data.list);
                  // 图片的拼接字符串不在musicData数据中，所以要单独再传一个参数
                    this.songs = this._normalizeSongs(res.data.list,res.data.singer_mid) ;
                   
                }
                

            }).catch(() => {
                // error
            })
        },
        _normalizeSongs(list,imgid){
            let ret = [];
            list.forEach((item) => {
                // es6的对象解构赋值
                let {musicData} = item ;
                

                if(musicData.songid && musicData.albummid){
                    ret.push(createSong(musicData,imgid));

                }

            })
            return ret;
        }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"

.slider-enter-active,.slider-leave-active
    transition:all 0.3s
.slider-enter,.slider-leave-to
    transform:translate3d(100%,0,0)

</style>