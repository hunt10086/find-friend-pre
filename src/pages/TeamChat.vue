<template>
  <div class="chat-container">
    <div class="message-list">
      <div
        v-for="msg in messageList"
        :key="msg.id"
        :class="['message-item', msg.userId === currentUserId ? 'self' : 'other']"
      >
        <img class="avatar" :src="msg.avatarUrl || '/ava.jpg'" @error="handleImageError" />
        <div class="meta-info">
          <span class="user-name">{{ msg.userName }}</span>
          <span class="time">{{ formatTime(msg.createTime) }}</span>
        </div>
        <div class="bubble">
          <div class="content">{{ msg.content }}</div>
        </div>
      </div>
    </div>
    <div class="input-area">
      <input v-model="newMessage" placeholder="输入消息..." @keyup.enter="sendMessage" />
      <button @click="toggleEmojiPicker" class="emoji-btn">😊</button>
      <button @click="sendMessage">发送</button>
      
      <!-- Emoji Picker -->
      <div v-if="showEmojiPicker" class="emoji-picker">
        <div class="emoji-grid">
          <span 
            v-for="emoji in commonEmojis" 
            :key="emoji"
            @click="insertEmoji(emoji)"
            class="emoji-item"
          >
            {{ emoji }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { showFailToast, showSuccessToast } from 'vant'
import myAxios from '@/plugins/myAxios.js'
import dayjs from 'dayjs'

const route = useRoute()
const teamId = route.params.teamId
const messageList = ref<any[]>([])
const newMessage = ref('')
const currentUserId = ref<number>()
const showEmojiPicker = ref(false)
const commonEmojis = ref(['😊', '😂', '🥰', '😍', '🤔', '😎', '👍', '❤️', '🔥', '⭐', '🎉', '🎈', '🌟', '💯', '🙌', '👏', '💪', '🎯', '🏆', '🎊', '🎁', '🌈', '🌸', '🌺', '🌻', '🌝', '🌞', '🌙', '⭐', '🌟', '💫', '🌈', '🌸', '🌺', '🌻', '🌝', '🌞', '🌙', '⭐', '🌟', '💫'])
let fetchTimer: NodeJS.Timeout | null = null

const fetchMessages = async () => {
  try {
    const res = await myAxios.get('/api/teamChat/list', { params: { teamId } })
    if (res.data.code === 0) {
      // 过滤掉内容为check--only的消息
      messageList.value = (res.data.data || []).filter(msg => msg.content !== '__check_only__')
    } else {
      showFailToast('获取消息失败')
    }
  } catch (e) {
    showFailToast('获取消息失败')
  }
}

const sendMessage = async () => {
  if (!newMessage.value.trim()) {
    showFailToast('消息不能为空')
    return
  }
  try {
    const res = await myAxios.post('/api/teamChat/send', {
      teamId,
      content: newMessage.value
    })
    if (res.data.code === 0) {
      showSuccessToast('发送成功')
      newMessage.value = ''
      // 立即获取最新消息
      await fetchMessages()
      // 重置定时器，避免重复请求
      startFetchTimer()
    } else {
      showFailToast(res.data.message || '发送失败')
    }
  } catch (e) {
    showFailToast('发送失败')
  }
}

const fetchCurrentUser = async () => {
  const res = await myAxios.get('/user/current')
  if (res.data.code === 0) {
    currentUserId.value = res.data.data.id
  }
}

const formatTime = (time: string) => {
  return dayjs(time).format('YYYY-MM-DD HH:mm')
}

const toggleEmojiPicker = () => {
  showEmojiPicker.value = !showEmojiPicker.value
}

const insertEmoji = (emoji: string) => {
  newMessage.value += emoji
  showEmojiPicker.value = false
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/ava.jpg'
}

// 启动定时器
const startFetchTimer = () => {
  // 清除现有定时器
  if (fetchTimer) {
    clearInterval(fetchTimer)
  }
  
  // 设置新的定时器，每20秒获取一次消息
  fetchTimer = setInterval(() => {
    fetchMessages()
  }, 20000) // 20秒 = 20000毫秒
}

// 停止定时器
const stopFetchTimer = () => {
  if (fetchTimer) {
    clearInterval(fetchTimer)
    fetchTimer = null
  }
}

onMounted(() => {
  fetchCurrentUser()
  fetchMessages()
  // 启动定时器
  startFetchTimer()
})

// 组件卸载时清理定时器
onUnmounted(() => {
  stopFetchTimer()
})
</script>



<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f7f7f7;
}
.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}
.message-item {
  display: flex;
  align-items: flex-end;
  margin-bottom: 18px;
  position: relative;
}
.message-item.self {
  flex-direction: row-reverse;
}
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin: 0 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
}
.meta-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 60px;
  margin: 0 4px;
}
.message-item.self .meta-info {
  align-items: center;
}
.user-name {
  font-size: 13px;
  color: #333;
  font-weight: 500;
  margin-bottom: 2px;
}
.time {
  font-size: 11px;
  color: #bbb;
}
.bubble {
  max-width: 60vw;
  background: #e5e5ea;
  border-radius: 16px;
  padding: 10px 16px;
  position: relative;
  word-break: break-all;
  font-size: 15px;
  margin: 0 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}
.message-item.self .bubble {
  background: #95ec69;
  color: #222;
}
.input-area {
  display: flex;
  padding: 12px;
  background: #fff;
  border-top: 1px solid #eee;
  padding-bottom: 60px;
}
.input-area input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 8px;
}
.input-area button {
  padding: 8px 16px;
  background: #007aff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.input-area .emoji-btn {
  padding: 8px 12px;
  background: #f0f0f0;
  color: #333;
  font-size: 18px;
  margin-right: 8px;
}
.emoji-picker {
  position: absolute;
  bottom: 60px;
  left: 12px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  padding: 8px;
  z-index: 100;
  max-width: 280px;
  max-height: 200px;
  overflow-y: auto;
}
.emoji-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 4px;
}
.emoji-item {
  font-size: 18px;
  padding: 6px 4px;
  cursor: pointer;
  text-align: center;
  border-radius: 4px;
  transition: background-color 0.2s;
  min-width: 30px;
  min-height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.emoji-item:hover {
  background-color: #f0f0f0;
}
</style>
