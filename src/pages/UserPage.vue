<template>
  <div v-if="user">
  <van-cell title="用户ID" :value="user.id" />
  <van-cell
    title="用户名"
    is-link
    to="/user/edit"
    :value="user.userName"
    @click="toEdit('userName', '用户名', user.userName)"
  />
  <van-cell title="账号" :value="user.userAccount" />
  <van-cell
    title="头像地址"
    is-link
    to="/user/edit"
    :value="user.avatarUrl"
    @click="toEdit('avatarUrl', '头像', user.avatarUrl)"
  >
    <img :src="user.avatarUrl" style="height: 50px" />
  </van-cell>

  <van-cell
    title="性别"
    is-link
    to="/user/edit"
    :value="user.gender"
    @click="toEdit('gender', '性别', user.gender)"
  />
  <van-cell
    title="个人简介"
    is-link
    to="/user/edit"
    :value="user.profile"
    @click="toEdit('profile', '个人简介', user.profile)"
  />
  <van-cell
    title="电话"
    is-link
    to="/user/edit"
    :value="user.phone"
    @click="toEdit('phone', '电话', user.phone)"
  />
  <van-cell
    title="邮箱"
    is-link
    to="/user/edit"
    :value="user.email"
    @click="toEdit('email', '邮箱', user.email)"
  />
  <van-cell title="用户状态" :value="user.userStatus" />
  <van-cell title="身份" :value="user.userRole" />
  <van-cell
    title="标签"
    is-link
    to="/user/edit"
    :value="user.tags"
    @click="toEdit('tags', '标签', user.tags)"
  />
  <van-cell title="创建时间" :value="user.createTime" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { getUserCurrent } from '@/api/controller'
import { ref } from 'vue'

const router = useRouter()
// const user = {
//   id: 1,
//   userName: 'fkha',
//   userAccount: 'fajh',
//   avatarUrl: 'https://img.keaitupian.cn/uploads/2020/11/30/1581475563425326.jpg',
//   gender: '男',
//   phone: '10086',
//   profile: 'I am a good boy',
//   email: '2529220@qq.com',
//   userStatus: 0,
//   userRole: 1,
//   tags: 'java',
//   createTime: new Date(),
// }

const user = ref();
const res=await getUserCurrent();
user.value=res.data.data;



const toEdit = (editKey: string, editName: string, currentValue: string) => {
  router.push({ path: '/user/edit', query: { editKey, editName, currentValue } })
}
</script>
<style scoped>
</style>
