<template>
  <ModernChatInterface
    :chat-type="'group'"
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

interface TeamMessage {
  id?: number
  userId?: number
  userName?: string
  avatarUrl?: string
  content?: string
  createTime?: string
  localId?: string
}

const route = useRoute()
const router = useRouter()
const teamId = ref(route.params.teamId)

// Chat info
const chatInfo = ref({
  id: 0,
  name: '队伍聊天',
  avatar: '',
  subtitle: '多人聊天',
})

// Mock messages - 在实际实现中，这将从API获取
const messages = ref<TeamMessage[]>([])

// 获取队伍信息
const loadTeamInfo = async () => {
  try {
    // 实际实现中从API获取队伍信息
    const res = await myAxios.get(`/team/${teamId.value}`)
    if (res.data.code === 0 && res.data.data) {
      chatInfo.value = {
        id: Number(teamId.value),
        name: res.data.data.teamName || '队伍聊天',
        avatar: res.data.data.icon || '',
        subtitle: `团队聊天 • ${res.data.data.nowNum || 0}人在线`,
      }
    }
  } catch (e) {
    // 加载队伍信息失败，静默处理
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
  await loadTeamInfo()
})
</script>

<style scoped>
/* 可以根据需要添加特定于团队聊天的样式 */
</style>
