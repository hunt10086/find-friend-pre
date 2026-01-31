<template>
  <!-- Loading状态 -->
  <van-loading v-if="loading" type="spinner" color="#1989fa" size="24px">
    加载队伍信息中...
  </van-loading>
  
  <!-- 表单内容 -->
  <van-form v-else label-width="100%" @submit="onSubmit">
    <van-cell-group inset>
      <van-field
        v-model="teamName"
        name="teamName"
        label="更改伍名称"
        placeholder="请更改队伍名称"
        maxlength="32"
        :rules="[{ required: true, message: '请输入队伍名称' }]"
      />
      <van-field
        v-model="description"
        rows="2"
        autosize
        label="留言"
        type="textarea"
        maxlength="256"
        placeholder="请更改队伍描述"
        show-word-limit
      />
      <van-field
        v-model="icon"
        name="icon"
        label="更改队伍头像链接"
        placeholder="请输入链接"
        maxlength="256"
        :rules="[{ required: true, message: '请输入队伍头像链接' }]"
      />
      <br />
      <div>
        <p>更改队伍人数</p>
        <van-stepper v-model="maxNum" min="3" max="15" />
      </div>
      <br />
      <van-radio-group v-model="status" direction="horizontal">
        <van-radio :name="0">公开</van-radio>
        <van-radio :name="1">加密</van-radio>
      </van-radio-group>
      <br />
      <!-- 条件渲染密码输入框 -->
      <van-field
        v-if="status === 1"
        v-model="password"
        type="password"
        name="密码"
        label="密码"
        placeholder="密码"
        :rules="[{ required: true, message: '请填写密码' }]"
      />
    </van-cell-group>
    <div style="margin: 16px">
      <van-button round block type="primary" native-type="submit"> 更新</van-button>
    </div>
  </van-form>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onActivated } from 'vue'
import { getTeamSearchById, getUserCurrent, postTeamUpdate } from '@/api/dist/controller'
import { useRoute, useRouter } from 'vue-router'
import { showFailToast, showSuccessToast } from 'vant'

let teamName = ref('')
const description = ref('')
const icon = ref('')
const userId = ref()
const status = ref(0)
const password = ref('')
const router = useRouter()
const maxNum = ref(3)
let team = ref()
const route = useRoute()
const teamId = ref(Number(route.params.teamId))
const loading = ref(false)

const loadTeamData = async () => {
  loading.value = true
  try {
    // 清空表单数据
    teamName.value = ''
    description.value = ''
    icon.value = ''
    status.value = 0
    password.value = ''
    maxNum.value = 3
    
    // 获取队伍详情并预填充表单
    const teamRes = await getTeamSearchById({ teamId: teamId.value })
    const teamData = teamRes.data.data
    
    if (teamData) {
      // 这里需要根据实际API返回的数据结构调整
      // 假设API返回的是队伍详情对象
      const teamDetails = await getTeamSearchById({ teamId: teamId.value })
      // 注意：这里可能需要调用不同的API来获取完整的队伍信息
      // 暂时使用现有的API结构
    }
  } catch (error) {
    showFailToast('加载队伍信息失败')
  } finally {
    loading.value = false
  }
}

const check = async () => {
  const res = await getUserCurrent()
  userId.value = res.data.data.id
}

onMounted(async () => {
  await check()
  await loadTeamData()
})

// 监听路由参数变化，当团队ID改变时重新加载数据
watch(() => route.params.teamId, async (newTeamId) => {
  if (newTeamId && Number(newTeamId) !== teamId.value) {
    teamId.value = Number(newTeamId)
    await loadTeamData()
  }
}, { immediate: false })

// 当页面从缓存中激活时，检查路由参数是否变化
onActivated(async () => {
  const currentTeamId = Number(route.params.teamId)
  if (currentTeamId !== teamId.value) {
    teamId.value = currentTeamId
    await loadTeamData()
  }
})
const onSubmit = async () => {
  const res = await getTeamSearchById({ teamId: teamId.value })
  const input = {
    id: teamId.value,
    teamName: teamName.value,
    maxNum: maxNum.value,
    description: description.value,
    status: status.value,
    icon: icon.value,
    password: password.value,
  }
  const response = await postTeamUpdate({ id: teamId.value }, input)
  if (response.data.code === 0) {
    showSuccessToast('更新成功')
    // 添加时间戳参数强制刷新列表
    await router.replace({ path: '/myTeam', query: { refresh: Date.now() } })
  } else {
    showFailToast('更新失败')
  }
}

watch(status, (newVal) => {
  if (newVal === 1) {
    // 加密模式开启
  } else {
    // 公开模式
    password.value = '' // 可选：清空密码
  }
})
</script>

<style scoped>
van-field {
  margin-top: 20px;
}
</style>
