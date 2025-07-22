<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { showFailToast, showSuccessToast } from 'vant'
import myAxios from '@/plugins/myAxios.js'
import dayjs from 'dayjs'

const route = useRoute()
const teamId = route.params.teamId
const messageList = ref<any[]>([])
const newMessage = ref('')
const defaultAvatar = '/default-avatar.png' // 可替换为你的默认头像
const currentUserId = ref<number>()

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
      await fetchMessages()
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
  return dayjs(time).format('HH:mm')
}

onMounted(() => {
  fetchCurrentUser()
  fetchMessages()
})
</script>

<template>
  <div class="chat-container">
    <div class="message-list">
      <div
        v-for="msg in messageList"
        :key="msg.id"
        :class="['message-item', msg.userId === currentUserId ? 'self' : 'other']"
      >
        <img class="avatar" :src="msg.avatarUrl || defaultAvatar" />
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
      <button @click="sendMessage">发送</button>
    </div>
  </div>
</template>

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
</style>
