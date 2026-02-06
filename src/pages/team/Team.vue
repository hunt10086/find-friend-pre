<template>
  <van-search
    v-model="values"
    placeholder="请输入搜索关键词"
    wrap-with-form
    show-action
    @search="onSearch"
    @cancel="onCancel"
    class="team-search"
  />

  <div v-if="flag" class="team-cards-container">
    <div
      class="team-card"
      v-for="(team, index) in teamList"
      :key="team.id"
      :style="{ animationDelay: `${index * 0.1}s` }"
    >
      <div class="team-header">
        <div class="team-icon">
          <img :src="team.icon || '/ava.jpg'" :alt="team.teamName" class="team-avatar" />
          <div class="team-status" :class="{ private: team.status === 1 }">
            <van-icon :name="team.status === 1 ? 'lock' : 'eye-o'" />
          </div>
        </div>
        <div class="team-info">
          <h3 class="team-name">{{ team.teamName }}</h3>
          <div class="team-meta">
            <van-tag :type="team.status === 1 ? 'warning' : 'success'" size="small" plain>
              {{ team.status === 1 ? '加密' : '公开' }}
            </van-tag>
            <span class="team-members">
              <van-icon name="friends-o" />
              {{ team.nowNum }}/{{ team.maxNum }}
            </span>
          </div>
        </div>
      </div>

      <div class="team-content">
        <p class="team-description" v-if="team.description">留言：{{ team.description }}</p>

        <div class="team-progress">
          <div class="progress-label">队伍进度</div>
          <div class="progress-bar">
            <div
              class="progress-fill"
              :style="{ width: `${(team.nowNum / team.maxNum) * 100}%` }"
            ></div>
          </div>
          <span class="progress-text">{{ team.nowNum }}/{{ team.maxNum }}</span>
        </div>

        <div class="team-time">
          <div class="time-item">
            <van-icon name="clock-o" />
            <span>创建: {{ formatTime(team.createTime) }}</span>
          </div>
          <div class="time-item">
            <van-icon name="replay" />
            <span>更新: {{ formatTime(team.updateTime) }}</span>
          </div>
        </div>
      </div>

      <div class="team-actions">
        <van-button type="primary" size="small" round icon="contact" @click="inTeam(team)">
          查看详情
        </van-button>
        <van-button
          type="success"
          size="small"
          round
          icon="plus"
          @click="joinTeam(team)"
          :disabled="team.nowNum >= team.maxNum"
        >
          {{ team.nowNum >= team.maxNum ? '已满员' : '加入队伍' }}
        </van-button>
      </div>

      <div class="team-card-bg"></div>
    </div>
  </div>

  <div v-else class="empty-container">
    <van-empty
      image="https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png"
      description="暂无可加入的队伍"
    >
      <van-button round type="primary" class="bottom-button" @click="createTeam">
        创建队伍
      </van-button>
    </van-empty>
  </div>

  <!-- 固定在右下角的按钮 -->
  <van-button
    icon="plus"
    type="primary"
    class="round-button floating-action-button"
    round
    @click="createTeam"
  >
  </van-button>
</template>

<script setup lang="ts">
import { onMounted, ref, onActivated } from 'vue'
import { api } from '@/api/apiClient'
import { showSuccessToast, showFailToast, showToast } from 'vant'
import router from '@/config/router.ts'
import dayjs from 'dayjs'

const currentPage = ref(1)
const teamList = ref()
const values = ref('')
const flag = ref(false)

const loadTeamData = async () => {
  const res = await api.team.listTeam()
  teamList.value = res.data.data || []
  if (teamList.value.length > 0) {
    flag.value = true
  } else {
    flag.value = false
  }
}

onMounted(async () => {
  await loadTeamData()
})

// 当页面从缓存中激活时重新获取数据
onActivated(async () => {
  await loadTeamData()
})

const joinTeam = async (team) => {
  if (team.status === 1) {
    await router.push(`/check/${team.id}`)
  } else {
    const res = await api.team.joinTeam(
      {
        password: team.password || '',
      },
      team,
    )
    if (res.data.code === 0) {
      showSuccessToast('加入成功')
      await loadTeamData()
    } else {
      showFailToast('加入失败')
    }
  }
}

const onSearch = async () => {
  const res = await api.team.searchTeam({ teamName: values.value })
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
  await loadTeamData()
}

const createTeam = () => {
  router.push('/create')
}

const inTeam = (team) => {
  router.push(`/showMembers/${team.id}`)
}

// 格式化时间
const formatTime = (time: string) => {
  return dayjs(time).format('MM-DD HH:mm')
}
</script>

<style scoped>
/* 搜索栏样式 */
.team-search {
  padding: 12px 16px;
  background: white;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 12px rgba(100, 100, 100, 0.03);
}

