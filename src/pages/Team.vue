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
          <img
            :src="team.icon || '/ava.jpg'"
            :alt="team.teamName"
            class="team-avatar"
          />
          <div class="team-status" :class="{ 'private': team.status === 1 }">
            <van-icon :name="team.status === 1 ? 'lock' : 'eye-o'" />
          </div>
        </div>
        <div class="team-info">
          <h3 class="team-name">{{ team.teamName }}</h3>
          <div class="team-meta">
            <van-tag
              :type="team.status === 1 ? 'warning' : 'success'"
              size="small"
              plain
            >
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
        <p class="team-description" v-if="team.description">
          {{ team.description }}
        </p>

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
        <van-button
          type="primary"
          size="small"
          round
          icon="contact"
          @click="inTeam(team)"
        >
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
      style="position: fixed; right: 20px; bottom: 120px; z-index: 999;"
      @click="createTeam"
    >
    </van-button>
  </van-sticky>
</template>

<script setup lang="ts">
import { onMounted, ref, onActivated } from 'vue'
import { getTeamSearch, postTeamJoin } from '@/api/controller'
import { showSuccessToast, showFailToast, showToast } from 'vant'
import router from '@/config/router.ts'
import dayjs from 'dayjs'
import { getTeamList } from '@/api/controller'

const currentPage = ref(1)
const teamList = ref()
const values = ref('')
const flag=ref(false)

const loadTeamList = async () => {
  const res = await getTeamList()
  teamList.value = res.data.data || []
  if(teamList.value.length > 0){
    flag.value = true
  } else {
    flag.value = false
  }
}

onMounted(async () => {
  await loadTeamList()
})

// 当页面从缓存中激活时重新获取数据
onActivated(async () => {
  await loadTeamList()
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

// 格式化时间
const formatTime = (time: string) => {
  return dayjs(time).format('MM-DD HH:mm')
}
</script>

<style scoped>
/* 搜索栏样式 */
.team-search {
  padding: 12px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.team-search :deep(.van-search__content) {
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.9);
}

/* 团队卡片容器 */
.team-cards-container {
  padding: 0 16px;
  margin-bottom: 20px;
}

/* 团队卡片样式 */
.team-card {
  background: linear-gradient(135deg, #ffffff 0%, #f0fff4 100%);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
  animation: bounceIn 0.6s ease-out forwards;
  opacity: 0;
  transform: scale(0.9);
  transition: all 0.3s ease;
}

.team-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #00d2d3 0%, #01a3a4 100%);
}

.team-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.team-card-bg {
  position: absolute;
  top: -30%;
  right: -15%;
  width: 180px;
  height: 180px;
  background: radial-gradient(circle, rgba(0, 210, 211, 0.05) 0%, transparent 70%);
  border-radius: 50%;
  z-index: 0;
}

/* 团队头部 */
.team-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
  position: relative;
  z-index: 1;
}

.team-icon {
  position: relative;
  flex-shrink: 0;
}

.team-avatar {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  object-fit: cover;
  border: 3px solid #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.team-status {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  background: linear-gradient(135deg, #00d2d3 0%, #01a3a4 100%);
  color: white;
  border: 2px solid #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.team-status.private {
  background: linear-gradient(135deg, #ffa502 0%, #ff6348 100%);
}

.team-info {
  flex: 1;
}

.team-name {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.team-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.team-members {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #7f8c8d;
  font-weight: 500;
}

/* 团队内容 */
.team-content {
  margin-bottom: 16px;
  position: relative;
  z-index: 1;
}

.team-description {
  font-size: 14px;
  color: #7f8c8d;
  line-height: 1.5;
  margin: 0 0 16px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.team-progress {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.progress-label {
  font-size: 12px;
  color: #95a5a6;
  min-width: 60px;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background-color: rgba(0, 210, 211, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #00d2d3 0%, #01a3a4 100%);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: #01a3a4;
  font-weight: 600;
  min-width: 40px;
  text-align: right;
}

.team-time {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.time-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #95a5a6;
}

.time-item .van-icon {
  font-size: 12px;
}

/* 团队操作 */
.team-actions {
  display: flex;
  gap: 12px;
  position: relative;
  z-index: 1;
  padding-top: 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.team-actions .van-button {
  flex: 1;
  padding: 8px 16px;
  font-size: 13px;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.team-actions .van-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.team-actions .van-button:disabled {
  opacity: 0.6;
  transform: none;
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
  background: linear-gradient(135deg, #00d2d3 0%, #01a3a4 100%);
  border: none;
  box-shadow: 0 4px 16px rgba(0, 210, 211, 0.3);
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
