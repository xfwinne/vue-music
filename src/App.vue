<template>
  <div id="app">
    <v-header></v-header>
    <v-tab></v-tab>
    <keep-alive>
        <router-view />
    </keep-alive>
    <!-- 播放器 -->
    <v-player></v-player>
  </div>
</template>

<script>
import header from "components/header/header.vue";
import tab from "components/tab/tab.vue";
import player from "components/player/player.vue";
export default {
  components:{
    "v-header":header,
    "v-tab":tab,
    "v-player":player,
  }
}
</script>
<style lang="stylus">
@import 'common/stylus/variable.styl'

</style>
