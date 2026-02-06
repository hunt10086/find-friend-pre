<template>
  <div class="talk-entry-page">
    <div class="chat-card team-chat-card" @click="goTeamChats">
      <div class="card-content">
        <div class="icon-wrapper team-icon-wrapper">
          <img src="/ava.jpg" alt="team avatar" class="team-avatar" />
        </div>
        <div class="text-content">
          <h3 class="title">队伍聊天</h3>
          <p class="subtitle">与志同道合的队友实时沟通</p>
        </div>
        <div class="action-icon">
          <van-icon name="arrow" />
        </div>
      </div>
      <!-- Decorative background circle -->
      <div class="bg-decoration team-bg"></div>
    </div>

    <div class="chat-card friend-chat-card" @click="goFriendChats">
      <div class="card-content">
        <div class="icon-wrapper friend-icon-wrapper">
          <van-icon name="chat-o" />
        </div>
        <div class="text-content">
          <h3 class="title">好友聊天</h3>
          <p class="subtitle">分享生活点滴，畅聊无限可能</p>
        </div>
        <div class="action-area">
          <van-badge
            v-if="friendUnreadCount > 0"
            :content="friendUnreadCount"
            max="99"
            class="unread-badge"
          />
          <div class="action-icon">
            <van-icon name="arrow" />
          </div>
        </div>
      </div>
      <!-- Decorative background circle -->
      <div class="bg-decoration friend-bg"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onActivated } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/api/apiClient'

const router = useRouter()
const friendUnreadCount = ref(0)

const fetchUnread = async () => {
  try {
    const res = await api.friendMessage.getUnreadMessageCount()
    if (res?.data?.code === 0) {
      friendUnreadCount.value = res.data.data || 0
    } else {
      friendUnreadCount.value = 0
    }
  } catch (e) {
    friendUnreadCount.value = 0
  }
}

onMounted(() => {
  fetchUnread()
})

onActivated(() => {
  fetchUnread()
})

const goTeamChats = () => {
  router.push('/teamChats')
}

const goFriendChats = () => {
  router.push('/friends')
}
</script>

<style scoped>
.talk-entry-page {
  padding: 20px 16px;
  background: #f7f8fa;
  min-height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.chat-card {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  height: 140px; /* Increased height */
  display: flex;
  align-items: center;
}

.chat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.chat-card:active {
  transform: scale(0.98);
}

.team-chat-card {
  background: linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%);
  border: 1px solid rgba(25, 137, 250, 0.1);
}

.friend-chat-card {
  background: linear-gradient(135deg, #ffffff 0%, #fbf0ff 100%);
  border: 1px solid rgba(114, 50, 221, 0.1);
}

.card-content {
  display: flex;
  align-items: center;
  width: 100%;
  position: relative;
  z-index: 2;
}

.icon-wrapper {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  font-size: 30px;
  flex-shrink: 0;
}

.team-icon-wrapper {
  background: #e8f3ff;
  color: #1989fa;
}

.team-avatar {
  width: 100%;
  height: 100%;
  border-radius: 16px;
  object-fit: cover;
}

.friend-icon-wrapper {
  background: #f2eaff;
  color: #7232dd;
}

.text-content {
  flex: 1;
}

.title {
  font-size: 20px;
  font-weight: 700;
  color: #323233;
  margin: 0 0 8px 0;
  letter-spacing: 0.5px;
}

.subtitle {
  font-size: 14px;
  color: #969799;
  margin: 0;
  line-height: 1.4;
}

.action-area {
  display: flex;
  align-items: center;
  gap: 12px;
}

.action-icon {
  color: #c8c9cc;
  font-size: 20px;
  margin-left: 12px;
}

/* Background decorations */
.bg-decoration {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  z-index: 1;
}

.team-bg {
  width: 150px;
  height: 150px;
  background: #1989fa;
  top: -30px;
  right: -30px;
}

.friend-bg {
  width: 150px;
  height: 150px;
  background: #7232dd;
  bottom: -30px;
  right: 20%;
}

@media (max-width: 480px) {
  .chat-card {
    padding: 20px;
    height: 120px;
  }

  .title {
    font-size: 18px;
  }

  .icon-wrapper {
    width: 50px;
    height: 50px;
    margin-right: 16px;
  }
}
</style>
