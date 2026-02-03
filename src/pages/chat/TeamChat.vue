<template>
  <div class="chat-container">
    <!-- Header -->
    <div class="chat-header">
      <van-icon name="arrow-left" class="back-icon" @click="goBack" />
      <div class="header-title">
        <h3 class="team-name">{{ teamName || '队伍聊天' }}</h3>
      </div>
      <div class="header-actions">
        <!-- 保留右侧占位或功能按钮 -->
      </div>
    </div>

    <!-- Messages -->
    <div class="message-list" ref="messageListRef">
      <div v-for="(msg, idx) in messageList" :key="msg.id || idx">
        <div class="message-time-center" v-if="shouldShowTime(msg, idx)">
          {{ formatTime(msg.createTime) }}
        </div>
        <div :class="['message-item', msg.userId === currentUserId ? 'self' : 'other']">
          <img
            class="avatar"
            :src="msg.avatarUrl || '/ava.jpg'"
            @error="handleImageError"
            @click="handleAvatarClick(msg.userId)"
          />
          <div class="bubble-wrapper">
            <div v-if="msg.userId !== currentUserId" class="sender-name">
              {{ msg.userName }}
            </div>
            <div class="bubble">
              <span class="content">{{ msg.content }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="input-area">
      <div class="input-tools">
        <button class="emoji-btn" @click="toggleEmojiPicker">😊</button>
      </div>
      <textarea
        v-model="newMessage"
        class="message-input"
        placeholder="输入消息，回车发送"
        @keyup.enter.prevent="handleEnter"
        rows="1"
      ></textarea>
      <van-button type="primary" class="send-btn" :loading="sending" @click="sendMessage">
        发送
      </van-button>

      <!-- Emoji Picker -->
      <div v-if="showEmojiPicker" class="emoji-picker">
        <div class="emoji-grid">
          <span
            v-for="emoji in commonEmojis"
            :key="emoji"
            class="emoji-item"
            @click="insertEmoji(emoji)"
          >
            {{ emoji }}
          </span>
        </div>
      </div>
    </div>

    <!-- 用户资料弹窗 -->
    <UserProfileModal v-model="showProfileModal" :userId="selectedUserId" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, onActivated, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showFailToast, showSuccessToast } from 'vant'
import myAxios from '@/plugins/myAxios.js'
import { api } from '@/api/apiClient'
import dayjs from 'dayjs'
import UserProfileModal from '@/components/UserProfileModal.vue'

const route = useRoute()
const router = useRouter()
const teamId = ref(route.params.teamId)
const teamName = ref<string>('')
const messageList = ref<any[]>([])
const newMessage = ref('')
const currentUserId = ref<number>()
const sending = ref(false)
const showEmojiPicker = ref(false)
const commonEmojis = [
  '😊',
  '😂',
  '🥰',
  '😍',
  '🤔',
  '😎',
  '👍',
  '❤️',
  '🔥',
  '⭐',
  '🎉',
  '🎈',
  '🌟',
  '💯',
  '🙌',
  '👏',
  '💪',
  '🎯',
  '🏆',
  '🎊',
  '🎁',
  '🌈',
  '🌸',
  '🌺',
  '🌻',
  '🌞',
  '🌙',
  '💫',
]
let fetchTimer: any = null
const messageListRef = ref<HTMLElement | null>(null)

// Modal state
const showProfileModal = ref(false)
const selectedUserId = ref<number | null>(null)

const scrollToBottom = async () => {
  await nextTick()
  if (messageListRef.value) {
    messageListRef.value.scrollTop = messageListRef.value.scrollHeight
  }
}

const fetchTeamInfo = async () => {
  if (!teamId.value) return
  try {
    const [myTeamsRes, joinedTeamsRes] = await Promise.all([
      api.team.getMyTeam(),
      api.team.getJoinTeam(),
    ])

    const allTeams = [...(myTeamsRes.data.data || []), ...(joinedTeamsRes.data.data || [])]

    const targetTeam = allTeams.find((team: any) => team.id === Number(teamId.value))
    if (targetTeam) {
      teamName.value = targetTeam.teamName || '队伍聊天'
    }
  } catch (e) {
    // ignore
  }
}

const fetchMessages = async (isFirstLoad = false) => {
  try {
    const res = await myAxios.get('/api/teamChat/list', { params: { teamId: teamId.value } })
    if (res.data.code === 0) {
      // 过滤掉内容为check--only的消息
      const newMessages = (res.data.data || []).filter(
        (msg: any) => msg.content !== '__check_only__',
      )
      // 简单的去重或者更新逻辑（这里简化为直接覆盖，实际生产可能需要更精细的合并）
      const oldLen = messageList.value.length
      messageList.value = newMessages

      if (isFirstLoad || messageList.value.length > oldLen) {
        scrollToBottom()
      }
    }
  } catch (e) {
    // showFailToast('获取消息失败')
  }
}

const sendMessage = async () => {
  const content = newMessage.value.trim()
  if (!content) {
    showFailToast('消息不能为空')
    return
  }
  sending.value = true
  try {
    const res = await myAxios.post('/api/teamChat/send', {
      teamId: teamId.value,
      content: content,
    })
    if (res.data.code === 0) {
      newMessage.value = ''
      showEmojiPicker.value = false
      // 立即获取最新消息
      await fetchMessages(true)
      // 重置定时器
      startFetchTimer()
    } else {
      showFailToast(res.data.message || '发送失败')
    }
  } catch (e) {
    showFailToast('发送失败')
  } finally {
    sending.value = false
  }
}

