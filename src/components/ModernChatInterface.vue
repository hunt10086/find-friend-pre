<template>
  <div class="modern-chat-container" :data-theme="currentTheme" :class="{ 'is-group': isGroup }">
    <!-- 聊天头部 -->
    <div class="chat-header">
      <div class="header-left" @click="goBack">
        <van-icon name="arrow-left" class="back-icon" />
      </div>
      <div class="header-center">
        <div class="chat-title">
          <img :src="chatInfo.avatar || defaultAvatar" :alt="chatInfo.name" class="chat-avatar" />
          <div class="title-info">
            <h3 class="name">{{ chatInfo.name }}</h3>
            <p class="subtitle" v-if="chatInfo.subtitle">{{ chatInfo.subtitle }}</p>
          </div>
        </div>
      </div>
      <div class="header-right">
        <van-icon name="more-o" class="more-icon" @click="showMoreOptions" />
      </div>
    </div>

    <!-- 消息列表 -->
    <div class="message-list-container">
      <div class="message-list" ref="messageListRef">
        <div
          v-if="hasMoreHistory && displayedMessages.length > 0"
          class="load-more-trigger"
          @click="loadMoreMessages"
        >
          <van-loading v-if="loadingHistory" size="16px" />
          <span v-else>{{ loadingHistory ? '加载中...' : '查看更多历史消息' }}</span>
        </div>

        <template v-for="(msg, idx) in displayedMessages" :key="msg.localId || msg.id || idx">
          <!-- 时间分隔线 -->
          <div v-if="shouldShowTimeLabel(msg, idx)" class="time-divider">
            <span class="time-label">{{ formatTimeLabel(msg.sendTime || msg.createTime) }}</span>
          </div>

          <div
            :class="[
              'message-item',
              msg.senderId === currentUserId ? 'self' : 'other',
              msg.type || 'text',
            ]"
          >
            <!-- 其他用户消息 -->
            <template v-if="msg.senderId !== currentUserId">
              <div class="message-wrapper">
                <div class="sender-info" v-if="showSenderName(msg, idx)">
                  <span class="sender-name">{{ getSenderName(msg) }}</span>
                </div>
                <div class="message-row">
                  <van-avatar
                    :src="getAvatarForMessage(msg)"
                    size="40"
                    :style="{ flexShrink: 0, borderRadius: '4px' }"
                  />
                  <div class="message-content">
                    <div class="message-bubble">
                      <div class="message-text" v-if="msg.type === 'text' || !msg.type">
                        {{ msg.content || msg.messageContent }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <!-- 自己的消息 -->
            <template v-else>
              <div class="message-wrapper self-wrapper">
                <div class="message-row self-row">
                  <div class="message-content">
                    <div class="message-bubble self">
                      <div class="message-text" v-if="msg.type === 'text' || !msg.type">
                        {{ msg.content || msg.messageContent }}
                      </div>
                    </div>
                  </div>
                  <van-avatar
                    :src="currentUserAvatar || defaultAvatar"
                    size="40"
                    :style="{ flexShrink: 0, borderRadius: '4px' }"
                  />
                </div>
              </div>
            </template>
          </div>
        </template>

        <div v-if="displayedMessages.length === 0 && !loadingHistory" class="empty-messages">
          <van-empty description="暂无聊天记录，开始聊天吧！" />
        </div>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="input-area">
      <div class="input-tools">
        <button
          class="tool-btn emoji-btn"
          @click="toggleEmojiPicker"
          :class="{ active: showEmojiPicker }"
        >
          <van-icon name="smile-o" />
        </button>
        <button class="tool-btn attachment-btn" @click="showAttachmentOptions">
          <van-icon name="photo-o" />
        </button>
      </div>
      <div class="input-container">
        <textarea
          ref="messageInputRef"
          v-model="newMessage"
          class="message-input"
          placeholder="输入消息..."
          @keydown="handleKeyDown"
          @keyup="handleKeyUp"
          :rows="inputRows"
          :maxlength="maxLength"
        />
        <div class="input-hints" v-if="showHints">
          <span class="hint-char-count">{{ newMessage.length }}/{{ maxLength }}</span>
        </div>
      </div>
      <button
        class="send-btn"
        :disabled="!canSendMessage"
        @click="sendMessage"
        :class="{ sending: sending }"
      >
        <van-icon v-if="sending" name="spinner" spin size="16" />
        <van-icon v-else name="send" />
      </button>
    </div>

    <!-- 表情选择器 -->
    <transition name="slide-up">
      <div v-if="showEmojiPicker" class="emoji-picker" @click.stop>
        <div class="emoji-tabs">
          <div
            v-for="(tab, index) in emojiTabs"
            :key="index"
            class="tab-item"
            :class="{ active: currentTab === index }"
            @click="currentTab = index"
          >
            {{ tab.icon }}
          </div>
        </div>
        <div class="emoji-grid">
          <span
            v-for="emoji in currentEmojiSet"
            :key="emoji"
            class="emoji-item"
            @click="insertEmoji(emoji)"
          >
            {{ emoji }}
          </span>
        </div>
      </div>
    </transition>

    <!-- 附件选项 -->
    <van-action-sheet
      v-model:show="showAttachmentSheet"
      :actions="attachmentActions"
      @select="onAttachmentSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { showFailToast, showSuccessToast } from 'vant'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import { useThemeStore } from '@/stores/themeStore'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

// Props
interface Props {
  chatType?: 'friend' | 'group'
  chatInfo: {
    id: number | string
    name: string
    avatar?: string
    subtitle?: string
  }
}

const props = withDefaults(defineProps<Props>(), {
  chatType: 'friend',
})

// Emits
const emit = defineEmits<{
  'send-message': [content: string]
  'load-history': []
  'go-back': []
}>()

// Refs
const router = useRouter()
const messageListRef = ref<HTMLElement | null>(null)
const messageInputRef = ref<HTMLTextAreaElement | null>(null)

// State
const messages = ref<any[]>([])
const displayedMessages = ref<any[]>([]) // 实际显示的消息列表（分页）
const newMessage = ref('')
const sending = ref(false)
const loadingHistory = ref(false)
const hasMoreHistory = ref(true) // 是否还有更多历史消息
const messagePageSize = 50 // 每页显示的消息数量
const currentMessagePage = ref(1) // 当前显示的页数
const showEmojiPicker = ref(false)
const showAttachmentSheet = ref(false)
const currentTab = ref(0)
const inputRows = ref(1)
const showHints = ref(false)

// 使用主题store
const themeStore = useThemeStore()

// 当前主题
const currentTheme = computed(() => themeStore.currentTheme)

// Current user info (would come from store)
const currentUserId = ref(1) // 示例ID
const currentUserAvatar = ref('') // 示例头像

// Constants
const maxLength = 500
const defaultAvatar = '/ava.jpg'

// Emoji data
const emojiTabs = [
  { icon: '😀', name: '表情' },
  { icon: '动物', name: '动物' },
  { icon: '食物', name: '食物' },
  { icon: '活动', name: '活动' },
]

const emojiSets = [
  [
    '😀',
    '😃',
    '😄',
    '😁',
    '😆',
    '😅',
    '😂',
    '🤣',
    '😊',
    '😇',
    '🙂',
    '🙃',
    '😉',
    '😌',
    '😍',
    '🥰',
    '😘',
    '😗',
    '😙',
    '😚',
    '😋',
    '😛',
    '😝',
    '😜',
    '🤪',
    '🤨',
    '🧐',
    '🤓',
    '😎',
    '🤩',
    '🥳',
    '😏',
    '😒',
    '😞',
    '😔',
    '😟',
    '😕',
    '🙁',
    '☹️',
    '😣',
    '😖',
    '😫',
    '😩',
    '🥺',
    '😢',
    '😭',
    '😤',
    '😠',
    '😡',
    '🤬',
    '🤯',
    '😳',
    '🥵',
    '🥶',
    '😱',
    '😨',
    '😰',
    '😥',
    '😓',
    '🤗',
    '🤔',
    '🤭',
    '🤫',
    '🤥',
    '😶',
    '😐',
    '😑',
    '😬',
    '🙄',
    '😯',
    '😦',
    '😧',
    '😮',
    '😲',
    '🥱',
    '😴',
    '🤤',
    '😪',
    '😵',
    '🤐',
    '🥴',
    '🤢',
    '🤮',
    '🤧',
    '😷',
    '🤒',
    '🤕',
    '🤑',
    '🤠',
    '😈',
    '👿',
    '👹',
    '👺',
    '🤡',
    '💩',
    '👻',
    '💀',
    '☠️',
    '👽',
    '👾',
    '🤖',
    ' pumpkin',
    '😺',
    '😸',
    '😹',
    '😻',
    '😼',
    '😽',
    '🙀',
    '😿',
    '😾',
  ],
  [
    '🐶',
    '🐱',
    '🐭',
    '🐹',
    '🐰',
    '🦊',
    '🐻',
    '🐼',
    '🐨',
    '🐯',
    '🦁',
    '🐮',
    '🐷',
    '🐽',
    '🐸',
    '🐵',
    '🙈',
    '🙉',
    '🙊',
    '🐒',
    '🐔',
    '🐧',
    '🐦',
    '🐤',
    '🐣',
    '🐥',
    '🦆',
    '🦅',
    '🦉',
    '🦇',
    '🐺',
    '🐗',
    '🐴',
    '🦄',
    '🐝',
    '🐛',
    '🦋',
    '🐌',
    '🐞',
    '🐜',
    '🦟',
    '🦗',
    '🕷',
    '🕸',
    '🦂',
    '🐢',
    '🐍',
    '🦎',
    '🦖',
    '🦕',
    '🐙',
    '🦑',
    '🦐',
    '🦞',
    '🦀',
    '🐡',
    '🐠',
    '🐟',
    '🐬',
    '🐳',
    '🐋',
    '🦈',
    '🐊',
    '🐅',
    '🐆',
    '🦓',
    '🦍',
    '🦧',
    '🐘',
    '🦛',
    '🦏',
    '🐪',
    '🐫',
    '🦒',
    '🦘',
    '🐃',
    '🐂',
    '🐄',
    '🐎',
    '🐖',
    '🐏',
    '🐑',
    '🦙',
    '🐐',
    '🦌',
    '🐕',
    '🐩',
    '🦮',
    '🐕‍🦺',
    '🐈',
    '🐓',
    '🦃',
    '🦚',
    '🦜',
    '🦢',
    '🦩',
    '🕊',
    '🐇',
    '🦝',
    '🦨',
    '🦡',
    '🦫',
    '🦦',
    '🦥',
    '🐁',
    '🐀',
    '🐿',
    '🦔',
  ],
  [
    '🍏',
    '🍎',
    '🍐',
    '🍊',
    '🍋',
    '🍌',
    '🍉',
    '🍇',
    '🍓',
    '🍈',
    '🍒',
    '🍑',
    '🥭',
    '🍍',
    '🥥',
    '🥝',
    '🍅',
    '🍆',
    '🥑',
    '🥦',
    '🥬',
    '🥒',
    '🌶',
    '🌽',
    '🥕',
    '🧄',
    '🧅',
    '🥔',
    '🍠',
    '🥐',
    '🥯',
    '🍞',
    '🥖',
    '🥨',
    '🧀',
    '🥚',
    '🍳',
    '🧈',
    '🥞',
    '🧇',
    '🥓',
    '🥩',
    '🍗',
    '🍖',
    '🦴',
    '🌭',
    '🍔',
    '🍟',
    '🍕',
    '🫓',
    '🥪',
    '🥙',
    '🧆',
    '🌮',
    '🌯',
    '🫔',
    '🥗',
    '🥘',
    '🫕',
    '🥫',
    ' spaghetti',
    '🍜',
    '🍲',
    '🍛',
    '🍣',
    '🍱',
    '🥟',
    '🥠',
    '🥡',
    '🦪',
    '🍤',
    ' riceball',
    '🍚',
    ' ricecracker',
    '🍥',
    '🥠',
    '🥮',
    '🍢',
    '🍡',
    '🍧',
    '🍨',
    '🍦',
    '🥧',
    '🧁',
    '🍰',
    '🎂',
    '🍮',
    '🍭',
    '🍬',
    '🍫',
    '🍩',
    '🍪',
    '🌰',
    '🥜',
    '🍯',
    '🥛',
    '🍼',
    '🫖',
    '☕',
    '🍵',
    '🧃',
    '🥤',
    '🧋',
    '🍶',
    '🍺',
    '🍻',
    '🥂',
    '🍷',
    '🥃',
    '🍸',
    '🍹',
    '🧉',
    '🍾',
    '🧊',
    '🥄',
    'フォーク',
    '🍽',
    '🥣',
    '🥡',
    '🥢',
    '🧂',
  ],
  [
    '⚽',
    '🏀',
    '🏈',
    '⚾',
    '🎾',
    '🏐',
    '🏉',
    '🎱',
    '🏓',
    '🏸',
    '🥅 GOAL NET',
    '🏒',
    '🏑',
    '🏏',
    '🪃',
    '🥏',
    '⛳',
    '🏹',
    '🎣',
    '🤿',
    '🥊',
    '🥋',
    '🎽',
    '🛹',
    '🛼',
    '⛸',
    '🥌',
    '🎿',
  ],
]

// Computed
const isGroup = computed(() => props.chatType === 'group')
const canSendMessage = computed(() => newMessage.value.trim().length > 0 && !sending.value)
const currentEmojiSet = computed(() => emojiSets[currentTab.value])

// Attachment actions
const attachmentActions = [
  { name: '图片', icon: 'photo' },
  { name: '视频', icon: 'video' },
  { name: '文件', icon: 'document' },
  { name: '位置', icon: 'location' },
  { name: '取消', color: '#ee0a24', icon: 'close' },
]

// Methods
// 更新显示的消息列表（分页）
const updateDisplayedMessages = () => {
  const totalMessages = messages.value.length
  const startIndex = Math.max(0, totalMessages - messagePageSize * currentMessagePage.value)
  displayedMessages.value = messages.value.slice(startIndex)

  // 判断是否还有更多历史消息
  hasMoreHistory.value = startIndex > 0
}

// 加载更多历史消息
const loadMoreMessages = () => {
  if (loadingHistory.value || !hasMoreHistory.value) return

  loadingHistory.value = true
  const previousScrollHeight = messageListRef.value?.scrollHeight || 0

  setTimeout(() => {
    currentMessagePage.value += 1
    updateDisplayedMessages()
    loadingHistory.value = false

    // 保持滚动位置，避免跳动
    nextTick(() => {
      if (messageListRef.value) {
        const newScrollHeight = messageListRef.value.scrollHeight
        messageListRef.value.scrollTop = newScrollHeight - previousScrollHeight
      }
    })
  }, 300) // 模拟加载延迟
}

const scrollToBottom = async () => {
  await nextTick()
  if (messageListRef.value) {
    messageListRef.value.scrollTop = messageListRef.value.scrollHeight
  }
}

const formatTime = (time?: string) => {
  if (!time) return ''
  const date = dayjs(time)
  const now = dayjs()

  // 如果是今天，显示相对时间
  if (date.isSame(now, 'day')) {
    return date.fromNow()
  }
  // 如果是今年，显示月日
  if (date.isSame(now, 'year')) {
    return date.format('MM-DD HH:mm')
  }
  // 否则显示完整日期
  return date.format('YYYY-MM-DD HH:mm')
}

const getAvatarForMessage = (msg: any) => {
  if (props.chatType === 'group') {
    return msg.senderAvatar || defaultAvatar
  }
  return props.chatInfo.avatar || defaultAvatar
}

// 判断是否显示时间标签（类似微信，超过5分钟显示）
const shouldShowTimeLabel = (msg: any, idx: number) => {
  if (idx === 0) return true
  const currentTime = new Date(msg.sendTime || msg.createTime).getTime()
  const prevTime = new Date(
    messages.value[idx - 1].sendTime || messages.value[idx - 1].createTime,
  ).getTime()
  return currentTime - prevTime > 5 * 60 * 1000 // 5分钟
}

// 格式化时间标签
const formatTimeLabel = (time: string) => {
  if (!time) return ''
  const msgTime = dayjs(time)
  const now = dayjs()
  const yesterday = now.subtract(1, 'day')

  if (msgTime.isSame(now, 'day')) {
    return msgTime.format('HH:mm')
  } else if (msgTime.isSame(yesterday, 'day')) {
    return '昨天 ' + msgTime.format('HH:mm')
  } else if (msgTime.isSame(now, 'year')) {
    return msgTime.format('MM-DD HH:mm')
  } else {
    return msgTime.format('YYYY-MM-DD HH:mm')
  }
}

const getSenderName = (msg: any) => {
  if (props.chatType === 'group') {
    return msg.senderName || '未知用户'
  }
  return props.chatInfo.name
}

const showSenderName = (msg: any, index: number) => {
  if (props.chatType !== 'group') return false

  // 显示发送者名称的条件：不是自己发的，或者上一条消息不是同一个人发的（超过一定时间间隔）
  if (msg.senderId === currentUserId) return false

  const prevMsg = messages.value[index - 1]
  if (!prevMsg) return true

  // 如果与前一条消息的时间间隔超过5分钟，则显示发送者名称
  const currentTime = new Date(msg.sendTime || msg.createTime).getTime()
  const prevTime = new Date(prevMsg.sendTime || prevMsg.createTime).getTime()
  return Math.abs(currentTime - prevTime) > 5 * 60 * 1000
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    if (e.shiftKey) {
      // Shift+Enter 换行
      return
    } else {
      // Enter 发送消息
      e.preventDefault()
      if (canSendMessage.value) {
        sendMessage()
      }
    }
  }
}

