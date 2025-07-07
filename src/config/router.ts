import { createRouter, createWebHistory } from 'vue-router'

import Index from '@/pages/Index.vue'
import Team from '@/pages/Team.vue'
import User from '@/pages/UserPage.vue'
import SearchPages from '@/pages/SearchPages.vue'
import UserEditPages from '@/pages/UserEditPages.vue'
import SearchResultPages from '@/pages/SearchResultPages.vue'
import UserLogin from '@/pages/UserLogin.vue'
import UserRegister from '@/pages/UserRegister.vue'

// const routes = [
//   { path: '/', component: Index , meta: {
//     keepalive:  true
//     }},
//   { path: '/team', component: Team },
//   { path: '/user' , component: User},
//   { path: '/search',component: SearchPages},
//   { path: '/user/edit' , component: UserEditPages},
//   { path: '/user/list' , component: SearchResultPages},
//   {path:'/user/login' ,component: UserLogin,meta:{
//     showNavBar:false
//     }},
//   {path:'/user/register' ,component: UserRegister,meta: {
//     showNavBar:false
//     }}
// ]

const routes = [
  {
    path: '/',
    component: Index,
    meta: { keepAlive: true, showNavBar: true }
  },
  {
    path: '/team',
    component: Team,
    meta: { keepAlive: true,showNavBar: true }
  },
  {
    path: '/user',
    component: User,
    meta: {keepAlive: true, showNavBar: true }
  },
  {
    path: '/search',
    component: SearchPages,
    meta: { keepAlive: true,showNavBar: true }
  },
  {
    path: '/user/edit',
    component: UserEditPages,
    meta: { keepAlive: true,showNavBar: true }
  },
  {
    path: '/user/list',
    component: SearchResultPages,
    meta: { keepAlive: true, showNavBar: true }
  },
  {
    path: '/user/login',
    component: UserLogin,
    meta: { keepAlive: true, showNavBar: false }
  },
  {
    path: '/user/register',
    component: UserRegister,
    meta: { keepAlive: true, showNavBar: false }
  }
]




const router = createRouter({
  history: createWebHistory(),
  routes,
})
export default router
