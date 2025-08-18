<template>
  <van-empty v-if="!flag" description="还没有加入的队伍" />
  <div v-if="flag">
    <van-card
      class="card"
      v-for="team in teamList"
      :desc="`队伍描述: ${team.description}`"
      :title="` 队伍名:  ${team.teamName} `"
      :thumb="team.icon || '/ava.jpg'"
    >
      <template #tags>
        <van-tag v-if="team.status === 0" plain type="danger">公开</van-tag>
        <van-tag v-if="team.status === 1" plain type="danger">加密</van-tag>
        <div>
          {{team.nowNum}} /  {{team.maxNum }}
          <van-divider />
          创建时间: {{ dayjs(team.createTime).format('YYYY-MM-DD HH:mm:ss') }}
          <van-divider />
          更新时间: {{ dayjs(team.updateTime).format('YYYY-MM-DD HH:mm:ss') }}
        </div>
      </template>

      <template #footer>
        <van-button plain type="success" size="mini" @click="inTeam(team)">查看队伍详情</van-button>
        <van-button plain type="warning" size="mini" @click="quitTeam(team)">退出队伍</van-button>
      </template>
      <van-divider />
    </van-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getTeamJoinTeam, postTeamQuit } from '@/api/controller'
import { useRouter } from 'vue-router'
import { showSuccessToast } from 'vant'
import dayjs from 'dayjs'

const flag = ref(false)
const teamList = ref()
const router = useRouter()

onMounted(async () => {
  const res = await getTeamJoinTeam()
  teamList.value = res.data.data || []
  if (teamList.value.length > 0) {
    flag.value = true
  }
})

const inTeam = (team) => {
  router.push(`/showMembers/${team.id}`)
}

const quitTeam = async (team) => {
  const res = await postTeamQuit({ id: team.id })
  if (res.data.data === true) {
    showSuccessToast('退出队伍成功')
    await router.replace('/Person')
  } else {
    showSuccessToast('退出队伍失败')
  }
}
</script>

<style scoped>
.card {
  padding-bottom: 50px;
}

.van-card {
  --van-card-thumb-size: 80px;
  margin-bottom: 30px;
  background-color: #E6E6FA;
}
</style>