const handleKeyUp = () => {
  updateInputRows()
  showHints.value = newMessage.value.length > maxLength * 0.8
}

const updateInputRows = () => {
  if (!messageInputRef.value) return

  const lineHeight = 20 // 行高
  const paddingTop = 8 // 内边距
  const paddingBottom = 8 // 内边距

  messageInputRef.value.style.height = 'auto'
  const height = messageInputRef.value.scrollHeight
  const rows = Math.min(Math.floor((height - paddingTop - paddingBottom) / lineHeight), 5)

  inputRows.value = Math.max(rows, 1)
}

const toggleEmojiPicker = () => {
  showEmojiPicker.value = !showEmojiPicker.value
  showAttachmentSheet.value = false
}

const showAttachmentOptions = () => {
  showAttachmentSheet.value = true
  showEmojiPicker.value = false
}

const insertEmoji = (emoji: string) => {
  newMessage.value += emoji
  updateInputRows()
  nextTick(() => {
    messageInputRef.value?.focus()
  })
}

const onAttachmentSelect = (action: any) => {
  if (action.name === '取消') return

  // 这里可以处理附件选择逻辑
  showSuccessToast(`选择了${action.name}`)
}

const sendMessage = async () => {
  if (!canSendMessage.value) return

  const content = newMessage.value.trim()
  if (!content) return

  sending.value = true

  try {
    // 发送消息
    emit('send-message', content)

    // 添加本地预览消息
    const localMessage = {
      localId: Date.now().toString(),
      senderId: currentUserId.value,
      content: content,
      sendTime: new Date().toISOString(),
      status: 'sending',
    }

    messages.value.push(localMessage)
    newMessage.value = ''
    updateInputRows()

    scrollToBottom()

    // 模拟发送成功
    setTimeout(() => {
      const msgIndex = messages.value.findIndex((m) => m.localId === localMessage.localId)
      if (msgIndex !== -1) {
        messages.value[msgIndex].status = 'sent'
      }
      sending.value = false
    }, 1000)
  } catch (error) {
    showFailToast('发送失败')
    sending.value = false
  }
}

