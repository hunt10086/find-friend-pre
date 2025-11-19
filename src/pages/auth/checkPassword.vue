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
import { ref, watch, onActivated } from 'vue'
import { postTeamJoin } from '@/api/controller'
import { useRoute } from 'vue-router'
import { showFailToast, showSuccessToast } from 'vant'
import router from '@/config/router.ts'

const password = ref('')
const team = ref()
const route = useRoute()
const teamId = ref(Number(route.params.teamId))

// 监听路由参数变化，当团队ID改变时更新teamId
watch(() => route.params.teamId, (newTeamId) => {
  if (newTeamId) {
    teamId.value = Number(newTeamId)
    // 清空密码输入框
    password.value = ''
  }
}, { immediate: false })

// 当页面从缓存中激活时，检查路由参数是否变化
onActivated(() => {
  const currentTeamId = Number(route.params.teamId)
  if (currentTeamId !== teamId.value) {
    teamId.value = currentTeamId
    // 清空密码输入框
    password.value = ''
  }
})

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
