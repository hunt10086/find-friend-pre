<template>
  <van-nav-bar id="head-css" title="寻找志同道合的伙伴"
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
    <van-tabbar-item to="/Person" icon="user-circle-o" name="个人">个人</van-tabbar-item>
  </van-tabbar>
</template>

<script setup lang="ts">
import router from '@/config/router.ts'

router.getRoutes()
const onClickLeft = () => {
  router.back()
}

const onClickRight = () => {
  router.push('/search')
}

import { showFailToast, showSuccessToast, showToast } from 'vant'
import { getUserCurrent } from '@/api/controller'

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
  width: 100%;
  height: 50px;
  background-color: #fff;
  z-index: 9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999
}

</style>
