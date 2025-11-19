<template>
  <van-popup
    v-model:show="show"
    position="center"
    round
    :style="{ width: '90%', maxWidth: '400px', maxHeight: '80vh', overflow: 'auto' }"
    :close-on-click-overlay="false"
    class="user-profile-modal"
  >
    <div class="modal-header">
      <h3 class="modal-title">用户资料</h3>
      <van-icon name="cross" size="20" color="#666" class="close-btn" @click="closeModal" />
    </div>

    <div v-if="loading" class="loading-container">
      <van-loading type="spinner" color="#1989fa" size="24px"> 加载中... </van-loading>
    </div>

    <div v-else-if="userInfo" class="profile-content">
      <!-- 用户头像和基本信息 -->
      <div class="profile-header">
        <div class="avatar-container">
          <img
            :src="userInfo.avatarUrl || '/ava.jpg'"
            :alt="userInfo.userName"
            @error="handleImageError"
            class="profile-avatar"
          />
          <div class="gender-badge" v-if="userInfo.gender !== undefined">
            <van-icon :name="userInfo.gender === 1 ? 'smile-o' : 'smile'" />
          </div>
        </div>

        <div class="basic-info">
          <h2 class="user-name">{{ userInfo.userName }}</h2>
          <div class="user-meta">
            <span class="user-id">ID: #{{ userInfo.id }}</span>
            <span class="user-account">@{{ userInfo.userAccount }}</span>
          </div>
        </div>
      </div>

      <!-- 个人简介 -->
      <div class="profile-section" v-if="userInfo.profile">
        <h4 class="section-title">
          <van-icon name="description" />
          个人简介
        </h4>
        <p class="profile-text">{{ userInfo.profile }}</p>
      </div>

      <!-- 标签 -->
      <div class="profile-section" v-if="userInfo.tags && userInfo.tags.length">
        <h4 class="section-title">
          <van-icon name="label-o" />
          兴趣标签
        </h4>
        <div class="tags-container">
          <van-tag
            v-for="tag in userInfo.tags"
            :key="tag"
            class="user-tag"
            type="primary"
            plain
            size="medium"
          >
            {{ tag }}
          </van-tag>
        </div>
      </div>

      <!-- 联系信息 -->
      <div class="profile-section">
        <h4 class="section-title">
          <van-icon name="contact" />
          联系方式
        </h4>
        <div class="contact-info">
          <div class="contact-item" v-if="userInfo.phone">
            <van-icon name="phone-o" />
            <span>{{ userInfo.phone }}</span>
          </div>
          <div class="contact-item" v-if="userInfo.email">
            <van-icon name="envelop-o" />
            <span>{{ userInfo.email }}</span>
          </div>
        </div>
      </div>

      <!-- 位置信息 -->
      <div class="profile-section" v-if="userInfo.latitude && userInfo.longitude">
        <h4 class="section-title">
          <van-icon name="location-o" />
          位置信息
        </h4>
        <div class="location-info">
          <van-icon name="compass-o" />
          <span>经度: {{ userInfo.longitude }}</span>
          <span>纬度: {{ userInfo.latitude }}</span>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons" v-if="!isFriend">
        <van-button
          type="success"
          round
          icon="plus"
          @click="addFriend"
          class="action-btn"
          :loading="isAddingFriend"
        >
          {{ hasSentRequest ? '已发送好友申请，请勿重复点击' : '添加好友' }}
        </van-button>
      </div>
      <div class="action-buttons" v-else>
        <van-button type="success" round disabled class="action-btn"> 已是好友 </van-button>
      </div>
    </div>

    <div v-else class="error-container" v-if="show">
      <van-empty image="error" description="用户信息加载失败">
        <van-button type="primary" @click="retryLoad">重试</van-button>
      </van-empty>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { getUserSearchOne } from '@/api/controller/YongHuJieKou/getUserSearchOne.js'
import { showFailToast, showSuccessToast } from 'vant'
import { useFriendStore } from '@/stores/friendStore'

interface UserInfo {
  id: number
  userName: string
  userAccount: string
  avatarUrl: string
  gender: number
  tags: string[]
  phone: string
  email: string
  profile: string
  latitude: number
  longitude: number
  createTime: string
  userStatus: number
  userRole: number
}

