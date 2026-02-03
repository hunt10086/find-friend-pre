import { createRouter, createWebHistory } from 'vue-router'

import Index from '@/pages/home/Index.vue'
import Team from '@/pages/team/Team.vue'
import User from '@/pages/user/UserPage.vue'
import SearchPages from '@/pages/search/SearchPages.vue'
import UserEditPages from '@/pages/user/UserEditPages.vue'
import SearchResultPages from '@/pages/search/SearchResultPages.vue'
import UserLogin from '@/pages/auth/UserLogin.vue'
import UserRegister from '@/pages/auth/UserRegister.vue'
import JoinTeam from '@/pages/team/JoinTeam.vue'
import I from '@/pages/user/I.vue'
import MyTeam from '@/pages/team/MyTeam.vue'
import CreateTeam from '@/pages/team/CreateTeam.vue'
import TeamMembers from '@/pages/team/TeamMembers.vue'
import UpdateTeam from '@/pages/team/UpdateTeam.vue'
import checkPassword from '@/pages/auth/checkPassword.vue'
import NearUsers from '@/pages/user/nearUsers.vue'
import BlogPage from '@/pages/blog/BlogPage.vue'
import UserBlog from '@/pages/blog/UserBlog.vue'
import CreateBlog from '@/pages/blog/CreateBlog.vue'
import MyBlog from '@/pages/blog/MyBlog.vue'
import Talk from '@/pages/chat/Talk.vue'
import TagEditPage from '@/pages/user/TagEditPage.vue'
import TeamChat from '@/pages/chat/TeamChat.vue'
import FriendsList from '@/pages/chat/FriendsList.vue'
import TeamChats from '@/pages/chat/TeamChats.vue'
import FriendChat from '@/pages/chat/FriendChat.vue'

const routes = [
  {
    path: '/',
    component: Index,
    meta: { keepAlive: true, showNavBar: true },
  },
  {
    path: '/friends',
    component: FriendsList,
    meta: { keepAlive: true, showNavBar: true },
  },
  {
    path: '/team',
    component: Team,
    meta: { keepAlive: true, showNavBar: true },
  },
  {
    path: '/user',
    component: User,
    meta: { keepAlive: true, showNavBar: true },
  },
  {
    path: '/search',
    component: SearchPages,
    meta: { keepAlive: true, showNavBar: true },
  },
  {
    path: '/user/edit',
    component: UserEditPages,
    meta: { keepAlive: true, showNavBar: true },
  },
  {
    path: '/user/list',
    component: SearchResultPages,
    meta: { keepAlive: true, showNavBar: true },
  },
  {
    path: '/user/login',
    component: UserLogin,
    meta: { keepAlive: true, showNavBar: false },
  },
  {
    path: '/user/register',
    component: UserRegister,
    meta: { keepAlive: true, showNavBar: false },
  },
  {
    path: '/JoinTeam',
    component: JoinTeam,
    meta: { keepAlive: true, showNavBar: true },
  },
  {
    path: '/Person',
    component: I,
    meta: { keepAlive: true, showNavBar: true },
  },
  {
    path: '/myTeam',
    component: MyTeam,
    meta: { keepAlive: true, showNavBar: true },
  },
  {
    path: '/create',
    component: CreateTeam,
    meta: { keepAlive: false, showNavBar: true },
  },
  {
    path: '/showMembers/:teamId',
    component: TeamMembers,
    meta: { keepAlive: true, showNavBar: true },
  },
  {
    path: '/updateTeam/:teamId',
    component: UpdateTeam,
    meta: { keepAlive: true, showNavBar: true },
  },
  {
    path: '/check/:teamId',
    component: checkPassword,
    meta: { keepAlive: true, showNavBar: true },
  },
  {
    path: '/nearUsers',
    component: NearUsers,
    meta: { keepAlive: true, showNavBar: true },
  },
  {
    path: '/blog',
    component: BlogPage,
    meta: { keepAlive: true, showNavBar: true },
  },
  {
    path: '/user/blog/:id',
    component: UserBlog,
    meta: { keepAlive: true, showNavBar: true },
  },
  {
    path: '/blog/create',
    component: CreateBlog,
    meta: { keepAlive: false, showNavBar: true },
  },
  {
    path: '/blog/edit/:id',
    component: CreateBlog,
    meta: { keepAlive: false, showNavBar: true },
  },
  {
    path: '/my/blog',
    component: MyBlog,
    meta: { keepAlive: true, showNavBar: true },
  },
  {
    path: '/talk',
    component: Talk,
    meta: { keepAlive: true, showNavBar: true },
  },
  {
    path: '/edit/tags',
    component: TagEditPage,
    meta: { keepAlive: true, showNavBar: true },
  },
  {
    path: '/teamChat/:teamId',
    component: TeamChat,
    meta: { keepAlive: true, showNavBar: false },
  },
  {
    path: '/teamChats',
    component: TeamChats,
    meta: { keepAlive: true, showNavBar: true },
  },
  {
    path: '/friendChat/:friendId',
    component: FriendChat,
    meta: { keepAlive: false, showNavBar: false },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})
export default router
