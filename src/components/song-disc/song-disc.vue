<template>
  <transition name="slide">
    <v-music-list :bgImage="bgImage" :title="title" :songList="songs"></v-music-list>
  </transition>
</template>

<script>
import musiclist from "components/music-list/music-list.vue";
import {mapGetters} from "vuex";
import {getSongList} from 'api/recommend.js';
import {ERR_OK} from "api/config.js";

  export default {
    components:{
        'v-music-list':musiclist
    },
    data(){
        return {
            songs:[],
        }
    },
    computed:{
        ...mapGetters([
            'disc'
            ]),
        title(){
            return this.disc.songListDesc
        },
        bgImage(){
            return this.disc.picUrl
        }
    },
    created(){
        this._getSongList();
    },
    methods:{
        _getSongList(){
            console.log(this.disc.id)
            getSongList(this.disc.id).then((res) => {
                // console.log(res)
                if(res.code === ERR_OK){
                    
                    this.songs = res.data.cdlist[0].songlist;
                    console.log(this.songs);
                }
                

            }).catch(() => {
                // error
            })
        }
    }
   
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>