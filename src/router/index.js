import Vue from 'vue'
import Router from 'vue-router'
// 同步引入组件
// import Recommend from 'components/recommend/recommend.vue'
// import Singer from 'components/singer/singer.vue'
// import Rank from 'components/rank/rank.vue'
// import Search from 'components/search/search.vue'
// import UserCenter from 'components/user-center/user-center.vue'
// import singerDetial from 'components/singer-detail/singer-detail.vue'
// import songDisc from 'components/song-disc/song-disc.vue'
// import rankTopList from 'components/rank-top-list/rank-top-list.vue'

Vue.use(Router);
//异步引入组件
let Recommend = ((resolve) => {
  import("components/recommend/recommend.vue").then((module) =>{
    resolve(module)

  })
});
let Singer = ((resolve) => {
  import("components/singer/singer.vue").then((module) =>{
    resolve(module)

  })
});
let Rank = ((resolve) => {
  import("components/rank/rank.vue").then((module) =>{
    resolve(module)

  })
});
let Search = ((resolve) => {
  import("components/search/search.vue").then((module) =>{
    resolve(module)

  })
});
let UserCenter = ((resolve) => {
  import("components/user-center/user-center.vue").then((module) =>{
    resolve(module)

  })
});
let singerDetial = ((resolve) => {
  import("components/singer-detail/singer-detail.vue").then((module) =>{
    resolve(module)

  })
});
let songDisc = ((resolve) => {
  import("components/song-disc/song-disc.vue").then((module) =>{
    resolve(module)

  })
});
let rankTopList = ((resolve) => {
  import("components/rank-top-list/rank-top-list.vue").then((module) =>{
    resolve(module)

  })
});


export default new Router({
  routes: [
  // 设置根路径默认显示的router
  {
    path:'/',
    redirect:'recommend'
  },
  {
    path:'/recommend',
    component:Recommend,
    // 配置子路由
    children:[
    {
      path: ":id",
      component:songDisc
    }]
  },
  {
    path:'/singer',
    component:Singer,
    // 配置子路由
    children:[
    {
      path: ":id",
      component:singerDetial
    }]
  },
  {
    path:'/rank',
    component:Rank,
    // 配置子路由
    children:[
    {
      path: ":id",
      component:rankTopList
    }]
  },
  {
    path:'/search',
    component:Search,
    // 配置子路由
    children:[
    {
      path: ":id",
      component:singerDetial
    }]
  },
  {
    path:'/user',
    component:UserCenter
  }
   
  ]
  
})
