<template id="I">
  <!-- 加载骨架屏 -->
  <div v-if="loading" class="skeleton-container">
    <div class="skeleton-header">
      <van-skeleton-image class="skeleton-avatar" />
      <div class="skeleton-info">
        <van-skeleton title :row="3" />
      </div>
    </div>
    <van-skeleton title :row="2" class="skeleton-profile" />
    <van-skeleton title :row="1" class="skeleton-tags" />
    <van-skeleton title :row="1" class="skeleton-time" />
  </div>

  <!-- 用户信息展示区域 -->
  <div v-else-if="user" class="user-info-section">
    <!-- 头像和基本信息 -->
    <div class="user-header">
      <div class="avatar-container">
        <div class="avatar-wrapper">
          <img
            :src="user.avatarUrl || '/ava.jpg'"
            class="user-avatar"
            @error="handleImageError"
            :class="{ 'avatar-loading': avatarLoading }"
            @load="avatarLoading = false"
          />
          <div v-if="avatarLoading" class="avatar-placeholder">
            <van-icon name="user-o" size="32" color="#ccc" />
          </div>
        </div>
      </div>
      <div class="user-basic-info">
        <div class="user-name">{{ user.userName || '未设置用户名' }}</div>
        <div class="user-account">账号: {{ user.userAccount || '未知' }}</div>
        <div class="user-gender">
          性别: {{ user.gender === 1 ? '男' : user.gender === 0 ? '女' : '未知' }}
        </div>
      </div>
    </div>

    <!-- 个人简介 -->
    <div class="user-profile">
      <div class="profile-label">个人简介</div>
      <div class="profile-content" v-if="user.profile">
        <div
          :class="{ 'text-collapsed': !profileExpanded && user.profile.length > 100 }"
          class="profile-text"
        >
          {{ user.profile }}
        </div>
        <div
          v-if="user.profile.length > 100"
          class="expand-btn"
          @click="profileExpanded = !profileExpanded"
        >
          {{ profileExpanded ? '收起' : '展开' }}
        </div>
      </div>
      <div v-else class="empty-state">
        <van-icon name="edit" size="20" color="#ccc" />
        <span>暂无个人简介</span>
      </div>
    </div>

    <!-- 标签 -->
    <div class="user-tags">
      <div class="tags-label">标签</div>
      <div v-if="user.tags && user.tags.length > 0" class="tags-container">
        <div class="tags-scroll" :class="{ 'tags-scrollable': user.tags.length > 4 }">
          <van-tag
            color="#D94F4F"
            type="primary"
            v-for="tag in user.tags"
            :key="tag"
            class="tag-item"
          >
            {{ tag }}
          </van-tag>
        </div>
      </div>
      <div v-else class="empty-state">
        <van-icon name="label-o" size="20" color="#ccc" />
        <span>暂无标签</span>
      </div>
    </div>

    <!-- 创建时间 -->
    <div class="create-time">
      <span class="time-label">注册时间: </span>
      <span class="time-value">{{ dayjs(user.createTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
    </div>
  </div>

  <!-- 空状态 -->
  <div v-else class="empty-user-state">
    <van-empty description="获取用户信息失败" />
    <van-button type="primary" @click="loadUserData" class="retry-btn">重试</van-button>
  </div>

  <!-- 好友申请列表 -->
  <div v-if="friendRequests.length > 0 || friendRequestsLoading" class="friend-requests-section">
    <div class="section-header">
      <h3 class="section-title">好友申请</h3>
      <van-loading v-if="friendRequestsLoading" type="spinner" size="16px" />
    </div>

    <div v-if="friendRequestsLoading" class="loading-container">
      <van-skeleton title :row="3" />
    </div>

    <div v-else class="requests-list">
      <div v-for="request in friendRequests" :key="request.id" class="request-item">
        <div class="request-content">
          <div class="request-message">{{ request.message || '请求添加您为好友' }}</div>
          <div class="request-time">{{ dayjs(request.createTime).format('YYYY-MM-DD HH:mm') }}</div>
        </div>
        <div class="request-actions">
          <van-button type="primary" size="small" @click="acceptFriendRequest(request.id)">
            同意
          </van-button>
          <van-button type="default" size="small" @click="rejectFriendRequest(request.id)">
            拒绝
          </van-button>
        </div>
      </div>
    </div>
  </div>

  <van-divider />

  <!-- 功能导航区域 -->
  <div class="navigation-section">
    <van-grid :column-num="2" :gutter="12" class="nav-grid">
      <van-grid-item
        @click="navigateTo('/user')"
        class="nav-item"
        :class="{ 'nav-item-active': activeNavItem === 0 }"
        @touchstart="setActiveNav(0)"
        @touchend="clearActiveNav"
        @touchcancel="clearActiveNav"
      >
        <van-icon name="user-o" :size="iconSize" color="#1989fa" />
        <span class="grid-text">个人信息</span>
      </van-grid-item>

      <van-grid-item
        @click="navigateTo('/friends')"
        class="nav-item"
        :class="{ 'nav-item-active': activeNavItem === 1 }"
        @touchstart="setActiveNav(1)"
        @touchend="clearActiveNav"
        @touchcancel="clearActiveNav"
      >
        <van-icon name="friends" :size="iconSize" color="#07c160" />
        <span class="grid-text">我的好友</span>
      </van-grid-item>

      <van-grid-item
        @click="navigateTo('/JoinTeam')"
        class="nav-item"
        :class="{ 'nav-item-active': activeNavItem === 2 }"
        @touchstart="setActiveNav(2)"
        @touchend="clearActiveNav"
        @touchcancel="clearActiveNav"
      >
        <van-icon name="friends-o" :size="iconSize" color="#07c160" />
        <span class="grid-text">我加入的队伍</span>
      </van-grid-item>

      <van-grid-item
        @click="navigateTo('/myTeam')"
        class="nav-item"
        :class="{ 'nav-item-active': activeNavItem === 3 }"
        @touchstart="setActiveNav(3)"
        @touchend="clearActiveNav"
        @touchcancel="clearActiveNav"
      >
        <van-icon name="manager-o" :size="iconSize" color="#ff976a" />
        <span class="grid-text">我创建的队伍</span>
      </van-grid-item>

      <van-grid-item
        @click="navigateTo('/my/blog')"
        class="nav-item"
        :class="{ 'nav-item-active': activeNavItem === 4 }"
        @touchstart="setActiveNav(4)"
        @touchend="clearActiveNav"
        @touchcancel="clearActiveNav"
      >
        <van-icon name="edit" :size="iconSize" color="#9c26b0" />
        <span class="grid-text">我的博客分享</span>
      </van-grid-item>
    </van-grid>
  </div>

  <!-- 退出登录按钮 -->
  <div class="logout-section">
    <van-button
      class="logout-button-inline"
      type="primary"
      @click="logout"
      :loading="logoutLoading"
      loading-text="退出中..."
      block
    >
      退出登录
    </van-button>
  </div>
</template>

<script setup lang="ts">
import { api } from '@/api/apiClient'
import { showFailToast, showSuccessToast } from 'vant'
import { useRouter } from 'vue-router'
import { onMounted, ref, computed, onUnmounted } from 'vue'
import dayjs from 'dayjs'

const router = useRouter()
const user = ref()
const loading = ref(true)
const logoutLoading = ref(false)
const avatarLoading = ref(true)
const profileExpanded = ref(false)
const activeNavItem = ref(-1)
const screenWidth = ref(window.innerWidth)

interface FriendRequest {
  id: number
  fromUserId: number
  toUserId: number
  message: string
  status: number
  createTime: string
  updateTime: string
}

const friendRequests = ref<FriendRequest[]>([])
const friendRequestsLoading = ref(false)

// 响应式图标大小
const iconSize = computed(() => {
  if (screenWidth.value < 375) return 20
  if (screenWidth.value < 414) return 24
  return 28
})

// 主题设置

// 监听屏幕尺寸变化
const handleResize = () => {
  screenWidth.value = window.innerWidth
}

// 加载好友申请列表
const loadFriendRequests = async () => {
  try {
    friendRequestsLoading.value = true
    const response = await api.friendRequests.getFriendRequests()

    if (response.data.code === 0 && response.data.data) {
      // 只显示状态为0（待处理）的好友申请
      friendRequests.value = response.data.data.filter((request: any) => request.status === 0)
    } else {
      friendRequests.value = []
    }
  } catch (error) {
    /* removed noisy log: 获取好友申请列表失败 */
    showFailToast('获取好友申请列表失败')
    friendRequests.value = []
  } finally {
    friendRequestsLoading.value = false
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  loadUserData()
  loadFriendRequests()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// 同意好友申请
const acceptFriendRequest = async (requestId: number) => {
  try {
    const response = await api.friends.agreeFriendRequest({ id: requestId })

    if (response.data.code === 0) {
      showSuccessToast('已同意好友申请')
      // 从列表中移除已处理的申请
      friendRequests.value = friendRequests.value.filter((request: any) => request.id !== requestId)
    } else {
      showFailToast(response.data.message || '同意好友申请失败')
    }
  } catch (error) {
    /* removed noisy log: 同意好友申请失败 */
    showFailToast('网络错误，请重试')
  }
}

// 拒绝好友申请
const rejectFriendRequest = async (requestId: number) => {
  try {
    const response = await api.friends.disAgreeFriendRequest({ id: requestId })

    if (response.data.code === 0) {
      showSuccessToast('已拒绝好友申请')
      // 从列表中移除已处理的申请
      friendRequests.value = friendRequests.value.filter((request: any) => request.id !== requestId)
    } else {
      showFailToast(response.data.message || '拒绝好友申请失败')
    }
  } catch (error) {
    /* removed noisy log: 拒绝好友申请失败 */
    showFailToast('网络错误，请重试')
  }
}

// 获取用户信息
const loadUserData = async () => {
  loading.value = true
  try {
    const res = await api.user.getCurrentUser()
    if (res.data.code === 0) {
      user.value = res.data.data
      // 解析标签JSON字符串
      if (user.value.tags) {
        try {
          user.value.tags = JSON.parse(user.value.tags)
        } catch (e) {
          user.value.tags = []
        }
      } else {
        user.value.tags = []
      }
      showSuccessToast('获取用户信息成功')
    } else {
      showFailToast('获取用户信息失败')
      user.value = null
    }
  } catch (error) {
    showFailToast('获取用户信息失败')
    user.value = null
  } finally {
    loading.value = false
  }
}

// 退出登录
const logout = async () => {
  logoutLoading.value = true
  try {
    const res = await api.user.userLogout()
    if (res.data.code === 0) {
      showSuccessToast('退出登录成功')
      // 重置好友缓存（防止上一个账号的好友关系残留）
      try {
        const { useFriendStore } = await import('@/stores/friendStore')
        useFriendStore().$reset()
      } catch (e) {
        // 忽略重置异常
      }
      router.push('/user/login')
    } else {
      showFailToast('退出登录失败')
    }
  } catch (error) {
    showFailToast('退出登录失败')
  } finally {
    logoutLoading.value = false
  }
}

// 页面导航
const navigateTo = (path: string) => {
  router.push(path)
}

// 触摸反馈
const setActiveNav = (index: number) => {
  activeNavItem.value = index
}

const clearActiveNav = () => {
  setTimeout(() => {
    activeNavItem.value = -1
  }, 150)
}

// 头像加载失败处理
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/ava.jpg'
  avatarLoading.value = false
}
</script>

<style scoped>
/* 骨架屏样式 */
.skeleton-container {
  padding: 20px;
  background: #fff;
  margin-bottom: 10px;
}

.skeleton-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.skeleton-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-right: 15px;
  flex-shrink: 0;
}

.skeleton-info {
  flex: 1;
}

.skeleton-profile,
.skeleton-tags,
.skeleton-time {
  margin-bottom: 15px;
}

/* 用户信息区域样式 */
.user-info-section {
  padding: 16px;
  background: #fff;
  margin: 0 8px 10px 8px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.user-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.avatar-container {
  margin-right: 16px;
  flex-shrink: 0;
}

.avatar-wrapper {
  position: relative;
  width: 80px;
  height: 80px;
}

.user-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #f0f0f0;
  transition: all 0.3s ease;
}

.avatar-loading {
  opacity: 0;
}

.avatar-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid #f0f0f0;
}

.user-basic-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 6px;
  word-break: break-word;
}

.user-account {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}

.user-gender {
  font-size: 14px;
  color: #666;
}

.user-profile {
  margin-bottom: 20px;
}

.profile-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
  font-weight: 500;
}

