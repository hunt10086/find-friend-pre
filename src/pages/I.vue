<template id="I">
  <!-- 新增 fixed 定位容器 -->
  <div class="logout-container">
    <van-button class="logout-button" type="primary" @click="quit">退出登录</van-button>
  </div>

  <van-cell  title="个人信息" is-link to="/user" />
  <br />
  <van-divider />
  <van-cell title="我加入的队伍" is-link to="/JoinTeam" />
  <br />
  <van-divider />
  <van-cell title="我创建的队伍" is-link to="/myTeam" />
  <br />
  <van-divider />
  <van-cell title="我的博客分享" is-link to="/my/blog" />




</template>

<script setup lang="ts">
import { postUserLogout } from '@/api/controller'
import { showFailToast } from 'vant'
import { useRouter } from 'vue-router'

const router=useRouter();
const quit=async ()=>{
  const res=await postUserLogout();
  if(res.data.code===0){
    showFailToast('退出登录成功');
    router.push('/user/login');
  }else{
    showFailToast('退出登录失败');
  }
}
</script>

<style scoped>
.logout-container {
  position: fixed;
  bottom: 70px;
  right: 20px;
  z-index: 2000; /* 确保按钮在其他内容之上 */
}

.logout-button {
  background-color: #64c8aa; /* 橙色背景 */
  border-color: #64c8aa; /* 橙色边框 */
  color: white; /* 白色文字 */
  border-radius: 20px; /* 圆角按钮 */
  padding: 0 20px; /* 水平内边距 */
}
</style>


