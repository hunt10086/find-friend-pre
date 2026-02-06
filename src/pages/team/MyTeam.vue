<template>
  <div v-if="flag" class="my-teams-container">
    <div
      class="team-card"
      v-for="(team, index) in teamList"
      :key="team.id"
      :style="{ animationDelay: `${index * 0.1}s` }"
    >
      <div class="team-header">
        <div class="team-avatar">
          <img :src="team.icon || '/ava.jpg'" :alt="team.teamName" @error="handleImageError" />
        </div>
        <div class="team-info">
          <h3 class="team-name">
            {{ team.teamName }}
            <van-tag type="primary" plain style="margin-left: 8px">我的队伍</van-tag>
          </h3>
          <div class="team-privacy">
            <van-icon
              :name="team.status === 0 ? 'eye-o' : 'lock'"
              :color="team.status === 0 ? '#52c41a' : '#ff4d4f'"
            />
            {{ team.status === 0 ? '公开队伍' : '加密队伍' }}
          </div>
        </div>
      </div>

      <div class="team-content">
        <p class="team-description" v-if="team.description">留言：{{ team.description }}</p>

        <div class="team-stats">
          <div class="stat-item">
            <van-icon name="friends-o" color="#1890ff" />
            <span>成员: {{ team.nowNum || 0 }}/{{ team.maxNum || 0 }}</span>
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{ width: `${((team.nowNum || 0) / (team.maxNum || 1)) * 100}%` }"
              ></div>
            </div>
          </div>
          <div class="time-info">
            <div class="time-item">
              <van-icon name="clock-o" color="#52c41a" />
              创建: {{ dayjs(team.createTime).format('MM-DD HH:mm') }}
            </div>
            <div class="time-item">
              <van-icon name="edit" color="#faad14" />
              更新: {{ dayjs(team.updateTime).format('MM-DD HH:mm') }}
            </div>
          </div>
        </div>
      </div>

      <div class="team-actions">
        <van-button type="primary" size="small" round icon="eye" @click="inTeam(team)">
          查看详情
        </van-button>
        <van-button type="warning" size="small" round icon="sign" @click="quitTeam(team)">
          退出队伍
        </van-button>
        <van-button type="danger" size="small" round icon="delete" @click="delTeam(team)">
          解散队伍
        </van-button>
      </div>
    </div>
  </div>

  <div v-else class="empty-container">
    <van-empty
      image="https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png"
      description="还没有创建队伍"
    >
      <van-button round type="primary" class="create-button" @click="createTeam">
        创建队伍
      </van-button>
    </van-empty>
  </div>

  <div id="blank">
    <van-divider />
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
import { onMounted, ref, onActivated, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { api, type TeamVO } from '@/api/apiClient'
import { showSuccessToast, showConfirmDialog } from 'vant'

const flag = ref(false)
const router = useRouter()
const userId = ref(0)
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime' // 可选插件
dayjs.extend(relativeTime)

const teamList = ref<TeamVO[]>([])

const loadMyTeamData = async () => {
  const res = await api.team.getMyTeam()
  teamList.value = res.data.data || []
  if (teamList.value.length > 0) {
    flag.value = true
  } else {
    flag.value = false
  }
}

onMounted(async () => {
  await loadMyTeamData()
})

// 当页面从缓存中激活时重新获取数据
onActivated(async () => {
  await loadMyTeamData()
})
const inTeam = (team: TeamVO) => {
  router.push(`/showMembers/${team.id}`)
}

const quitTeam = async (team: TeamVO) => {
  try {
    await showConfirmDialog({
      title: '确认退出',
      message: `确定要退出队伍"${team.teamName}"吗？\n若是队长，退出后队长权限将移交给其他成员。`,
    })
    const res = await api.team.quitTeam({ id: team.id })
    if (res.data.data === true) {
      showSuccessToast('退出队伍成功')
      await loadMyTeamData()
    } else {
      showSuccessToast('退出队伍失败')
    }
  } catch {
    // 用户取消操作
  }
}

const delTeam = async (team: TeamVO) => {
  try {
    await showConfirmDialog({
      title: '确认解散',
      message: `确定要解散队伍"${team.teamName}"吗？\n解散后队伍将被销毁且不可恢复。`,
    })
    const res = await api.team.deleteTeam({ id: team.id })
    if (res.data.data === true) {
      showSuccessToast('解散队伍成功')
      await loadMyTeamData()
    } else {
      showSuccessToast('解散队伍失败')
    }
  } catch {
    // 用户取消操作
  }
}

const createTeam = () => {
  router.push('/create')
}

// 图片加载失败处理
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/ava.jpg'
}
</script>

<style scoped>
#blank {
  /* 底部间距已在全局设置，无需重复设置 */
}

/* 我的队伍容器 */
.my-teams-container {
  padding-bottom: 20px;
}

/* 队伍卡片样式 */
.team-card {
  background: linear-gradient(135deg, #e6e6fa 0%, #f5f5dc 100%);
  border: 1px solid #a89f91;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  animation: slideInUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.team-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

/* 队伍头部 */
.team-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
  position: relative;
  z-index: 1;
}

.team-avatar {
  position: relative;
  flex-shrink: 0;
}

.team-avatar img {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  object-fit: cover;
  border: 3px solid #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.team-info {
  flex: 1;
}

.team-name {
  font-size: 18px;
  font-weight: 600;
  color: #003366;
  margin: 0 0 4px 0;
  line-height: 1.3;
  display: flex;
  align-items: center;
}

.team-privacy {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #003366;
  font-weight: 500;
}

.team-privacy .van-icon {
  font-size: 14px;
}

/* 队伍内容 */
.team-content {
  margin-bottom: 16px;
  position: relative;
  z-index: 1;
}

.team-description {
  font-size: 14px;
  color: #4b4b4b;
  line-height: 1.5;
  margin: 0 0 12px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.team-stats {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #003366;
  font-weight: 500;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: #ffffff;
  border-radius: 3px;
  overflow: hidden;
  max-width: 100px;
  border: 1px solid #a89f91;
}

.progress-fill {
  height: 100%;
  background: #9dc183;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.time-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.time-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #95a5a6;
}

.time-item .van-icon {
  font-size: 12px;
}

/* 队伍操作 */
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
  background: #003366;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 51, 102, 0.25);
}

.team-actions .van-button--warning {
  background: #ff7f50;
  color: white;
  box-shadow: 0 4px 12px rgba(255, 127, 80, 0.25);
}

.team-actions .van-button--danger {
  background: #d94f4f;
  color: white;
  box-shadow: 0 4px 12px rgba(217, 79, 79, 0.25);
}

.team-actions .van-button:active {
  transform: scale(0.96);
}

/* 空状态容器 */
.empty-container {
  padding: 60px 20px;
  text-align: center;
}

.create-button {
  width: 140px;
  height: 40px;
  margin-top: 20px;
  background: #003366;
  border: none;
  box-shadow: 0 4px 16px rgba(0, 51, 102, 0.3);
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
  .my-teams-container {
    padding: 0 12px;
  }

  .team-card {
    padding: 16px;
  }

  .team-avatar img {
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

  .team-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .team-stats {
    align-items: center;
  }

  .team-actions {
    align-items: stretch;
  }
}
</style>