.team-search :deep(.van-search__content) {
  border-radius: 24px;
  background-color: #faf0e6;
  border: 1px solid #a89f91;
  box-shadow: none;
}

/* 团队卡片容器 */
.team-cards-container {
  padding: 0 16px;
  margin-bottom: 20px;
}

/* 团队卡片样式 */
.team-card {
  background: linear-gradient(135deg, #ffffff 0%, #f5f5dc 100%);
  border: 1px solid #a89f91;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 8px 24px rgba(149, 157, 165, 0.1);
  animation: bounceIn 0.6s ease-out forwards;
  opacity: 0;
  transform: scale(0.9);
  transition: all 0.3s ease;
  position: relative;
  overflow: visible;
}

.team-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(149, 157, 165, 0.15);
}

/* 移除多余的装饰元素 */
.team-card::before {
  display: none; /* 移除顶部彩色条 */
}

.team-card-bg {
  display: none; /* 移除背景装饰圆圈 */
}

/* 团队头部 */
.team-header {
  display: flex;
  align-items: flex-start;
  gap: 12px; /* 减少间距 */
  margin-bottom: 12px;
}

.team-icon {
  position: relative;
  flex-shrink: 0;
}

.team-avatar {
  width: 56px;
  height: 56px;
  border-radius: 8px;
  object-fit: cover;
  border: 2px solid #f0f0f0; /* 更简约的边框 */
}

.team-status {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  background: #003366; /* 深蓝色 */
  color: white;
  border: 1px solid white;
}

.team-status.private {
  background: #d94f4f; /* 深红色 */
}

.team-info {
  flex: 1;
}

.team-name {
  font-size: 16px;
  font-weight: 600;
  color: #003366; /* 深蓝色 */
  margin: 0 0 6px 0;
  line-height: 1.3;
}

.team-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.team-members {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #4b4b4b; /* 深灰色 */
}

/* 团队内容 */
.team-content {
  margin-bottom: 12px;
}

.team-description {
  font-size: 13px;
  color: #4b4b4b; /* 深灰色 */
  line-height: 1.5;
  margin: 0 0 12px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.team-progress {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.progress-label {
  font-size: 11px;
  color: #4b4b4b; /* 深灰色 */
  min-width: 50px;
}

.progress-bar {
  flex: 1;
  height: 4px;
  background-color: #f0f0f0; /* 更简约的背景色 */
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #9dc183; /* 自然绿 */
  border-radius: 2px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 11px;
  color: #9dc183; /* 自然绿 */
  font-weight: 500;
  min-width: 35px;
  text-align: right;
}

.team-time {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.time-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #4b4b4b; /* 深灰色 */
}

.time-item .van-icon {
  font-size: 11px;
}

/* 团队操作 */
.team-actions {
  display: flex;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #f7f8fa;
}

.team-actions .van-button {
  flex: 1;
  height: 36px;
  padding: 0;
  font-size: 14px;
  border-radius: 18px;
  font-weight: 500;
  border: none;
  transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.team-actions .van-button--primary {
  background: #003366; /* 深蓝色 */
  color: white;
  box-shadow: 0 4px 12px rgba(0, 51, 102, 0.25);
}

.team-actions .van-button--success {
  background: linear-gradient(135deg, #ff7f50 0%, #d94f4f 100%); /* 珊瑚色到深红 */
  color: white;
  box-shadow: 0 4px 12px rgba(217, 79, 79, 0.25);
}

.team-actions .van-button:active {
  transform: scale(0.96);
}

.team-actions .van-button:disabled {
  background: #f5f5f5;
  color: #ccc;
  box-shadow: none;
  opacity: 1;
}

/* 空状态容器 */
.empty-container {
  padding: 40px 20px;
  text-align: center;
}

.bottom-button {
  width: 160px;
  height: 40px;
  margin-top: 20px;
  background: #003366; /* 深蓝色 */
  border: none;
  box-shadow: 0 4px 16px rgba(0, 51, 102, 0.3);
}

/* 动画效果 */
@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  50% {
    opacity: 1;
    transform: scale(1.02);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .team-cards-container {
    padding: 0 12px;
  }

  .team-card {
    padding: 16px;
  }

  .team-avatar {
    width: 56px;
    height: 56px;
  }

  .team-name {
    font-size: 16px;
  }

  .team-description {
    font-size: 13px;
  }

  .team-actions {
    flex-direction: column;
    gap: 8px;
  }
}

@media (max-width: 480px) {
  .team-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 12px;
  }

  .team-meta {
    justify-content: center;
  }

  .team-time {
    align-items: center;
  }

  .time-item {
    justify-content: center;
  }
}
</style>
