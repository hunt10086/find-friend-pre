<template>
  <van-form @submit="onSubmit">
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
      <van-button round block type="primary" native-type="submit"> 登录 </van-button>
    </div>
  </van-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { postUserLogin } from '@/api/controller'
import { showSuccessToast, showToast, Toast } from 'vant'
import { useRouter } from 'vue-router'

const router = useRouter();

const userAccount = ref('')
const userPassword = ref('')

const onSubmit = async () => {
  const input = {
    userAccount: userAccount.value,
    userPassword: userPassword.value
  };
//todo 登录页不应该包含通用布局
// 请求配置
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const res=await postUserLogin(input, config);
  if(res.data.code===0){
    showSuccessToast('登录成功');
    router.replace("/");
  }else{
    showSuccessToast('登录失败');
  }
}




</script>

<style scoped></style>