const getMessageStatusIcon = (msg: any) => {
  if (msg.status === 'sending') return 'clock'
  if (msg.status === 'sent') return 'checked'
  if (msg.status === 'delivered') return 'passed'
  if (msg.status === 'read') return 'like-o'
  return 'clock'
}

const getMessageStatusColor = (msg: any) => {
  if (msg.status === 'sending') return '#969799'
  if (msg.status === 'sent') return '#07c160'
  if (msg.status === 'delivered') return '#07c160'
  if (msg.status === 'read') return '#07c160'
  return '#969799'
}

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.src = defaultAvatar
}

const goBack = () => {
  emit('go-back')
}

const showMoreOptions = () => {
  showSuccessToast('更多选项')
}

// Watchers
watch(newMessage, () => {
  updateInputRows()
})

// 监听消息列表变化，自动更新显示
watch(
  messages,
  () => {
    updateDisplayedMessages()
  },
  { deep: true },
)

// 监听主题变化
watch(
  () => themeStore.currentTheme,
  (newTheme) => {
    // 主题变化会通过CSS变量自动应用，无需额外操作
  },
  { immediate: true },
)

// Lifecycle
onMounted(() => {
  updateDisplayedMessages()
  scrollToBottom()
})

onUnmounted(() => {
  // 清理操作
})
</script>

