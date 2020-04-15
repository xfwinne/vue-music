<template>
  <transition name="slide">
    <v-music-list :title="title" :bgImage="bgImage" :songList="rankDetail" :rank="rank"></v-music-list>
  </transition>
</template>

<script>
import musicList from 'components/music-list/music-list.vue'
import {mapGetters} from "vuex";
import {getRankDetial} from "api/rank.js"
import {ERR_OK} from "api/config.js";
import {createSong} from 'common/js/song.js';

export default{
  components:{
    'v-music-list':musicList
  },
  data(){
    return {
      rankDetail:[],
      rank:true
    }
  },
  created(){
    this._getRankDetail();
  },
  computed:{
    ...mapGetters([
    'rankTopList'
    ]),
    title(){
      return this.rankTopList.topTitle
    },
    bgImage(){
      return this.rankTopList.picUrl
    }
  },
  methods:{
    _getRankDetail(){
      if(!this.rankTopList.id){
        this.$router.push('/rank')
        return;
      }
      getRankDetial(this.rankTopList.id).then( (res) => {        
        if(res.code === ERR_OK){
          this.rankDetail = this._normalizeRankDetail(res.songlist);
                         
          }
        }).catch( () => {

        })
    },
    _normalizeRankDetail(list){
      let ret = [];
      list.forEach((item) => {
        let musicData = item.data;
          if(musicData.songid && musicData.albummid){
              ret.push(createSong(musicData,0));
          }

      })
      return ret;
    }
  }

}

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s ease

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>