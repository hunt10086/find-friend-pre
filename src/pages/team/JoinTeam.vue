<template>
  <div v-if="flag" class="joined-teams-container">
    <div
      class="joined-team-card"
      v-for="(team, index) in teamList"
      :key="team.id"
      :style="{ animationDelay: `${index * 0.1}s` }"
    >
      <div class="joined-team-header">
        <div class="joined-team-avatar">
          <img :src="team.icon || '/ava.jpg'" :alt="team.teamName" @error="handleImageError" />
        </div>
        <div class="joined-team-info">
          <h3 class="joined-team-name">{{ team.teamName }}</h3>
          <div class="joined-team-privacy">
            <van-icon
              :name="team.status === 0 ? 'eye-o' : 'lock'"
              :color="team.status === 0 ? '#52c41a' : '#ff4d4f'"
            />
            {{ team.status === 0 ? '公开队伍' : '加密队伍' }}
          </div>
        </div>
      </div>

      <div class="joined-team-content">
        <p class="joined-team-description" v-if="team.description">留言：{{ team.description }}</p>

        <div class="joined-team-stats">
          <div class="joined-stat-item">
            <van-icon name="friends-o" color="#52c41a" />
            <span>成员: {{ team.nowNum }}/{{ team.maxNum }}</span>
            <div class="joined-progress-bar">
              <div
                class="joined-progress-fill"
                :style="{ width: `${(team.nowNum / team.maxNum) * 100}%` }"
              ></div>
            </div>
          </div>
          <div class="joined-time-info">
            <div class="joined-time-item">
              <van-icon name="clock-o" color="#1890ff" />
              创建: {{ dayjs(team.createTime).format('MM-DD HH:mm') }}
            </div>
            <div class="joined-time-item">
              <van-icon name="edit" color="#faad14" />
              更新: {{ dayjs(team.updateTime).format('MM-DD HH:mm') }}
            </div>
          </div>
        </div>
      </div>

      <div class="joined-team-actions">
        <van-button type="primary" size="small" round icon="eye" @click="inTeam(team)">
          查看详情
        </van-button>
        <van-button type="warning" size="small" round icon="sign" @click="quitTeam(team)">
          退出队伍
        </van-button>
      </div>

      <div class="joined-team-card-bg"></div>
    </div>
  </div>

  <div v-else class="joined-empty-container">
    <van-empty
      image="https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png"
      description="还没有加入的队伍"
    />
  </div>

  <div id="blank">
    <van-divider />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onActivated } from 'vue'
import { api } from '@/api/apiClient'
import { useRouter } from 'vue-router'
import { showSuccessToast, showConfirmDialog } from 'vant'
import dayjs from 'dayjs'

const flag = ref(false)
const teamList = ref()
const router = useRouter()

const loadTeamData = async () => {
  const response = await api.team.getJoinTeam()
  teamList.value = response.data.data || []
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

const inTeam = (team) => {
  router.push(`/showMembers/${team.id}`)
}

const quitTeam = async (team) => {
  try {
    await showConfirmDialog({
      title: '确认退出',
      message: `确定要退出队伍"${team.teamName}"吗？`,
    })
    const res = await api.team.quitTeam({ id: team.id })
    if (res.data.data === true) {
      showSuccessToast('退出队伍成功')
      await router.replace('/Person')
    } else {
      showSuccessToast('退出队伍失败')
    }
  } catch {
    // 用户取消操作
  }
}

// 图片加载失败处理
const handleImageError = (event) => {
  const img = event.target
  img.src = '/ava.jpg'
}
</script>

<style scoped>
#blank {
  /* 底部间距已在全局设置，无需重复设置 */
}

/* 加入的队伍容器 */
.joined-teams-container {
  padding-bottom: 20px;
}

/* 加入的队伍卡片样式 */
.joined-team-card {
  background: linear-gradient(135deg, #e6e6fa 0%, #f5f5dc 100%);
  border: 1px solid #a89f91;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 8px 24px rgba(149, 157, 165, 0.1);
  animation: slideInUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.3s ease;
  position: relative;
  overflow: visible;
}

.joined-team-card::before {
  display: none;
}

.joined-team-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(149, 157, 165, 0.15);
}

.joined-team-card-bg {
  display: none;
}

/* 加入的队伍头部 */
.joined-team-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
  position: relative;
  z-index: 1;
}

.joined-team-avatar {
  position: relative;
  flex-shrink: 0;
}

.joined-team-avatar img {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  object-fit: cover;
  border: 3px solid #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.joined-team-info {
  flex: 1;
}

.joined-team-name {
  font-size: 18px;
  font-weight: 600;
  color: #003366;
  margin: 0 0 4px 0;
  line-height: 1.3;
}

.joined-team-privacy {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #003366;
  font-weight: 500;
}

.joined-team-privacy .van-icon {
  font-size: 14px;
}

/* 加入的队伍内容 */
.joined-team-content {
  margin-bottom: 16px;
  position: relative;
  z-index: 1;
}

.joined-team-description {
  font-size: 14px;
  color: #4b4b4b;
  line-height: 1.5;
  margin: 0 0 12px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.joined-team-stats {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.joined-stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #003366;
  font-weight: 500;
}

.joined-progress-bar {
  flex: 1;
  height: 6px;
  background: #ffffff;
  border: 1px solid #a89f91;
  border-radius: 3px;
  overflow: hidden;
  max-width: 100px;
}

.joined-progress-fill {
  height: 100%;
  background: #9dc183;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.joined-time-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.joined-time-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #95a5a6;
}

.joined-time-item .van-icon {
  font-size: 12px;
}

/* 加入的队伍操作 */
.joined-team-actions {
  display: flex;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #f7f8fa;
}

.joined-team-actions .van-button {
  flex: 1;
  height: 36px;
  padding: 0;
  font-size: 14px;
  border-radius: 18px;
  font-weight: 500;
  border: none;
  transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.joined-team-actions .van-button--primary {
  background: #003366;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 51, 102, 0.25);
}

.joined-team-actions .van-button--warning {
  background: #ff7f50;
  color: white;
  box-shadow: 0 4px 12px rgba(255, 127, 80, 0.25);
}

.joined-team-actions .van-button:active {
  transform: scale(0.96);
}

/* 空状态容器 */
.joined-empty-container {
  padding: 60px 20px;
  text-align: center;
}

/* 动画效果 */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .joined-teams-container {
    padding: 0 12px;
  }

  .joined-team-card {
    padding: 16px;
  }

  .joined-team-avatar img {
    width: 56px;
    height: 56px;
  }

  .joined-team-name {
    font-size: 16px;
  }

  .joined-team-description {
    font-size: 13px;
  }

  .joined-team-actions {
    flex-direction: column;
    gap: 8px;
  }
}

@media (max-width: 480px) {
  .joined-team-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 12px;
  }

  .joined-team-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .joined-team-stats {
    align-items: center;
  }

  .joined-team-actions {
    align-items: stretch;
  }
}
</style>
