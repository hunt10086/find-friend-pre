<template>
  <div  v-if="user">
  <van-cell title="用户ID" :value="user?.id" />
  <van-cell
    title="用户名"
    is-link
    to="/user/edit"
    :value="user.userName"
    @click="toEdit('userName', '用户名',  user.userName)"
  />
    <br/>
  <van-cell title="账号" :value="user.userAccount" />
  <van-cell
    title="头像"
    is-link
    to="/user/edit"
    :value="user.avatarUrl"
    @click="toEdit('avatarUrl', '头像地址', user.avatarUrl)"
  >
    <br/>
    <img :src="user.avatarUrl" style="height: 50px" />
  </van-cell>
  <van-cell v-if="user.gender===1"
    title="性别"
    is-link
    to="/user/edit"
    :value="'男'"
    @click="toEdit('gender', '性别', user.gender)"
  />
    <van-cell v-if="user.gender===0"
              title="性别"
              is-link
              to="/user/edit"
              :value="'女'"
              @click="toEdit('gender', '性别', user.gender)"
    />
    <van-cell v-if="user.gender!==1&&user.gender!==0"
              title="性别"
              is-link
              to="/user/edit"
              :value="'未知'"
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
    <br/>
  <van-cell
    title="邮箱"
    is-link
    to="/user/edit"
    :value="user.email"
    @click="toEdit('email', '邮箱', user.email)"
  />
  <van-cell title="用户状态" :value="user.userStatus" />
  <van-cell title="身份" :value="user.userRole" />
    <br/>
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
import { onMounted, ref } from 'vue'
import { showSuccessToast } from 'vant'

const router = useRouter()
const user=ref()
onMounted(async () => {
  const res = await getUserCurrent()
  user.value = res.data.data
  if (user) {
    showSuccessToast('获取用户信息成功')
  } else {
    showSuccessToast('获取用户信息失败')
  }
})

const toEdit = (editKey: string, editName: string, currentValue: string) => {
  router.push({ path: '/user/edit', query: { editKey, editName, currentValue } })
}
</script>
<style scoped></style>
