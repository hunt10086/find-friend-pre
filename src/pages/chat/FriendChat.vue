<template>
  <div class="friend-chat-container">
    <!-- Header -->
    <div class="chat-header">
      <van-icon name="arrow-left" class="back-icon" @click="goBack" />
      <div class="friend-info">
        <img
          :src="friendAvatar || '/ava.jpg'"
          :alt="friendName"
          class="friend-avatar"
          @error="handleImageError"
        />
        <div class="info-texts">
          <h3 class="friend-name">{{ friendName || '好友聊天' }}</h3>
          <div class="status-line">
            <span v-if="wsConnected" class="status-dot online" title="WebSocket 已连接"></span>
            <span v-else class="status-dot offline" title="WebSocket 未连接，使用接口发送"></span>
            <span class="status-text">
              {{ wsConnected ? '实时连接已建立' : '使用接口发送（重试中）' }}
            </span>
          </div>
        </div>
      </div>
      <div class="header-actions">
        <van-icon v-if="!wsConnected" name="replay" class="retry-icon" @click="manualReconnect" />
      </div>
    </div>

    <!-- Messages -->
    <div class="message-list" ref="messageListRef">
      <div
        v-for="(msg, idx) in messages"
        :key="msg.localId || msg.id || idx"
        :class="[
          'message-item',
          msg.senderId === currentUserId ? 'self' : 'other',
          msg.sending ? 'sending' : '',
          msg.failed ? 'failed' : '',
        ]"
      >
        <img
          class="avatar"
          :src="
            msg.senderId === currentUserId
              ? currentUserAvatar || '/ava.jpg'
              : friendAvatar || '/ava.jpg'
          "
          @error="handleImageError"
        />
        <div class="bubble-wrapper">
          <div class="meta">
            <span class="name">
              {{ msg.senderId === currentUserId ? currentUserName || '我' : friendName || '好友' }}
            </span>
            <span class="time">{{
              formatTime((msg.sendTime || msg.createTime || '').toString().trim())
            }}</span>
          </div>
          <div class="bubble">
            <span class="content">{{
              (msg.messageContent || msg.content || '').replace(/\s+$/, '')
            }}</span>
            <span v-if="msg.sending" class="sending-indicator">...</span>
            <span v-if="msg.failed" class="failed-indicator">发送失败</span>
          </div>
        </div>
      </div>

      <div v-if="loadingHistory" class="loading-history">
        <van-loading size="20" />
        <span class="loading-text">加载历史消息...</span>
      </div>

      <div v-if="messages.length === 0 && !loadingHistory" class="empty-messages">
        <van-empty description="暂无聊天记录，开始聊天吧！" />
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
        placeholder="输入消息，回车发送（支持表情）"
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import dayjs from 'dayjs'
import myAxios from '@/plugins/myAxios.js'
import { buildWsUrl } from '@/plugins/websocket'
import { getFriendMessageList } from '@/api/controller/friend-message-controller/getFriendMessageList.js'
import { postFriendMessageMarkAsRead } from '@/api/controller/friend-message-controller/postFriendMessageMarkAsRead.js'
import { showFailToast, showSuccessToast } from 'vant'
import { useFriendStore } from '@/stores/friendStore'

interface FriendMessage {
  id?: number
  senderId?: number
  receiverId?: number
  messageContent?: string
  sendTime?: string
  status?: number
  // backend variants (added for template compatibility)
  content?: string
  createTime?: string
  // client side additions
  localId?: string
  sending?: boolean
  failed?: boolean
}

const route = useRoute()
const router = useRouter()
const friendId = ref<number | null>(Number(route.params.friendId) || null)

// UI / State
const messages = ref<FriendMessage[]>([])
const newMessage = ref('')
const sending = ref(false)
const loadingHistory = ref(false)
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
  '🍀',
  '🧠',
]

