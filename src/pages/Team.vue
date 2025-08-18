<template>
  <van-search
    v-model="values"
    placeholder="请输入搜索关键词"
    wrap-with-form
    show-action
    @search="onSearch"
    @cancel="onCancel"
  />
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
      <van-button plain type="success" size="mini" @click="joinTeam(team)">加入队伍</van-button>
    </template>
    <br />
    <van-divider />
  </van-card>
  </div>
  <div v-else>
    <van-empty 
      image="https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png"
      description="暂无可加入的队伍"
    >
      <van-button 
        round 
        type="primary" 
        class="bottom-button"
        @click="createTeam"
      >
        创建队伍
      </van-button>
    </van-empty>
  </div>

  <!-- 固定在右下角的按钮 -->
  <van-sticky :offset-bottom="20" position="bottom">
    <van-button
      icon="plus"
      type="primary"
      class="round-button"
      round
      style="position: fixed; right: 20px; bottom: 70px; z-index: 999999999"
      @click="createTeam"
    >
    </van-button>
  </van-sticky>

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
const flag=ref(false)
onMounted(async () => {
  const res = await getTeamList()
  teamList.value = res.data.data || []
  if(teamList.value.length > 0){
    flag.value = true
  }
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
    teamList.value = res.data.data || []
    flag.value = teamList.value.length > 0
    if (teamList.value.length === 0) {
      showFailToast('没有找到该队伍')
    }
  }
}

const onCancel = async () => {
  showToast('取消')
  currentPage.value = 1 // 回到第一页
  const res = await getTeamList({ count: currentPage.value })
  teamList.value = res.data.data || []
  flag.value = teamList.value.length > 0
}

const createTeam = () => {
  router.push('/create')
}

const inTeam = (team) => {
  router.push(`/showMembers/${team.id}`)
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
  background-color: #F5F5DC;
}

#button-css{
  padding-bottom: 50px;
}

.bottom-button {
  width: 160px;
  height: 40px;
}
</style>
