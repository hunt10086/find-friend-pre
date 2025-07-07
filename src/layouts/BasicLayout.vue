<template>
  <van-nav-bar left-arrow @click-left="onClickLeft" @click-right="onClickRight">
    <template #right>
      <van-icon name="search" size="18" />
    </template>
  </van-nav-bar>
  <div id="content"></div>

  <van-tabbar route @change="onChange">
    <van-tabbar-item to="/" icon="home-o" name="index">主页</van-tabbar-item>
    <van-tabbar-item to="/team" icon="search" name="team">队伍</van-tabbar-item>
    <van-tabbar-item to="/user" icon="friends-o" name="user">个人</van-tabbar-item>
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

const onChange = (index) => showToast(`标签 ${index}`)

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
</style>