.profile-content {
  position: relative;
}

.profile-text {
  font-size: 15px;
  color: #333;
  line-height: 1.6;
  word-break: break-word;
  transition: all 0.3s ease;
}

.text-collapsed {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.expand-btn {
  color: #1989fa;
  font-size: 14px;
  margin-top: 8px;
  cursor: pointer;
  user-select: none;
  transition: color 0.2s ease;
  min-height: 44px;
  display: flex;
  align-items: center;
}

.expand-btn:active {
  color: #0570d1;
}

.user-tags {
  margin-bottom: 20px;
}

.tags-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
  font-weight: 500;
}

.tags-container {
  position: relative;
}

.tags-scroll {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tags-scrollable {
  overflow-x: auto;
  flex-wrap: nowrap;
  padding-bottom: 4px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.tags-scrollable::-webkit-scrollbar {
  display: none;
}

.tag-item {
  flex-shrink: 0;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 12px;
}

.create-time {
  font-size: 13px;
  color: #666;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.time-label {
  color: #999;
}

.time-value {
  color: #666;
  font-weight: 500;
}

/* 空状态样式 */
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: #999;
  font-size: 14px;
  gap: 8px;
}

.empty-user-state {
  padding: 40px 20px;
  text-align: center;
}

.retry-btn {
  margin-top: 16px;
  min-height: 44px;
}

/* 导航区域样式 */
.navigation-section {
  background: #fff;
  padding: 16px;
  margin: 0 8px 20px 8px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.nav-grid {
  --van-grid-item-content-padding: 16px 8px;
}

.nav-item {
  border-radius: 12px;
  transition: all 0.2s ease;
  min-height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.nav-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.05);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.nav-item-active::before {
  opacity: 1;
}

.grid-text {
  display: block;
  margin-top: 8px;
  font-size: 13px;
  color: #333;
  font-weight: 500;
  text-align: center;
  line-height: 1.2;
}

/* 退出登录按钮样式 */
.logout-section {
  margin: 0 8px 20px 8px;
  padding-bottom: 20px;
}

.logout-button-inline {
  background-color: #64c8aa;
  border-color: #64c8aa;
  color: white;
  border-radius: 12px;
  min-height: 48px;
  font-weight: 500;
  font-size: 16px;
  box-shadow: 0 2px 8px rgba(100, 200, 170, 0.2);
  transition: all 0.3s ease;
}

.logout-button-inline:active {
  transform: translateY(1px);
  box-shadow: 0 1px 4px rgba(100, 200, 170, 0.2);
}

/* 响应式设计 */
@media (max-width: 375px) {
  .user-info-section {
    padding: 12px 16px;
    margin: 0 4px 8px 4px;
  }

  .navigation-section {
    padding: 12px;
    margin: 0 4px 16px 4px;
  }

  .avatar-wrapper {
    width: 70px;
    height: 70px;
  }

  .user-name {
    font-size: 18px;
  }

  .user-account,
  .user-gender {
    font-size: 13px;
  }

  .grid-text {
    font-size: 12px;
  }

  .logout-section {
    margin: 0 4px 16px 4px;
  }

  .logout-button-inline {
    min-height: 44px;
    font-size: 15px;
  }
}

@media (max-width: 320px) {
  .user-header {
    margin-bottom: 16px;
  }

  .avatar-container {
    margin-right: 12px;
  }

  .avatar-wrapper {
    width: 60px;
    height: 60px;
  }

  .user-name {
    font-size: 16px;
  }

  .nav-item {
    min-height: 70px;
  }
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .user-info-section,
  .navigation-section {
    background: #1a1a1a;
    color: #fff;
  }

  .user-name {
    color: #fff;
  }

  .user-account,
  .user-gender,
  .profile-label,
  .tags-label,
  .time-label,
  .time-value {
    color: #ccc;
  }

  .profile-text {
    color: #e6e6e6;
  }

  .create-time {
    border-top-color: #333;
  }

  .avatar-placeholder {
    background: #333;
    border-color: #444;
  }

  .user-avatar {
    border-color: #444;
  }
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  .user-avatar {
    border-width: 2px;
    border-color: #000;
  }

  .nav-item {
    border: 1px solid #000;
  }

  .logout-button {
    border: 2px solid #000;
  }
}

/* 好友申请列表样式 */
.friend-requests-section {
  background: #fff;
  margin: 0 8px 10px 8px;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.loading-container {
  padding: 20px 0;
}

.requests-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.request-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #eee;
}

.request-content {
  flex: 1;
  min-width: 0;
  margin-right: 12px;
}

.request-message {
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
  word-break: break-word;
}

.request-time {
  font-size: 12px;
  color: #999;
}

.request-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.request-actions .van-button {
  min-width: 50px;
}

/* 减少动画模式 */
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
    animation: none !important;
  }
}
</style>
