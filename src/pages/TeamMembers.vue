<template>
  <!-- Loading状态 -->
  <van-loading v-if="loading" type="spinner" color="#1989fa" size="24px">
    加载中...
  </van-loading>
  
  <!-- 正常内容 -->
  <div v-else>
    <van-button v-if="captain === userId" plain type="primary" @click="updateTeam(teamId)"
      >更新队伍
    </van-button>
    <van-card
      class="card"
      v-for="user in userList"
      :key="user.id"
      :title="`${user.userName}  编号:${user.id} `"
      :thumb="user.avatarUrl || '/ava.jpg'"
      size="80px"
    >
      <template #tags>
        <van-tag plain type="warning" v-for="tag in user.tags" :key="tag">
          {{ tag }}
        </van-tag>
      </template>

      <template #footer>
        <div v-if="captain === user.id">队长</div>
<!--      <van-button size="mini">查看</van-button>-->
      </template>
      <br />
    </van-card>

    <van-divider />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, onActivated } from 'vue'
import { getTeamSearchById, getTeamUserList, getUserCurrent } from '@/api/controller'
import { useRoute } from 'vue-router'
import router from '@/config/router.ts'

const userList = ref([])
const route = useRoute()
const teamId = ref(Number(route.params.teamId))
const userId = ref()
const captain = ref()
const loading = ref(false)

const getTeamData = async () => {
  loading.value = true
  try {
    // 清空旧数据，防止显示上一个队伍的信息
    userList.value = []
    captain.value = null
    
    const id = await getUserCurrent()
    userId.value = id.data.data.id
    const response = await getTeamSearchById({ teamId: teamId.value })
    captain.value = response.data.data
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }
    const res = await getTeamUserList({ teamId: teamId.value }, config)
    res.data.data.forEach((user) => {
      user.tags = JSON.parse(user.tags)
    })
    userList.value = res.data.data || []
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await getTeamData()
})

// 监听路由参数变化，当团队ID改变时重新获取数据
watch(() => route.params.teamId, async (newTeamId) => {
  if (newTeamId && Number(newTeamId) !== teamId.value) {
    teamId.value = Number(newTeamId)
    await getTeamData()
  }
}, { immediate: false })

// 当页面从缓存中激活时，检查路由参数是否变化
onActivated(async () => {
  const currentTeamId = Number(route.params.teamId)
  if (currentTeamId !== teamId.value) {
    teamId.value = currentTeamId
    await getTeamData()
  }
})

const updateTeam = async (teamId) => {
  router.push(`/updateTeam/${teamId}`)
}
</script>

<style scoped>
.van-tag {
  margin-right: 2px;
}

.van-card {
  margin-bottom: 30px;
}

.card :deep(.van-tag) {
  background: linear-gradient(45deg, #ff6ec4, #7873f5); /* 粉紫渐变 */
  color: white;
}

.card :deep(.van-card__content) {
  background-color: #f9f9f9; /* 浅灰色背景 */
  border-radius: 10px;
}

.van-card {
  margin-bottom: 30px;
  border: 1px solid #ddd;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 阴影效果 */
}
.card :deep(.van-button--mini) {
  background-color: #ff9900;
  color: white;
}

.card :deep(.van-card__title) {
  color: #007AFF; /* 修改为你喜欢的颜色，如 #e60012 或 #007AFF */
}


</style>
