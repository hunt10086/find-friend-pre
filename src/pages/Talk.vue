<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getTeamGetTeam } from '@/api/controller/DuiWuJieKou/getTeamGetTeam.js'
import { showFailToast } from 'vant'

const router = useRouter()
const teamList = ref<any[]>([])
const flag = ref(false)

onMounted(async () => {
  try {
    const res = await getTeamGetTeam()
    const rawList = res.data.data || []
    // 只保留有id和teamName的队伍
    teamList.value = rawList.filter(team => team && team.id && team.teamName)
    flag.value = teamList.value.length > 0
  } catch (e) {
    showFailToast('获取队伍失败')
  }
})

const goToChat = (team: any) => {
  router.push(`/teamChat/${team.id}`)
}
</script>

<template>
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
      :thumb="team.icon"
    >
      <template #tags>
        <van-tag v-if="team.status === 0" plain type="danger">公开</van-tag>
        <van-tag v-if="team.status === 1" plain type="danger">加密</van-tag>
        <div>
          {{ team.nowNum }} / {{ team.maxNum }}
          <van-divider />
          创建时间: {{ team.createTime }}
          <van-divider />
          更新时间: {{ team.updateTime }}
        </div>
      </template>
      <template #footer>
        <van-button plain type="primary" size="mini" @click="goToChat(team)">进入聊天</van-button>
      </template>
      <van-divider />
    </van-card>
  </div>
</template>

<style scoped>
.van-card {
  --van-card-thumb-size: 80px;
  margin-bottom: 30px;
  background-color: #E6E6FA;
}
</style>