const props = defineProps<{
  modelValue: boolean
  userId: number | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const show = ref(props.modelValue)
const loading = ref(false)
const userInfo = ref<UserInfo | null>(null)
const isFriend = ref(false)
const hasSentRequest = ref(false)
const isAddingFriend = ref(false)

const friendStore = useFriendStore()

// 监听父组件的显示状态变化
watch(
  () => props.modelValue,
  (newVal) => {
    show.value = newVal
    if (newVal && props.userId) {
      loadUserInfo()
    }
  },
)

// 监听内部显示状态变化，同步到父组件
watch(show, (newVal) => {
  emit('update:modelValue', newVal)
})

// 监听用户ID变化
watch(
  () => props.userId,
  (newUserId) => {
    if (newUserId && show.value) {
      loadUserInfo()
    }
  },
)

// 加载用户信息
const loadUserInfo = async () => {
  if (!props.userId) return

  try {
    loading.value = true
    const response = await getUserSearchOne({ id: props.userId })

    if (response.data.code === 0 && response.data.data) {
      const userData = response.data.data

      // 解析标签
      if (userData.tags && typeof userData.tags === 'string') {
        try {
          userData.tags = JSON.parse(userData.tags)
        } catch (e) {
          userData.tags = []
        }
      }

      userInfo.value = userData

      // 检查是否为好友
      await checkFriendStatus()
    } else {
      showFailToast('获取用户信息失败')
      userInfo.value = null
    }
  } catch (error) {
    /* log removed: 获取用户信息失败 */
    showFailToast('网络错误，请重试')
    userInfo.value = null
  } finally {
    loading.value = false
  }
}

// 检查好友状态
const checkFriendStatus = async () => {
  if (!props.userId) return
  // 确保好友列表已加载
  await friendStore.ensureLoaded()
  if (friendStore.isFriend(props.userId)) {
    isFriend.value = true
  } else {
    isFriend.value = false
    await checkFriendRequestStatus()
  }
}

// 检查好友申请状态
const checkFriendRequestStatus = async () => {
  if (!props.userId) return

  try {
    // 导入好友申请列表API
    const { getFriendRequestsList } = await import(
      '@/api/controller/HaoYouShenQingJieKou/getFriendRequestsList.js'
    )
    const response = await getFriendRequestsList()

    if (response.data.code === 0 && response.data.data) {
      // 检查是否有发送给该用户的好友申请
      // 注意：根据接口定义，字段可能是toUserId而不是receiverId
      const requests = response.data.data
      const hasRequest = requests.some(
        (request: any) => request.toUserId === props.userId && request.status === 0,
      )
      hasSentRequest.value = hasRequest
    }
  } catch (error) {
    /* log removed: 检查好友申请状态失败 */
  }
}

// 重试加载
const retryLoad = () => {
  loadUserInfo()
}

// 关闭模态框
const closeModal = () => {
  // 先关闭弹窗，避免在关闭动画期间因为 userInfo 被置空而进入错误分支造成闪烁
  show.value = false
  // 使用微任务/异步延迟清理数据，等待 Popup 已经从 DOM 中移除
  setTimeout(() => {
    userInfo.value = null
    isFriend.value = false
    hasSentRequest.value = false
  }, 0)
}

// 图片加载失败处理
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/ava.jpg'
}

// 添加好友
const addFriend = async () => {
  if (!userInfo.value || hasSentRequest.value || isFriend.value) return
  try {
    isAddingFriend.value = true
    const result = await friendStore.addFriendRequest(
      userInfo.value.id,
      `你好，我是${userInfo.value.userName}，希望能和你成为好友！`,
    )
    if (result.success) {
      showSuccessToast('好友申请已发送')
      hasSentRequest.value = true
    } else {
      showFailToast(result.message || '发送好友申请失败')
    }
  } catch (error) {
    /* log removed: 发送好友申请失败 */
    showFailToast('网络错误，请重试')
  } finally {
    isAddingFriend.value = false
  }
}
</script>

<style scoped>
.user-profile-modal {
  border-radius: 16px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  background: linear-gradient(135deg, #f8f9ff 0%, #fff 100%);
  border-radius: 16px 16px 0 0;
}

.modal-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
}

.close-btn {
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background-color: #f5f5f5;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
}

.profile-content {
  padding: 20px;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.avatar-container {
  position: relative;
  flex-shrink: 0;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.gender-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  border: 2px solid #fff;
}

.basic-info {
  flex: 1;
}

.user-name {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
}

.user-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-id {
  font-size: 14px;
  color: #95a5a6;
  font-weight: 500;
}

.user-account {
  font-size: 13px;
  color: #7f8c8d;
}

.profile-section {
  margin-bottom: 20px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
}

.section-title .van-icon {
  color: #667eea;
}

.profile-text {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #7f8c8d;
  white-space: pre-wrap;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.user-tag {
  border-radius: 16px;
  background: rgba(102, 126, 234, 0.1);
  border-color: rgba(102, 126, 234, 0.3);
  color: #667eea;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #7f8c8d;
}

.contact-item .van-icon {
  color: #667eea;
  font-size: 16px;
}

.location-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #7f8c8d;
}

.location-info .van-icon {
  color: #667eea;
  margin-right: 4px;
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.action-btn {
  flex: 1;
  height: 44px;
  border-radius: 22px;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.error-container {
  padding: 40px 20px;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .profile-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 12px;
  }

  .user-meta {
    align-items: center;
  }

  .action-buttons {
    flex-direction: column;
    gap: 8px;
  }

  .action-btn {
    width: 100%;
  }
}
</style>
