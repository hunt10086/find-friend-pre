<template>
  <van-nav-bar id="head-css" :title="pageTitle"
    left-arrow @click-left="onClickLeft" @click-right="onClickRight">
    <template #right>
      <van-icon name="search" size="18" />
    </template>
  </van-nav-bar>
  <van-notice-bar left-icon="volume-o"  scrollable text="交友需谨慎，以防上当受骗,希望你能找到合适的伙伴" />
  <van-tabbar id="footer" route @change="onChange">
    <van-tabbar-item to="/" icon="home-o" name="主页">主页</van-tabbar-item>
    <van-tabbar-item to="/blog" icon="description" name="分享">分享</van-tabbar-item>
    <van-tabbar-item to="/team" icon="search" name="队伍大厅">队伍大厅</van-tabbar-item>
    <van-tabbar-item to="/talk" icon="envelop-o" name="交流">交流</van-tabbar-item>
    <van-tabbar-item to="/Person" icon="user-circle-o" name="个人">个人</van-tabbar-item>
  </van-tabbar>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/config/router.ts'

const route = useRoute()
const pageTitle = ref('寻找志同道合的伙伴')

const titleMap: Record<string, string> = {
  '/': '主页',
  '/blog': '分享',
  '/team': '队伍大厅',
  '/talk': '交流',
  '/Person': '个人',
  '/myTeam': '我的队伍',
  '/create': '创建队伍',
  '/showMembers': '队伍成员',
  '/updateTeam': '更新队伍',
  '/check': '验证密码',
  '/nearUsers': '附近用户',
  '/user': '用户中心',
  '/user/edit': '编辑资料',
  '/user/list': '用户列表',
  '/user/login': '登录',
  '/user/register': '注册',
  '/search': '搜索',
  '/blog/create': '发布分享',
  '/my/blog': '我的分享',
  '/user/blog': '用户分享',
  '/edit/tags': '标签管理',
  '/teamChat': '队伍聊天',
}

function getTitleByRoute(routePath: string) {
  // 按key长度降序排序，优先匹配更长的key
  const sortedKeys = Object.keys(titleMap).sort((a, b) => b.length - a.length)
  for (const key of sortedKeys) {
    if (routePath.startsWith(key)) {
      return titleMap[key]
    }
  }
  return '寻找志同道合的伙伴'
}

watch(
  () => route.path,
  (newPath) => {
    pageTitle.value = getTitleByRoute(newPath)
  },
  { immediate: true }
)

const onClickLeft = () => {
  router.back()
}

const onClickRight = () => {
  router.push('/search')
}

import { showFailToast, showSuccessToast, showToast } from 'vant'
import { getUserCurrent } from '@/api/dist/controller'

const onChange = (index) => showToast(`${index}`)

const fun=async()=> {
  const res=await getUserCurrent();
  if(res.data.code===40100){
    await router.push('/user/login');
    showFailToast("请先登录");
  }else{
    showSuccessToast("登录成功");
  }
}
fun();

</script>

<style scoped>
#footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  background-color: #fff;
  border-top: 1px solid #ebedf0;
  z-index: 1000;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
}

</style>
