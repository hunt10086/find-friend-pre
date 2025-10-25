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
      <van-icon
        name="cross"
        size="20"
        color="#666"
        class="close-btn"
        @click="closeModal"
      />
    </div>

    <div v-if="loading" class="loading-container">
      <van-loading type="spinner" color="#1989fa" size="24px">
        加载中...
      </van-loading>
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
      <div class="action-buttons">
        <van-button
          type="primary"
          round
          icon="chat-o"
          @click="startChat"
          class="action-btn"
        >
          打招呼
        </van-button>
        <van-button
          type="success"
          round
          icon="plus"
          @click="addFriend"
          class="action-btn"
        >
          添加好友
        </van-button>
      </div>
    </div>

    <div v-else class="error-container">
      <van-empty
        image="error"
        description="用户信息加载失败"
      >
        <van-button type="primary" @click="retryLoad">重试</van-button>
      </van-empty>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { getUserSearchOne } from '@/api/controller/YongHuJieKou/getUserSearchOne.js'
import { showFailToast, showSuccessToast } from 'vant'

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

// 监听父组件的显示状态变化
watch(() => props.modelValue, (newVal) => {
  show.value = newVal
  if (newVal && props.userId) {
    loadUserInfo()
  }
})

// 监听内部显示状态变化，同步到父组件
watch(show, (newVal) => {
  emit('update:modelValue', newVal)
})

// 监听用户ID变化
watch(() => props.userId, (newUserId) => {
  if (newUserId && show.value) {
    loadUserInfo()
  }
})

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
    } else {
      showFailToast('获取用户信息失败')
      userInfo.value = null
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
    showFailToast('网络错误，请重试')
    userInfo.value = null
  } finally {
    loading.value = false
  }
}

// 重试加载
const retryLoad = () => {
  loadUserInfo()
}

// 关闭模态框
const closeModal = () => {
  show.value = false
  userInfo.value = null
}

// 图片加载失败处理
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/ava.jpg'
}

// 打招呼
const startChat = () => {
  if (userInfo.value) {
    showSuccessToast(`向 ${userInfo.value.userName} 打招呼`)
  }
}

// 添加好友
const addFriend = () => {
  if (userInfo.value) {
    showSuccessToast(`已向 ${userInfo.value.userName} 发送好友请求`)
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