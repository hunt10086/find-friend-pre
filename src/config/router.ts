import { createRouter, createWebHistory } from 'vue-router'

import Index from '@/pages/Index.vue'
import Team from '@/pages/Team.vue'
import User from '@/pages/UserPage.vue'
import SearchPages from '@/pages/SearchPages.vue'
import UserEditPages from '@/pages/UserEditPages.vue'
import SearchResultPages from '@/pages/SearchResultPages.vue'
import UserLogin from '@/pages/UserLogin.vue'

const routes = [
  { path: '/', component: Index },
  { path: '/team', component: Team },
  { path: '/user' , component: User},
  { path: '/search',component: SearchPages},
  { path: '/user/edit' , component: UserEditPages},
  { path: '/user/list' , component: SearchResultPages},
  {path:'/user/login' ,component: UserLogin}
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})
export default router