<style scoped>
.modern-chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--bg-color, #f5f5f5);
  position: relative;
  --primary-color: #1989fa;
  --secondary-color: #969799;
  --bg-color: #f5f5f5;
  --card-bg: #ffffff;
  --self-bubble-bg: #dcf8c6;
  --other-bubble-bg: #ffffff;
  --border-color: #ebedf0;
  --text-color: #323233;
  --text-secondary: #969799;
}

/* 全局主题通过:data-theme属性应用 */
[data-theme='default'] {
  --primary-color: #1989fa;
  --self-bubble-bg: #dcf8c6;
}

[data-theme='purple'] {
  --primary-color: #7232dd;
  --self-bubble-bg: #e6d4fa;
}

[data-theme='green'] {
  --primary-color: #07c160;
  --self-bubble-bg: #c6f8dc;
}

[data-theme='pink'] {
  --primary-color: #ff6b9d;
  --self-bubble-bg: #fad4e6;
}

.modern-chat-container.is-group {
  --other-bubble-bg: #f0f2f5;
}

.chat-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: var(--card-bg);
  border-bottom: 1px solid var(--border-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  z-index: 100;
}

.header-left,
.header-right {
  flex: 0 0 auto;
}

.back-icon,
.more-icon {
  font-size: 22px;
  color: var(--text-color);
  cursor: pointer;
}

