<template>
  <van-form label-width="100%" @submit="onSubmit">
    <van-cell-group inset>
      <van-field
        v-model="password"
        type="password"
        name="密码"
        label="输入队伍密码"
        placeholder="队伍密码"
        :rules="[{ required: true, message: '请填写队伍密码' }]"
      />
    </van-cell-group>
    <div style="margin: 16px">
      <van-button round block type="primary" native-type="submit"> 确认加入队伍</van-button>
    </div>
  </van-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { postTeamJoin } from '@/api/controller'
import { useRoute } from 'vue-router'
import { showFailToast, showSuccessToast } from 'vant'
import router from '@/config/router.ts'

const password = ref('')
const team = ref()
const route = useRoute()
const teamId = ref(Number(route.params.teamId))
const onSubmit = async () => {
  const input = {
    id: teamId.value,
  }
  const res = await postTeamJoin(
    {
      password: password.value,
    },
    input,
  )
  if (res.data.code === 0) {
    showSuccessToast('加入成功')
    router.push('/Team')
  } else {
    showFailToast('加入失败')
  }
}
</script>

<style scoped></style>
