<template>
  <div class="home-header">
    <div class="header-title">
      <van-icon name="fire-o" color="#ee0a24" size="20" />
      <span>推荐用户</span>
    </div>
    <div class="header-actions">
      <van-button type="primary" size="small" plain round @click="goToFriends">
        <van-icon name="friends-o" />
        我的好友
      </van-button>
      <van-button
        type="primary"
        size="small"
        round
        @click="findMore"
        color="linear-gradient(to right, #ff6034, #ee0a24)"
      >
        <van-icon name="location-o" />
        附近用户
      </van-button>
    </div>
  </div>

  <div class="user-cards-container">
    <div
      class="user-card"
      v-for="(user, index) in userList"
      :key="user.id"
      :style="{ animationDelay: `${index * 0.1}s` }"
    >
      <div class="user-avatar">
        <img :src="user.avatarUrl || '/ava.jpg'" :alt="user.userName" @error="handleImageError" />
      </div>

      <div class="user-info">
        <div class="user-header">
          <h3 class="user-name">{{ user.userName }}</h3>
        </div>

        <div class="user-tags" v-if="user.tags && user.tags.length">
          <van-tag
            class="user-tag"
            plain
            type="primary"
            size="small"
            v-for="tag in getDisplayTags(user)"
            :key="tag"
          >
            {{ tag }}
          </van-tag>
          <van-button
            v-if="user.tags.length > 3"
            class="expand-tags-btn"
            size="mini"
            plain
            @click="toggleTagsExpand(user)"
          >
            {{ user.tagsExpanded ? '收起' : `+${user.tags.length - 3}` }}
          </van-button>
        </div>

        <p class="user-profile" v-if="user.profile">
          {{ user.profile }}
        </p>

        <div class="user-actions">
          <van-button type="success" size="small" round icon="guide-o" @click="viewProfile(user)">
            查看资料
          </van-button>
        </div>
      </div>
    </div>
  </div>

  <div class="pagination-container">
    <van-button
      :disabled="!flagPre"
      plain
      type="primary"
      size="small"
      icon="arrow-left"
      @click="GoPre"
      class="page-btn"
    >
      上一页
    </van-button>

    <div class="page-info">
      <span class="current-page">{{ cont }}</span>
      <span class="divider">/</span>
      <span class="total-pages">{{ max }}</span>
    </div>

    <van-button
      :disabled="!flag"
      plain
      type="primary"
      size="small"
      icon="arrow"
      icon-position="right"
      @click="loadMore"
      class="page-btn"
    >
      下一页
    </van-button>

    <div class="jump-control">
      <input v-model="jumpPageInput" type="number" placeholder="页" @keyup.enter="goToPage" />
      <span class="jump-btn" @click="goToPage">GO</span>
    </div>
  </div>

  <!-- 用户资料模态框 -->
  <UserProfileModal v-model="showProfileModal" :userId="selectedUserId" />
</template>

<script setup lang="ts">
import { onMounted, ref, onActivated } from 'vue'
import { api } from '@/api/apiClient'
import router from '@/config/router.ts'
import UserProfileModal from '@/components/UserProfileModal.vue'

const userList = ref()
const size = ref(8)
const cont = ref(1)
const max = ref(100)
const flag = ref(true)
const flagPre = ref(false)
const showProfileModal = ref(false)
const selectedUserId = ref(null)
const jumpPageInput = ref('')

const loadUserData = async () => {
  try {
    const res = await api.user.userListLike({
      count: cont.value,
    })

    if (res.data && res.data.data) {
      res.data.data.forEach((user: any) => {
        if (user.tags && typeof user.tags === 'string') {
          try {
            user.tags = JSON.parse(user.tags)
          } catch (e) {
            console.error('解析用户标签失败', e)
            user.tags = []
          }
        }
      })
      userList.value = res.data.data
    } else {
      userList.value = []
    }

    // 根据返回的数据量判断是否有下一页
    if (!userList.value || userList.value.length < size.value) {
      flag.value = false
    } else {
      flag.value = true
    }

    // 判断是否有上一页
    flagPre.value = cont.value > 1
  } catch (error) {
    console.error('获取用户列表失败', error)
    userList.value = []
  }
}

onMounted(async () => {
  await loadUserData()
})

// 当页面从缓存中激活时重新获取数据
onActivated(async () => {
  // 重置到第一页并重新加载数据
  cont.value = 1
  flagPre.value = false
  await loadUserData()
})

const loadMore = async () => {
  cont.value++
  await loadUserData()
}

const GoPre = async () => {
  if (cont.value > 1) {
    cont.value--
    await loadUserData()
  }
}

const getDefaultAvatarText = (user) => {
  return user.userName ? user.userName.charAt(0).toUpperCase() : 'U'
}

const findMore = () => {
  router.push('/nearUsers')
}

const goToFriends = () => {
  router.push('/friends')
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/ava.jpg'
}

// 查看资料
const viewProfile = (user) => {
  selectedUserId.value = user.id
  showProfileModal.value = true
}

// 获取要显示的标签
const getDisplayTags = (user) => {
  if (!user.tags || !user.tags.length) return []

  // 如果已展开或标签数量少于等于3个，显示全部标签
  if (user.tagsExpanded || user.tags.length <= 3) {
    return user.tags
  }

  // 否则只显示前3个标签
  return user.tags.slice(0, 3)
}