// User Info
const currentUserId = ref<number | null>(null)
const currentUserName = ref<string | null>(null)
const currentUserAvatar = ref<string | null>(null)
const friendStore = useFriendStore()

// Friend Info (basic, might be extended if needed)
const friendName = ref<string | undefined>(undefined)
const friendAvatar = ref<string | undefined>(undefined)

// WebSocket related
const ws = ref<WebSocket | null>(null)
const wsConnected = ref(false)
const reconnectAttempts = ref(0)
const maxReconnectAttempts = 5
let reconnectTimer: number | null = null

const messageListRef = ref<HTMLElement | null>(null)

const scrollToBottom = async () => {
  await nextTick()
  if (messageListRef.value) {
    messageListRef.value.scrollTop = messageListRef.value.scrollHeight
  }
}

// Format time
const formatTime = (time?: string) => {
  if (!time) return ''
  return dayjs(time).format('MM-DD HH:mm')
}

// Load current user
const loadCurrentUser = async () => {
  try {
    const res = await myAxios.get('/user/current')
    if (res.data.code === 0 && res.data.data) {
      currentUserId.value = res.data.data.id
      currentUserName.value = res.data.data.userName
      currentUserAvatar.value = res.data.data.avatarUrl
    }
  } catch (e) {
    // ignore
  }
}

// Optionally load friend basic info (reuse search one API)
const loadFriendInfo = async () => {
  if (!friendId.value) return
  try {
    const { getUserSearchOne } = await import(
      '@/api/controller/user-controller/getUserSearchOne.js'
    )
    const res = await getUserSearchOne({ id: friendId.value })
    if (res.data.code === 0 && res.data.data) {
      friendName.value = res.data.data.userName
      friendAvatar.value = res.data.data.avatarUrl
    }
  } catch (e) {
    // ignore
  }
}

// Load initial messages (history)
const loadHistory = async () => {
  if (!friendId.value) return
  loadingHistory.value = true
  try {
    const res = await getFriendMessageList({ friendId: friendId.value })
    if (res.data.code === 0) {
      const list: FriendMessage[] = (res.data.data || []).map((m) => ({
        ...m,
      }))
      // Sort by time ascending
      list.sort((a, b) => {
        const t1 = new Date(a.sendTime || 0).getTime()
        const t2 = new Date(b.sendTime || 0).getTime()
        return t1 - t2
      })
      messages.value = list
      await scrollToBottom()
      // Mark as read
      await markAsRead()
    } else {
      showFailToast('加载消息失败')
    }
  } catch (e) {
    showFailToast('加载消息失败')
  } finally {
    loadingHistory.value = false
  }
}

// Mark messages as read
const markAsRead = async () => {
  if (!friendId.value) return
  try {
    await postFriendMessageMarkAsRead({ friendId: friendId.value })
  } catch (e) {
    // ignore
  }
}

const initWebSocket = () => {
  if (!friendId.value) return

  cleanupWebSocket()

  const url = buildWsUrl('/ws/friend')

  try {
    ws.value = new WebSocket(url)
    ws.value.onopen = () => {
      wsConnected.value = true
      reconnectAttempts.value = 0
    }
    ws.value.onmessage = (evt) => {
      handleWsMessage(evt.data)
    }
    ws.value.onerror = () => {
      wsConnected.value = false
      scheduleReconnect()
    }
    ws.value.onclose = () => {
      wsConnected.value = false
      scheduleReconnect()
    }
  } catch (e) {
    wsConnected.value = false
    scheduleReconnect()
  }
}

