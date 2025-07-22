<template>
  <van-form label-width="100%" class="Rform" @submit="onSubmit">
    <van-cell-group :inset="false">
      <van-field
        v-model="userAccount"
        name="userAccount"
        label="用户名"
        placeholder="请输入用户名"
        :minlength="4"
        :rules="[{ required: true, message: '请填写不小于4位的用户名' }]"
      />
      <van-field
        v-model="userPassword"
        type="password"
        name="userPassword"
        label="密码"
        placeholder="请输入密码"
        :minlength="8"
        :rules="[{ required: true, message: '密码不小与8位' }]"
      />
      <van-field
        v-model="checkPassword"
        type="password"
        name="checkPassword"
        label="确认密码"
        placeholder="请再次输入密码"
        :minlength="8"
        :rules="[{ required: true, message: '请再次输入密码' }]"
      />
      <div class="email-wrapper">
        <van-field
          v-model="email"
          name="email"
          label="邮箱"
          placeholder="请输入邮箱"
          :rules="[{ required: true, message: '请填写邮箱' }]"
        />
        <van-button
          class="buoo"
          type="primary"
          size="mini"
          @click="SendCode"
          :disabled="countdown > 0"
        >
          {{ countdown > 0 ? `${countdown}s后重发` : '发送验证码' }}
        </van-button>
      </div>
      <van-field
        v-model="code"
        name="code"
        label="验证码"
        placeholder="请输入验证码"
        :rules="[{ required: true, message: '请输入验证码' }]"
      />
    </van-cell-group>
    <div style="margin: 16px">
      <van-button round block type="primary" native-type="submit"> 注册</van-button>
    </div>
  </van-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getUserSendCode, postUserLogin, postUserRegister } from '@/api/controller'
import { showFailToast, showSuccessToast, showToast, Toast } from 'vant'
import { useRouter } from 'vue-router'

const router = useRouter()

const userAccount = ref('')
const userPassword = ref('')
const checkPassword = ref('')
const email = ref('')
const code = ref('')
const countdown = ref(0)

const SendCode = async () => {
  const res = await getUserSendCode({ email: email.value })
  if (res.data.code === 0) {
    showSuccessToast('验证码已发送')
    // 启动倒计时
    countdown.value = 120
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  } else {
    showToast('发送验证码失败')
  }
}

const onSubmit = async () => {
  if(userAccount.value.length < 4){
    showFailToast('用户名长度不能小于4位');
    return;
  }
  if(userPassword.value.length < 8 || checkPassword.value.length < 8){
    showFailToast('密码长度不能小于8位');
    return;
  }
  const input = {
    userAccount: userAccount.value,
    userPassword: userPassword.value,
    checkPassword: checkPassword.value,
    email: email.value,
    code: code.value,
  }
  // 请求配置
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  const res = await postUserRegister(input, config)
  if (res.data.code === 0) {
    showSuccessToast('注册成功')
    await router.replace('/user/login')
  } else {
    showSuccessToast('注册失败')
  }
}
</script>

<style scoped></style>
