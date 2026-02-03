<template>
  <div class="talk-entry-page">
    <div class="chat-strip" @click="goTeamChats">
      <div class="left">
        <img src="/ava.jpg" alt="team avatar" class="team-avatar" />
        <span class="title">队伍聊天</span>
      </div>
      <div class="right">
        <van-icon name="arrow" />
      </div>
    </div>

    <div class="chat-strip" @click="goFriendChats">
      <div class="left">
        <van-icon name="chat-o" class="icon" />
        <span class="title">好友聊天</span>
      </div>
      <div class="right">
        <van-badge v-if="friendUnreadCount > 0" :content="friendUnreadCount" max="99" />
        <van-icon name="arrow" />
      </div>
    </div>

    <!-- tips removed -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
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

const goTeamChats = () => {
  router.push('/teamChats')
}

const goFriendChats = () => {
  router.push('/friends')
}
</script>

<style scoped>
.talk-entry-page {
  padding: 16px;
  background: #f7f8fa;
  min-height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chat-strip {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  border-radius: 12px;
  padding: 14px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition:
    background-color 0.15s,
    box-shadow 0.2s;
}

.chat-strip:active {
  background: #f2f3f5;
}

.left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.icon {
  font-size: 24px;
  color: #7232dd;
}

.title {
  font-size: 16px;
  font-weight: 600;
  color: #323233;
}

.right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.team-avatar {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  object-fit: cover;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* tips removed */

@media (max-width: 480px) {
  .talk-entry-page {
    padding: 12px;
    gap: 10px;
  }
  .chat-strip {
    padding: 12px 14px;
  }
  .title {
    font-size: 15px;
  }
}
</style>
