<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input ref="queryInput" class="box" v-model="query" :placeholder="placeholder" />
    <i @click="clear" v-show="query" class="icon-dismiss"></i>
  </div>
</template>

<script>
import {debounce} from "common/js/util.js"
export default{
  props:{
    placeholder:{
      type:String,
      default:'搜索歌曲、歌手'
    }
  },
  data(){
    return {
      query:''
    }
  },
  created(){
    // 监听query，然后把query派发出去给父元素使用
    // 这里输入框输入数据做了双向数据绑定，为了不让每次删除字符或者增加字符就发送请求接口数据，我们要对回调函数做截流处理
    this.$watch('query',debounce((newQuery) => {
      this.$emit('query',newQuery);
    },200))

  },
  methods:{
    clear(){
      this.query="";
    },
    setQuery(query){
      this.query=query;
    },
    // blurInput(){
    //   // this.$refs.queryInput.blur();
    // }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .search-box
    display: flex
    align-items: center
    box-sizing: border-box
    width: 100%
    padding: 0 6px
    height: 40px
    background: $color-highlight-background
    border-radius: 6px
    .icon-search
      font-size: 24px
      color: #f2f2f2
    .box
      flex: 1
      margin: 0 5px
      line-height: 18px
      background: $color-highlight-background
      color: $color-text
      font-size: $font-size-medium
      &::placeholder
        color: $color-text-d
    .icon-dismiss
      font-size: 16px
      color: $color-background
</style>