const fetchCurrentUser = async () => {
  try {
    const res = await myAxios.get('/user/current')
    if (res.data.code === 0) {
      currentUserId.value = res.data.data.id
    }
  } catch (e) {
    // ignore
  }
}

const formatTime = (time: string) => {
  if (!time) return ''
  return dayjs(time).format('MM-DD HH:mm')
}

const shouldShowTime = (msg: any, idx: number) => {
  if (idx === 0) return true
  const prevMsg = messageList.value[idx - 1]
  const currTime = dayjs(msg.createTime || 0)
  const prevTime = dayjs(prevMsg.createTime || 0)
  return currTime.diff(prevTime, 'minute') >= 3
}

const toggleEmojiPicker = () => {
  showEmojiPicker.value = !showEmojiPicker.value
}

const insertEmoji = (emoji: string) => {
  newMessage.value += emoji
  showEmojiPicker.value = false
}

const handleEnter = (e: KeyboardEvent) => {
  if (e.shiftKey) {
    newMessage.value += '\n'
  } else {
    sendMessage()
  }
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/ava.jpg'
}

const goBack = () => {
  router.go(-1)
}

const handleAvatarClick = (userId: number) => {
  selectedUserId.value = userId
  showProfileModal.value = true
}

// 启动定时器
const startFetchTimer = () => {
  if (fetchTimer) {
    clearInterval(fetchTimer)
  }
  // 轮询间隔
  fetchTimer = setInterval(() => {
    fetchMessages()
  }, 3000)
}

const stopFetchTimer = () => {
  if (fetchTimer) {
    clearInterval(fetchTimer)
    fetchTimer = null
  }
}

onMounted(async () => {
  await fetchCurrentUser()
  await fetchTeamInfo()
  await fetchMessages(true)
  startFetchTimer()
})

watch(
  () => route.params.teamId,
  async (newTeamId) => {
    if (newTeamId) {
      teamId.value = newTeamId
      stopFetchTimer()
      messageList.value = []
      await fetchTeamInfo()
      await fetchMessages(true)
      startFetchTimer()
    }
  },
)

onActivated(async () => {
  const currentTeamId = route.params.teamId
  if (currentTeamId !== teamId.value) {
    teamId.value = currentTeamId
    stopFetchTimer()
    messageList.value = []
    await fetchTeamInfo()
    await fetchMessages(true)
    startFetchTimer()
  } else {
    // 恢复轮询
    startFetchTimer()
  }
})

onUnmounted(() => {
  stopFetchTimer()
})
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f7f8fa;
}

.chat-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 44px;
  padding: 0 12px;
  background: #fff;
  border-bottom: 1px solid #ebedf0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  flex-shrink: 0;
  z-index: 10;
}

.back-icon {
  font-size: 24px;
  color: #333;
  cursor: pointer;
  z-index: 2;
}

.header-title {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  max-width: 60%;
  text-align: center;
  z-index: 1;
}

.team-name {
  margin: 0;
  font-size: 17px;
  font-weight: 600;
  color: #323233;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header-actions {
  z-index: 2;
  width: 24px; /* balance back icon space if needed */
}

.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px 12px 12px;
}

.message-time-center {
  text-align: center;
  font-size: 12px;
  color: #969799;
  padding: 12px 0;
}

.message-item {
  display: flex;
  margin-bottom: 16px;
  align-items: flex-start;
}

.message-item.self {
  flex-direction: row-reverse;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  margin: 0 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  cursor: pointer;
}

.bubble-wrapper {
  max-width: 72vw;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sender-name {
  font-size: 12px;
  color: #969799;
  margin-bottom: 2px;
  margin-left: 2px;
  white-space: normal;
  word-wrap: break-word;
  line-height: 1.2;
}

.message-item.self .sender-name {
  display: none; /* Usually don't show own name */
}

.bubble {
  background: #fff;
  border: 1px solid #e5e5e5;
  padding: 8px 12px;
  border-radius: 16px;
  font-size: 14px;
  line-height: 1.5;
  word-break: break-word;
  position: relative;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.message-item.self .bubble {
  background: #95ec69;
  border-color: #6dd346;
}

.input-area {
  position: relative;
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 10px 12px;
  background: #fff;
  border-top: 1px solid #ebedf0;
  flex-shrink: 0;
}

.input-tools {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.emoji-btn {
  background: #f2f3f5;
  border: none;
  border-radius: 8px;
  padding: 6px 8px;
  font-size: 20px;
  cursor: pointer;
  line-height: 1;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}

.message-input {
  flex: 1;
  resize: none;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 14px;
  line-height: 1.4;
  max-height: 120px;
  background: #f8f9fa;
  outline: none;
}

.message-input:focus {
  border-color: #7232dd;
  background: #fff;
}

.send-btn {
  flex-shrink: 0;
  border-radius: 8px;
  height: 38px;
  padding: 0 18px;
  font-size: 14px;
}

.emoji-picker {
  position: absolute;
  bottom: 58px;
  left: 12px;
  background: #fff;
  border: 1px solid #ebedf0;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  padding: 10px;
  z-index: 50;
  width: 260px;
  max-height: 230px;
  overflow-y: auto;
}

.emoji-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
}

.emoji-item {
  font-size: 20px;
  text-align: center;
  cursor: pointer;
  padding: 6px 4px;
  border-radius: 8px;
}

.emoji-item:hover {
  background: #f2f3f5;
}
</style>
