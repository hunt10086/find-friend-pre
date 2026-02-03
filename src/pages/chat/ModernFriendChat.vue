<template>
  <ModernChatInterface
    :chat-type="'friend'"
    :chat-info="chatInfo"
    @send-message="handleSendMessage"
    @go-back="goBack"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ModernChatInterface from '@/components/ModernChatInterface.vue'
import { showFailToast, showSuccessToast } from 'vant'
import myAxios from '@/plugins/myAxios.js'
import { useFriendStore } from '@/stores/friendStore'

interface FriendMessage {
  id?: number
  senderId?: number
  receiverId?: number
  messageContent?: string
  sendTime?: string
  status?: number
  content?: string
  createTime?: string
  localId?: string
  sending?: boolean
  failed?: boolean
}

const route = useRoute()
const router = useRouter()
const friendId = ref<number | null>(Number(route.params.friendId) || null)

// Chat info
const chatInfo = ref({
  id: 0,
  name: '好友',
  avatar: '',
  subtitle: '在线',
})

// Mock messages - 在实际实现中，这将从API获取
const messages = ref<FriendMessage[]>([])

// 获取好友信息
const loadFriendInfo = async () => {
  if (!friendId.value) return
  try {
    const res = await getUserSearchOne({ id: friendId.value })
    if (res.data.code === 0 && res.data.data) {
      chatInfo.value = {
        id: friendId.value,
        name: res.data.data.userName || '好友',
        avatar: res.data.data.avatarUrl || '',
        subtitle: '在线',
      }
    }
  } catch (e) {
    // 加载好友信息失败，静默处理
  }
}

// 处理发送消息
const handleSendMessage = async (content: string) => {
  // 这里实现实际的消息发送逻辑
  showSuccessToast('消息发送成功')
}

// 返回上一页
const goBack = () => {
  router.go(-1)
}

onMounted(async () => {
  await loadFriendInfo()
})
</script>

<style scoped>
/* 可以根据需要添加特定于好友聊天的样式 */
</style>