.header-center {
  flex: 1;
  min-width: 0;
  padding: 0 16px;
}

.chat-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.chat-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.title-info {
  min-width: 0;
  flex: 1;
}

.name {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.subtitle {
  margin: 2px 0 0 0;
  font-size: 12px;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.message-list-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  /* 优化滚动性能 */
  -webkit-overflow-scrolling: touch;
  will-change: scroll-position;
  /* 使用 GPU 加速 */
  transform: translateZ(0);
}

.message-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  /* 优化渲染性能 */
  contain: layout style;
}

/* 加载更多历史消息按钮 */
.load-more-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  margin-bottom: 16px;
  background: #f7f8fa;
  border-radius: 20px;
  font-size: 13px;
  color: #646566;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
}

.load-more-trigger:hover {
  background: #ebedf0;
  color: #323233;
}

.load-more-trigger:active {
  transform: scale(0.98);
}

/* 时间分隔线 */
.time-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 16px 0;
}

.time-label {
  padding: 4px 12px;
  font-size: 12px;
  color: #999;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

/* 消息项 */
.message-item {
  margin-bottom: 16px;
  /* 优化单个消息项的渲染性能 */
  contain: layout style paint;
  /* 避免重绘 */
  transform: translateZ(0);
  clear: both;
}

.message-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  position: relative;
}

