<template>
  <div class="team-chats-page">
    <div class="page-header">
      <van-icon name="arrow-left" class="back-icon" @click="goBack" />
      <h2 class="page-title">队伍聊天列表</h2>
    </div>
    <!-- Loading状态 -->
    <van-loading v-if="loading" type="spinner" color="#1989fa" size="24px"> 加载中... </van-loading>

    <!-- 正常内容 -->
    <div v-else>
      <div v-if="!flag" class="empty-talk-container">
        <van-empty
          image="https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png"
          description="你还没有加入任何队伍，快去加入或创建吧！"
        >
          <van-button round type="primary" class="explore-button" @click="goExplore">
            去探索队伍
          </van-button>
        </van-empty>
      </div>

      <div v-if="flag" class="team-list">
        <div
          class="team-card"
          v-for="(team, index) in teamList"
          :key="team.id"
          :style="{ animationDelay: `${index * 0.05}s` }"
          @click="goToChat(team)"
        >
          <div class="team-main">
            <div class="team-avatar-wrapper">
              <img
                :src="team.icon || '/ava.jpg'"
                :alt="team.teamName"
                class="team-avatar"
                @error="
                  (e: any) => {
                    e.target.src = '/ava.jpg'
                  }
                "
              />
            </div>
            <div class="team-name">{{ team.teamName }}</div>
            <van-tag v-if="team.status !== undefined" type="primary" plain>{{
              team.status === 1 ? '加密' : '公开'
            }}</van-tag>
          </div>
          <div class="team-extra">
            <span class="team-count">{{ team.nowNum }} / {{ team.maxNum }}人</span>
            <van-button
              type="primary"
              size="small"
              round
              class="enter-btn"
              @click.stop="goToChat(team)"
              >聊天</van-button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onActivated } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/api/apiClient'
import { showFailToast } from 'vant'
import dayjs from 'dayjs'

const router = useRouter()
const teamList = ref<any[]>([])
const flag = ref(false)
const loading = ref(false)

const goBack = () => {
  router.push('/talk')
}

const loadTeamData = async () => {
  loading.value = true
  try {
    // 清空旧数据
    teamList.value = []
    flag.value = false

    const res = await api.team.getTeam()
    const rawList = res.data.data || []
    // 只保留有id和teamName的队伍
    teamList.value = rawList.filter((team) => team && team.id && team.teamName)
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

// 去探索队伍
const goExplore = () => {
  router.push('/team')
}

// 简化样式后以上模拟消息/活跃度函数不再需要，保留占位或后续可接真实接口
</script>

<style scoped>
.team-chats-page {
  padding: 12px;
}
.page-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 4px 16px;
}
.back-icon {
  font-size: 24px;
  color: #666;
}
.page-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #323233;
}

/* 列表容器（参考好友列表样式） */
.team-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 12px 20px;
}

/* 单条队伍卡片（简化为方框 + 队伍名） */
.team-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #fff;
  border-radius: 12px;
  padding: 14px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  animation: fadeInUp 0.3s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
  cursor: pointer;
  transition:
    box-shadow 0.25s,
    transform 0.25s;
}

.team-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.team-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 0;
}
.team-avatar-wrapper {
  flex-shrink: 0;
  margin-right: 12px;
}
.team-avatar {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  object-fit: cover;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
  border: 2px solid #f5f5f5;
  background: #fff;
}

.team-name {
  font-size: 16px;
  font-weight: 600;
  color: #323233;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  margin-right: 12px;
}

.team-extra {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.team-count {
  font-size: 12px;
  color: #969799;
}

.enter-btn {
  margin-left: 12px;
}

/* 动画 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.talk-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, #9b59b6 0%, #8e44ad 100%);
}

.talk-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.talk-card-bg {
  position: absolute;
  top: -40%;
  right: -20%;
  width: 160px;
  height: 160px;
  background: radial-gradient(circle, rgba(155, 89, 182, 0.05) 0%, transparent 70%);
  border-radius: 50%;
  z-index: 0;
}

/* 聊天头部 */
.talk-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
  position: relative;
  z-index: 1;
}

.talk-avatar {
  position: relative;
  flex-shrink: 0;
}

.team-logo {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  object-fit: cover;
  border: 2px solid #fff;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.12);
}

.online-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
  border: 2px solid #fff;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.talk-info {
  flex: 1;
}

.talk-title {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 6px 0;
  line-height: 1.3;
}

.talk-status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.member-count {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 12px;
  color: #7f8c8d;
}

.talk-badge {
  position: absolute;
  top: 0;
  right: 0;
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  color: white;
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(231, 76, 60, 0.3);
  animation: pulse-badge 2s infinite;
}

/* 聊天内容 */
.talk-content {
  margin-bottom: 12px;
  position: relative;
  z-index: 1;
}

.last-message,
.no-messages {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #7f8c8d;
  line-height: 1.4;
  margin: 0;
  padding: 8px 12px;
  background: rgba(155, 89, 182, 0.05);
  border-radius: 8px;
  border-left: 3px solid rgba(155, 89, 182, 0.2);
}

.last-message .van-icon,
.no-messages .van-icon {
  font-size: 14px;
  color: #9b59b6;
}

/* 聊天元信息 */
.talk-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  position: relative;
  z-index: 1;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #95a5a6;
}

.meta-item .van-icon {
  font-size: 12px;
}

/* 聊天操作 */
.talk-action {
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 1;
  padding-top: 8px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.talk-action .van-button {
  padding: 6px 20px;
  font-size: 13px;
  border-radius: 18px;
  background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%);
  border: none;
  box-shadow: 0 3px 10px rgba(155, 89, 182, 0.3);
  transition: all 0.2s ease;
}

.talk-action .van-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 5px 15px rgba(155, 89, 182, 0.4);
}

/* 空状态容器 */
.empty-talk-container {
  padding: 60px 20px;
  text-align: center;
}

.explore-button {
  width: 180px;
  height: 44px;
  margin-top: 20px;
  background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%);
  border: none;
  box-shadow: 0 4px 16px rgba(155, 89, 182, 0.3);
}

/* 加载状态 */
.van-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
}

/* 动画效果 */
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes pulse-badge {
  0% {
    box-shadow: 0 2px 8px rgba(231, 76, 60, 0.3);
  }
  50% {
    box-shadow: 0 2px 12px rgba(231, 76, 60, 0.6);
  }
  100% {
    box-shadow: 0 2px 8px rgba(231, 76, 60, 0.3);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .talk-cards-container {
    padding: 0 12px;
  }

  .talk-card {
    padding: 14px;
  }

  .team-logo {
    width: 44px;
    height: 44px;
  }

  .talk-title {
    font-size: 15px;
  }

  .last-message,
  .no-messages {
    font-size: 12px;
    padding: 6px 10px;
  }

  .talk-action .van-button {
    padding: 5px 16px;
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .talk-header {
    gap: 10px;
  }

  .talk-meta {
    flex-direction: column;
    gap: 4px;
    align-items: flex-start;
  }

  .talk-badge {
    top: -4px;
    right: -4px;
  }
}
</style>