// Handle incoming websocket message
const handleWsMessage = (raw: string) => {
  try {
    const data = JSON.parse(raw)
    // Connection ack
    if (data.type === 'connected') {
      return
    }
    // Sent ack
    if (data.type === 'sent' && data.data) {
      // Update local sending marker
      const sentData = data.data
      const local = messages.value.find((m) => m.localId && m.sending)
      if (local) {
        local.sending = false
        local.failed = false
        local.messageContent = (sentData.messageContent || '').replace(/\s+$/, '')
        // Use the original client time to maintain consistent UX
        // Only update if server time is reasonably close to client time (within 5 seconds)
        const serverTime = new Date(sentData.sendTime)
        const clientTime = new Date(local.sendTime)
        const timeDiff = Math.abs(serverTime.getTime() - clientTime.getTime())

        // If the time difference is reasonable (< 5 seconds), keep the client time
        // Otherwise, use server time (to handle major time sync issues)
        if (timeDiff <= 5000) {
          // Keep the client's initial timestamp for better UX
          // The message appears immediately with the right time and just removes "sending" indicator
        } else {
          // Use server time if there's a significant difference
          local.sendTime = sentData.sendTime
        }
      }
      scrollToBottom()
      return
    }
    // Assume it's a message object
    if (data.senderId && data.receiverId) {
      // 如果对方不在好友缓存中，自动标记为好友（说明已经产生双向互动）
      if (!friendStore.isFriend(data.senderId)) {
        friendStore.markFriend(data.senderId)
      }
      messages.value.push({
        ...data,
        messageContent: (data.messageContent || data.content || '').replace(/\s+$/, ''),
        content: undefined,
      })
      scrollToBottom()
      // Auto mark read if it is incoming
      if (data.senderId === friendId.value) {
        markAsRead()
      }
    }
  } catch (e) {
    // ignore malformed
  }
}

// Schedule reconnect with backoff
const scheduleReconnect = () => {
  if (reconnectAttempts.value >= maxReconnectAttempts) {
    return
  }
  reconnectAttempts.value++
  const delay = Math.min(10000, 1000 * Math.pow(2, reconnectAttempts.value - 1))
  if (reconnectTimer) {
    window.clearTimeout(reconnectTimer)
  }
  reconnectTimer = window.setTimeout(() => {
    initWebSocket()
  }, delay)
}

// Manual reconnect
const manualReconnect = () => {
  reconnectAttempts.value = 0
  initWebSocket()
}

// Cleanup websocket
const cleanupWebSocket = () => {
  if (reconnectTimer) {
    window.clearTimeout(reconnectTimer)
    reconnectTimer = null
  }
  if (ws.value) {
    try {
      ws.value.close()
    } catch (e) {
      // ignore
    }
    ws.value = null
  }
}

// Fallback HTTP send (when websocket not available)
const httpSendMessage = async (content: string) => {
  // NOTE: Backend fallback endpoint name is assumed.
  // If different, adjust path below.
  try {
    const res = await myAxios.post('/friendMessage/send', {
      receiverId: friendId.value,
      content,
    })
    if (res.data.code === 0) {
      return {
        success: true,
        data: {
          messageContent: content.replace(/\s+$/, ''),
          sendTime: new Date().toISOString(), // Using client time as fallback
          senderId: currentUserId.value,
          receiverId: friendId.value,
        },
      }
    } else {
      return { success: false }
    }
  } catch (e) {
    return { success: false }
  }
}

// Send message
const sendMessage = async () => {
  if (!friendId.value) {
    showFailToast('未选择好友')
    return
  }
  // 统一去除首尾与末尾多余空白
  const content = newMessage.value.replace(/\s+$/, '').trim()
  if (!content) {
    showFailToast('消息不能为空')
    return
  }
  const localId = `${Date.now()}-${Math.random().toString(36).slice(2)}`
  // Push provisional message
  const provisional: FriendMessage = {
    localId,
    senderId: currentUserId.value || 0,
    receiverId: friendId.value,
    messageContent: content.replace(/\s+$/, ''),
    // Use a placeholder time that will be updated when server acknowledges
    sendTime: new Date().toISOString(),
    sending: true,
    failed: false,
  }
  messages.value.push(provisional)
  scrollToBottom()
  newMessage.value = ''
  showEmojiPicker.value = false

  // Try websocket first
  if (wsConnected.value && ws.value && ws.value.readyState === WebSocket.OPEN) {
    try {
      ws.value.send(
        JSON.stringify({
          receiverId: friendId.value,
          content: content.replace(/\s+$/, ''),
        }),
      )
      // Server will acknowledge with actual sendTime via websocket
      return
    } catch (e) {
      // fall through to http
    }
  }

  // Fallback HTTP
  const result = await httpSendMessage(content)
  if (result.success && result.data) {
    // Use server's timestamp
    provisional.sending = false
    provisional.failed = false
    provisional.sendTime = result.data.sendTime
  } else {
    provisional.sending = false
    provisional.failed = true
    showFailToast('发送失败')
  }
}