.message-wrapper.self-wrapper {
  align-items: flex-end;
}

.sender-info {
  margin-bottom: 4px;
  padding-left: 48px; /* 固定：40px头像 + 8px间距 */
}

.sender-name {
  font-size: 12px;
  color: #999;
  font-weight: 400;
}

.message-row {
  display: flex;
  gap: 8px; /* 固定间距：头像与消息框间距 */
  align-items: flex-start; /* 头像和消息框顶部对齐 */
  width: auto;
  max-width: 100%;
  position: relative;
  flex-wrap: nowrap; /* 防止换行 */
}

.message-row.self-row {
  flex-direction: row-reverse;
}

/* van-avatar 固定样式 - 防止被其他样式影响 */
.message-row :deep(.van-avatar) {
  width: 40px !important;
  height: 40px !important;
  flex-shrink: 0 !important;
  flex-grow: 0 !important;
  min-width: 40px !important;
  min-height: 40px !important;
  max-width: 40px !important;
  max-height: 40px !important;
  border-radius: 4px !important;
  overflow: hidden;
  position: relative;
  align-self: flex-start;
}

.message-content {
  display: flex;
  flex-direction: column;
  max-width: calc(100vw - 120px); /* 固定计算：减去头像(40px)、间距(8px)、padding等 */
  min-width: 60px;
  flex: 0 1 auto; /* 不影响头像尺寸 */
  overflow: hidden;
}

