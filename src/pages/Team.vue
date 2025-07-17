<template>
  <van-search
    v-model="values"
    placeholder="请输入搜索关键词"
    wrap-with-form
    show-action
    @search="onSearch"
    @cancel="onCancel"
  />
  <van-card
    class="card"
    v-for="team in teamList"
    :desc="`队伍描述: ${team.description}`"
    :title="` 队伍名:  ${team.teamName} `"
    :thumb="team.icon"
  >
    <template #tags>
      <van-tag v-if="team.status === 0" plain type="danger">公开</van-tag>
      <van-tag v-if="team.status === 1" plain type="danger">加密</van-tag>
      <div>
        最大人数: {{ team.maxNum }}
        <van-divider />
        创建时间: {{ dayjs(team.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        <van-divider />
        更新时间: {{ dayjs(team.updateTime).format('YYYY-MM-DD HH:mm:ss') }}
      </div>
    </template>

    <template #footer>
      <van-button plain type="success" size="mini" @click="joinTeam(team)">加入队伍</van-button>
    </template>
    <br />
    <van-divider />
  </van-card>

</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getTeamSearch, postTeamJoin } from '@/api/controller'
import { showSuccessToast, showFailToast, showToast } from 'vant'
import router from '@/config/router.ts'
import dayjs from 'dayjs'
import { getTeamList } from '@/api/controller'

const currentPage = ref(1)
const teamList = ref()
const values = ref('')
onMounted(async () => {
  const res = await getTeamList()
  teamList.value = res.data.data || []
})

const joinTeam = async (team) => {
  if (team.status === 1) {
    await router.push(`/check/${team.id}`)
  } else {
    const res = await postTeamJoin(
      {
        password: team.password,
      },
      team
    )
    if (res.data.code === 0) {
      showSuccessToast('加入成功')
    } else {
      showFailToast('加入失败')
    }
  }
}

const onSearch = async () => {
  const res = await getTeamSearch({ teamName: values.value })
  if (res.data.code === 0) {
    teamList.value = res.data.data
    if (teamList.value.length < 0) {
      showFailToast('没有找到该队伍')
    }
  }
}

const onCancel = async () => {
  showToast('取消')
  currentPage.value = 1 // 回到第一页
  const res = await getTeamList({ count: currentPage.value })
  teamList.value = res.data.data || []
}
</script>

<style scoped>
.custom-text-box {
  padding: 20px;
  margin: 10px;
  background-color: #f0f0f0;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 50%;
}

.text-content {
  font-size: 16px;
  color: #333;
  line-height: 1.5;
}

.pages {
  text-align: center;
}

.van-search {
  padding: 10px;
}

.card-show {
  padding: 10px;
}

.tag {
  margin: 2px;
}

.van-card {
  --van-card-thumb-size: 80px;
  margin-bottom: 30px;
  background-color: #c3eda6;
}

#button-css{
  padding-bottom: 50px;
}
</style>