// 切换标签展开状态
const toggleTagsExpand = (user) => {
  // 使用 Vue 的响应式系统
  if (user.tagsExpanded === undefined) {
    user.tagsExpanded = false
  }
  user.tagsExpanded = !user.tagsExpanded
}

// 页面跳转功能
const goToPage = async () => {
  if (!jumpPageInput.value) return

  let targetPage = parseInt(jumpPageInput.value)

  // 验证输入的页码
  if (isNaN(targetPage) || targetPage < 1) {
    targetPage = 1
  } else if (targetPage > max.value) {
    targetPage = max.value
  }

  cont.value = targetPage
  jumpPageInput.value = '' // 清空输入框

  // 加载指定页的数据
  await loadUserData()
}
</script>

<style scoped>
/* 页面头部样式 */
.home-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 16px 12px;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.header-actions .van-button {
  padding: 0 12px;
  height: 32px;
  line-height: 30px;
}

/* 用户卡片容器 */
.user-cards-container {
  padding: 0 16px;
  margin-bottom: 20px;
}

/* 用户卡片样式 - 现代简约风格 */
.user-card {
  background: linear-gradient(135deg, #e6e6fa 0%, #f5f5dc 100%);
  border: 1px solid #a89f91;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  gap: 16px;
  position: relative;
  overflow: hidden;
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease;
}

.user-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

/* 用户头像区域 */
.user-avatar {
  position: relative;
  flex-shrink: 0;
}

.user-avatar img {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.user-avatar img:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

/* 用户信息区域 */
.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.user-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.user-name {
  font-size: 18px;
  font-weight: 600;
  color: #003366;
  margin: 0;
  padding: 0;
}

.user-id {
  font-size: 12px;
  color: #95a5a6;
  font-weight: 500;
}

/* 用户标签 */
.user-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 4px;
}

.user-tag {
  font-size: 12px;
  border-radius: 12px;
  background: #e3f2fd;
  border-color: #bbdefb;
  color: #1976d2;
}

.expand-tags-btn {
  font-size: 11px;
  padding: 2px 6px;
  height: 20px;
  line-height: 16px;
  border-radius: 10px;
  border-color: #bbdefb;
  color: #1976d2;
  background: #e3f2fd;
  transition: all 0.2s ease;
  align-self: center;
  min-width: 32px;
}

.expand-tags-btn:hover {
  background: #bbdefb;
  border-color: #90caf9;
}

.expand-tags-btn:active {
  transform: scale(0.95);
}

/* 用户简介 */
.user-profile {
  font-size: 14px;
  color: #4b4b4b;
  line-height: 1.4;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 用户操作按钮 */
.user-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.user-actions .van-button {
  padding: 6px 16px;
  font-size: 13px;
  height: auto;
  border-radius: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  border: 1px solid #e0e0e0;
  background: #fafafa;
  color: #2c3e50;
}

.user-actions .van-button--success {
  background: #003366;
  color: white;
  border-color: #003366;
}

.user-actions .van-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.user-actions .van-button:active {
  transform: translateY(0);
}

/* 分页样式 */
.pagination-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 20px 0 40px;
}

.page-info {
  display: flex;
  align-items: baseline;
  gap: 4px;
  font-family: 'Helvetica Neue', Helvetica, sans-serif;
}

.current-page {
  font-size: 20px;
  font-weight: 600;
  color: #003366;
}

.divider {
  font-size: 14px;
  color: #999;
}

.total-pages {
  font-size: 14px;
  color: #666;
}

.page-btn {
  min-width: 80px;
  border-color: #a89f91 !important;
  color: #003366 !important;
}

.jump-control {
  display: flex;
  align-items: center;
  background: #e6e6fa;
  border-radius: 16px;
  padding: 2px 4px;
  margin-left: 8px;
  border: 1px solid #a89f91;
}

.jump-control input {
  width: 32px;
  border: none;
  background: transparent;
  text-align: center;
  font-size: 12px;
  padding: 4px 0;
  color: #003366;
}

.jump-control input:focus {
  outline: none;
}

.jump-btn {
  font-size: 12px;
  color: #003366;
  font-weight: 600;
  padding: 4px 8px;
  cursor: pointer;
  border-left: 1px solid rgba(0, 51, 102, 0.1);
}

/* 动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .user-cards-container {
    padding: 0 12px;
  }

  .user-card {
    padding: 12px;
    gap: 12px;
  }

  .user-avatar img {
    width: 64px;
    height: 64px;
  }

  .user-name {
    font-size: 16px;
  }

  .user-profile {
    font-size: 13px;
  }

  .user-actions {
    gap: 8px;
  }

  .user-actions .van-button {
    padding: 5px 12px;
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .user-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .user-header {
    flex-direction: column;
    gap: 4px;
  }

  .pagination-container {
    gap: 10px;
  }

  .page-btn {
    min-width: 60px;
    padding: 0 8px;
    font-size: 12px;
  }

  .current-page {
    font-size: 16px;
  }

  .user-actions {
    justify-content: center;
  }
}
</style>