.message-bubble {
  position: relative;
  background: #fff;
  border-radius: 0; /* 完全矩形，四角尖锐 */
  padding: 10px 14px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  word-wrap: break-word;
  word-break: break-word;
  overflow-wrap: break-word;
  min-width: 0;
  /* 移除高度限制，消息框可以无限延伸 */
  /* 头像大小保持固定不受影响 */
}

.message-bubble.self {
  background: #95ec69;
  color: #000;
  border-radius: 0; /* 自己的消息也是完全矩形 */
}

.message-text {
  font-size: 15px;
  line-height: 1.6;
  color: #000;
  white-space: pre-wrap;
  word-break: break-word;
  overflow-wrap: break-word;
  word-wrap: break-word;
  min-width: 0;
  /* 长消息可以无限延伸，不限制高度 */
}

.input-area {
  display: flex;
  align-items: flex-end;
  padding: 12px 12px 8px;
  background: var(--card-bg);
  border-top: 1px solid var(--border-color);
  gap: 8px;
}

.input-tools {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.tool-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: #f2f3f5;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.tool-btn.active {
  background: var(--primary-color);
  color: white;
}

.tool-btn:hover {
  background: #e4e5e7;
}

.input-container {
  flex: 1;
  position: relative;
}

.message-input {
  width: 100%;
  min-height: 40px;
  max-height: 150px;
  resize: none;
  border: none;
  border-radius: 20px;
  padding: 10px 14px;
  font-size: 15px;
  line-height: 20px;
  background: #f2f3f5;
  outline: none;
  box-sizing: border-box;
  font-family: inherit;
}

.message-input:focus {
  background: #fff;
  box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb), 0.2);
}

.input-hints {
  position: absolute;
  right: 10px;
  bottom: 8px;
  font-size: 12px;
  color: var(--text-secondary);
  background: rgba(255, 255, 255, 0.8);
  padding: 2px 6px;
  border-radius: 10px;
  backdrop-filter: blur(4px);
}

.send-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.send-btn:disabled {
  background: #d2d3d4;
  cursor: not-allowed;
}

.send-btn:hover:not(:disabled) {
  transform: scale(1.05);
}

.loading-history {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
  padding: 12px 0;
  font-size: 13px;
  color: var(--text-secondary);
}

.empty-messages {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
}

.emoji-picker {
  position: absolute;
  bottom: 60px;
  left: 12px;
  right: 12px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px 16px 0 0;
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.08);
  padding: 12px;
  z-index: 1000;
  max-height: 250px;
  display: flex;
  flex-direction: column;
}

.emoji-tabs {
  display: flex;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 8px;
  margin-bottom: 8px;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 8px 0;
  font-size: 20px;
  cursor: pointer;
  border-radius: 8px;
}

.tab-item.active {
  color: var(--primary-color);
  background: rgba(var(--primary-color-rgb), 0.1);
}

.emoji-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 8px;
  flex: 1;
  overflow-y: auto;
  padding: 4px;
}

.emoji-item {
  font-size: 20px;
  text-align: center;
  cursor: pointer;
  padding: 6px;
  border-radius: 8px;
  transition: background-color 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.emoji-item:hover {
  background: #f2f3f5;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease-out;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}

@media (max-width: 768px) {
  .message-bubble {
    max-width: calc(100vw - 100px);
  }

  .message-content {
    max-width: calc(100vw - 100px);
  }

  .sender-info {
    padding-left: 48px; /* 保持固定 */
  }

  /* 确保头像在平板端也是固定的 */
  .message-row :deep(.van-avatar) {
    width: 40px !important;
    height: 40px !important;
  }
}

@media (max-width: 480px) {
  .message-bubble {
    max-width: calc(100vw - 80px);
  }

  .message-content {
    max-width: calc(100vw - 80px);
  }

  .chat-header {
    padding: 12px 12px;
  }

  .chat-avatar {
    width: 36px;
    height: 36px;
    border-radius: 3px;
  }

  .name {
    font-size: 14px;
  }

  .input-area {
    padding: 10px 8px 6px;
  }

  .sender-info {
    padding-left: 48px; /* 保持固定 */
  }

  .message-row {
    gap: 8px; /* 保持固定间距 */
  }

  /* 确保头像在手机端也是固定的 */
  .message-row :deep(.van-avatar) {
    width: 40px !important;
    height: 40px !important;
  }
}
</style>
