<template>
  <!-- Loading状态 -->
  <van-loading v-if="loading" type="spinner" color="#1989fa" size="24px">
    加载中...
  </van-loading>
  
  <!-- 正常内容 -->
  <div v-else>
    <div v-if="!flag">
      <van-empty description="你还没有加入任何队伍，快去加入或创建吧！" />
    </div>
    <div v-if="flag">
      <van-card
        class="card"
        v-for="team in teamList"
        :key="team.id"
        :desc="`队伍描述: ${team.description}`"
        :title="`队伍名:  ${team.teamName}`"
        :thumb="team.icon || '/ava.jpg'"
      >
        <template #tags>
          <van-tag v-if="team.status === 0" plain type="danger">公开</van-tag>
          <van-tag v-if="team.status === 1" plain type="danger">加密</van-tag>
          <div>
            {{ team.nowNum }} / {{ team.maxNum }}
            <van-divider />
            创建时间: {{ dayjs(team.createTime).format('YYYY-MM-DD HH:mm:ss') }}
            <van-divider />
            更新时间: {{ dayjs(team.updateTime).format('YYYY-MM-DD HH:mm:ss') }}
          </div>
        </template>
        <template #footer>
          <van-button plain type="primary" size="mini" @click="goToChat(team)">进入聊天</van-button>
        </template>
        <van-divider />
      </van-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onActivated } from 'vue'
import { useRouter } from 'vue-router'
import { getTeamGetTeam } from '@/api/controller/DuiWuJieKou/getTeamGetTeam.js'
import { showFailToast } from 'vant'
import dayjs from 'dayjs'

const router = useRouter()
const teamList = ref<any[]>([])
const flag = ref(false)
const loading = ref(false)

const loadTeamData = async () => {
  loading.value = true
  try {
    // 清空旧数据
    teamList.value = []
    flag.value = false
    
    const res = await getTeamGetTeam()
    const rawList = res.data.data || []
    // 只保留有id和teamName的队伍
    teamList.value = rawList.filter(team => team && team.id && team.teamName)
    flag.value = teamList.value.length > 0
  } catch (e) {
    showFailToast('获取队伍失败')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadTeamData()
})

// 当页面从缓存中激活时重新获取数据
onActivated(async () => {
  await loadTeamData()
})

const goToChat = (team: any) => {
  router.push(`/teamChat/${team.id}`)
}
</script>



<style scoped>
.van-card {
  --van-card-thumb-size: 80px;
  margin-bottom: 30px;
  background-color: #E6E6FA;
}
</style>
