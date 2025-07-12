import { createRouter, createWebHistory } from 'vue-router'

import Index from '@/pages/Index.vue'
import Team from '@/pages/Team.vue'
import User from '@/pages/UserPage.vue'
import SearchPages from '@/pages/SearchPages.vue'
import UserEditPages from '@/pages/UserEditPages.vue'
import SearchResultPages from '@/pages/SearchResultPages.vue'
import UserLogin from '@/pages/UserLogin.vue'
import UserRegister from '@/pages/UserRegister.vue'
import JoinTeam from '@/pages/JoinTeam.vue'
import I from '@/pages/I.vue'
import MyTeam from '@/pages/MyTeam.vue'
import CreateTeam from '@/pages/CreateTeam.vue'
import TeamMembers from '@/pages/TeamMembers.vue'
import UpdateTeam from '@/pages/UpdateTeam.vue'

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
  },
  {
    path: '/JoinTeam',
    component: JoinTeam,
    meta: { keepAlive: true, showNavBar: true }
  },
  {
    path: '/Person',
    component: I,
    meta: { keepAlive: true, showNavBar: true }
  },
  {
    path: '/myTeam',
    component: MyTeam,
    meta: { keepAlive: true, showNavBar: true }
  },
  {
    path: '/create',
    component: CreateTeam,
    meta: { keepAlive: true, showNavBar: true }
  },
  {
    path: '/showMembers/:teamId',
    component: TeamMembers,
    meta: { keepAlive: true, showNavBar: true }
  },
  {
    path: '/updateTeam/:teamId',
    component: UpdateTeam,
    meta: { keepAlive: true, showNavBar: true }
  }
]




const router = createRouter({
  history: createWebHistory(),
  routes,
})
export default router
