<template>
  <!-- Loading状态 -->
  <van-loading v-if="loading" type="spinner" color="#1989fa" size="24px">
    加载中...
  </van-loading>

  <!-- 正常内容 -->
  <div v-else>
    <div v-if="!flag" class="empty-talk-container">
      <van-empty
        image="https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png"
        description="你还没有加入任何队伍，快去加入或创建吧！"
      >
        <van-button
          round
          type="primary"
          class="explore-button"
          @click="goExplore"
        >
          去探索队伍
        </van-button>
      </van-empty>
    </div>

    <div v-if="flag" class="talk-cards-container">
      <div
        class="talk-card"
        v-for="(team, index) in teamList"
        :key="team.id"
        :style="{ animationDelay: `${index * 0.1}s` }"
        @click="goToChat(team)"
      >
        <div class="talk-header">
          <div class="talk-avatar">
            <img
              :src="team.icon || '/ava.jpg'"
              :alt="team.teamName"
              class="team-logo"
            />
            <div class="online-indicator"></div>
          </div>
          <div class="talk-info">
            <h3 class="talk-title">{{ team.teamName }}</h3>
            <div class="talk-status">
              <van-tag
                :type="team.status === 1 ? 'warning' : 'success'"
                size="small"
                plain
              >
                {{ team.status === 1 ? '加密' : '公开' }}
              </van-tag>
              <span class="member-count">
                <van-icon name="friends-o" />
                {{ team.nowNum }}人
              </span>
            </div>
          </div>
          <div class="talk-badge" v-if="hasNewMessages(team)">
            <span class="badge-count">{{ getNewMessageCount(team) }}</span>
          </div>
        </div>

        <div class="talk-content">
          <p class="last-message" v-if="getLastMessage(team)">
            <van-icon name="chat-o" />
            {{ getLastMessage(team) }}
          </p>
          <p class="no-messages" v-else>
            <van-icon name="comment-o" />
            暂无消息，开始对话吧！
          </p>
        </div>

        <div class="talk-meta">
          <div class="meta-item">
            <van-icon name="clock-o" />
            <span>{{ getLastActiveTime(team) }}</span>
          </div>
          <div class="meta-item">
            <van-icon name="user-circle-o" />
            <span>{{ team.nowNum }}/{{ team.maxNum }}人</span>
          </div>
        </div>

        <div class="talk-action">
          <van-button
            type="primary"
            size="small"
            round
            icon="chat-o"
            @click.stop="goToChat(team)"
          >
            进入聊天
          </van-button>
        </div>

        <div class="talk-card-bg"></div>
      </div>
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

// 去探索队伍
const goExplore = () => {
  router.push('/team')
}

// 模拟方法：是否有新消息
const hasNewMessages = (team: any) => {
  // 这里可以根据实际的聊天数据来判断
  return Math.random() > 0.7 // 模拟30%的队伍有新消息
}

// 模拟方法：获取新消息数量
const getNewMessageCount = (team: any) => {
  // 这里可以根据实际的聊天数据来获取
  return Math.floor(Math.random() * 9) + 1 // 模拟1-9条新消息
}

// 模拟方法：获取最后一条消息
const getLastMessage = (team: any) => {
  // 这里可以根据实际的聊天数据来获取
  const messages = [
    '大家好！很高兴加入这个队伍',
    '项目进展如何？',
    '有人想讨论一下新功能吗？',
    '会议定在明天下午2点',
    '文档已经更新了，请查看',
    '代码review完成了'
  ]
  return Math.random() > 0.3 ? messages[Math.floor(Math.random() * messages.length)] : null
}

// 格式化最后活跃时间
const getLastActiveTime = (team: any) => {
  const now = dayjs()
  const updateTime = dayjs(team.updateTime)
  const diffInHours = now.diff(updateTime, 'hour')

  if (diffInHours < 1) {
    const diffInMinutes = now.diff(updateTime, 'minute')
    return diffInMinutes < 5 ? '刚刚活跃' : `${diffInMinutes}分钟前`
  } else if (diffInHours < 24) {
    return `${diffInHours}小时前`
  } else {
    return updateTime.format('MM-DD HH:mm')
  }
}
</script>



<style scoped>
/* 聊天卡片容器 */
.talk-cards-container {
  padding: 0 16px;
  margin-bottom: 20px;
}

/* 聊天卡片样式 */
.talk-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8f0ff 100%);
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
  animation: slideInRight 0.6s ease-out forwards;
  opacity: 0;
  transform: translateX(30px);
  transition: all 0.3s ease;
  cursor: pointer;
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

.last-message, .no-messages {
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

.last-message .van-icon, .no-messages .van-icon {
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

  .last-message, .no-messages {
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