// Enter key handling (support shift+enter for newline)
const handleEnter = (e: KeyboardEvent) => {
  if (e.shiftKey) {
    // Insert newline
    newMessage.value += '\n'
  } else {
    sendMessage()
  }
}

// Emoji handling
const toggleEmojiPicker = () => {
  showEmojiPicker.value = !showEmojiPicker.value
}
const insertEmoji = (emoji: string) => {
  newMessage.value += emoji
  showEmojiPicker.value = false
}

const handleImageError = (evt: Event) => {
  const img = evt.target as HTMLImageElement
  img.src = '/ava.jpg'
}

const goBack = () => {
  router.go(-1)
}

// Watch route changes for friendId updates
watch(
  () => route.params.friendId,
  async (newVal) => {
    const idNum = Number(newVal)
    if (!isNaN(idNum) && idNum !== friendId.value) {
      friendId.value = idNum
      messages.value = []
      cleanupWebSocket()
      await loadFriendInfo()
      await loadHistory()
      initWebSocket()
    }
  },
)

onMounted(async () => {
  await loadCurrentUser()
  await loadFriendInfo()
  await loadHistory()
  initWebSocket()
})

onUnmounted(() => {
  cleanupWebSocket()
})
</script>

<style scoped>
.friend-chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f7f8fa;
}

.chat-header {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  background: #fff;
  border-bottom: 1px solid #ebedf0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  z-index: 10;
}

.back-icon {
  font-size: 24px;
  margin-right: 10px;
  color: #666;
  cursor: pointer;
}

.friend-info {
  display: flex;
  align-items: center;
  flex: 1;
  gap: 12px;
  min-width: 0;
}

.friend-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  border: 2px solid #fff;
}

.info-texts {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.friend-name {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #323233;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.status-line {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #969799;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-dot.online {
  background: #07c160;
}

.status-dot.offline {
  background: #ee0a24;
}

.retry-icon {
  font-size: 20px;
  color: #666;
  cursor: pointer;
}

.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px 12px 12px;
}

.message-item {
  display: flex;
  margin-bottom: 16px;
  align-items: flex-end;
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
}

.bubble-wrapper {
  max-width: 72vw;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.meta {
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 11px;
  color: #999;
}

.meta .name {
  font-weight: 500;
  color: #666;
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

.sending-indicator {
  position: absolute;
  right: 10px;
  bottom: 4px;
  font-size: 10px;
  color: #888;
}

.failed-indicator {
  position: absolute;
  right: 10px;
  bottom: 4px;
  font-size: 10px;
  color: #ee0a24;
}

.loading-history {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
  padding: 12px 0;
  font-size: 13px;
  color: #666;
}

.empty-messages {
  padding: 40px 0;
}

.input-area {
  position: relative;
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 10px 12px;
  background: #fff;
  border-top: 1px solid #ebedf0;
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
  transition: background-color 0.15s;
}

.emoji-btn:active {
  background: #e4e5e7;
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
  transition: background-color 0.15s;
}

.emoji-item:hover {
  background: #f2f3f5;
}

@media (max-width: 480px) {
  .friend-name {
    font-size: 15px;
  }
  .message-input {
    font-size: 13px;
  }
  .bubble {
    font-size: 13px;
  }
  .emoji-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}
</style>
