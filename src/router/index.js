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
// //异步引入组件
// let Recommend = ((resolve) => {
//   import("components/recommend/recommend.vue").then((module) =>{
//     resolve(module)

//   })
// });
// let Singer = ((resolve) => {
//   import("components/singer/singer.vue").then((module) =>{
//     resolve(module)

//   })
// });
// let Rank = ((resolve) => {
//   import("components/rank/rank.vue").then((module) =>{
//     resolve(module)

//   })
// });
// let Search = ((resolve) => {
//   import("components/search/search.vue").then((module) =>{
//     resolve(module)

//   })
// });
// let UserCenter = ((resolve) => {
//   import("components/user-center/user-center.vue").then((module) =>{
//     resolve(module)

//   })
// });
// let singerDetial = ((resolve) => {
//   import("components/singer-detail/singer-detail.vue").then((module) =>{
//     resolve(module)

//   })
// });
// let songDisc = ((resolve) => {
//   import("components/song-disc/song-disc.vue").then((module) =>{
//     resolve(module)

//   })
// });
// let rankTopList = ((resolve) => {
//   import("components/rank-top-list/rank-top-list.vue").then((module) =>{
//     resolve(module)

//   })
// });


export default new Router({
  routes: [
  // 设置根路径默认显示的router
  {
    path:'/',
    redirect:'recommend'
  },
  {
    path:'/recommend',
    component: () => import('components/recommend/recommend.vue'),
    // component:Recommend,
    // 配置子路由
    children:[
    {
      path: ":id",
      component:() => import('components/song-disc/song-disc.vue')
    }]
  },
  {
    path:'/singer',
    component:() => import('components/singer/singer.vue'),
    // 配置子路由
    children:[
    {
      path: ":id",
      component:() => import('components/singer-detail/singer-detail.vue')
    }]
  },
  {
    path:'/rank',
    component:() => import('components/rank/rank.vue'),
    // 配置子路由
    children:[
    {
      path: ":id",
      component:() => import("components/rank-top-list/rank-top-list.vue")
    }]
  },
  {
    path:'/search',
    component:() => import('components/search/search.vue'),
    // 配置子路由
    children:[
    {
      path: ":id",
      component:() => import("components/singer-detail/singer-detail.vue")
    }]
  },
  {
    path:'/user',
    component:() => import("components/user-center/user-center.vue")
  }
   
  ]
  
})
