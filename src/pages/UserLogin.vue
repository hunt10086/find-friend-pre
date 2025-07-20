<template>
  <div>
    <van-form label-width="100%" @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="userAccount"
          name="userAccount"
          label="用户名"
          placeholder="请输入用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
          v-model="userPassword"
          type="password"
          name="userPassword"
          label="密码"
          placeholder="请输入密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
      </van-cell-group>
      <div style="margin: 16px">
        <van-button round block type="primary" native-type="submit"> 登录</van-button>
      </div>
      <div style="margin: 16px">
        <van-button round block type="primary" @click="Register"> 注册</van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { postUserLogin } from '@/api/controller'
import { showSuccessToast } from 'vant'
import { useRouter } from 'vue-router'

const router = useRouter()
const userAccount = ref('')
const userPassword = ref('')
const latitude = ref(30)
const longitude = ref(120)



const onSubmit = async () => {
  const input = {
    userAccount: userAccount.value,
    userPassword: userPassword.value,
    latitude: latitude.value,
    longitude: longitude.value
  }
  // 请求配置
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  const res = await postUserLogin(input, config)
  if (res.data.code === 0) {
    showSuccessToast('登录成功')
    await router.replace('/')
  } else {
    showSuccessToast('登录失败')
  }

}
const Register = () => {
  router.push('/user/register')
}



</script>

<style scoped></style>
