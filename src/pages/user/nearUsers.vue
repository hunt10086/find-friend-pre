<template>
  <div v-if="flag" class="nearby-cards-container">
    <div
      class="nearby-card"
      v-for="(user, index) in userList"
      :key="user.id"
      :style="{ animationDelay: `${index * 0.1}s` }"
    >
      <div class="nearby-header">
        <div class="nearby-avatar">
          <img
            :src="user.avatarUrl || '/ava.jpg'"
            :alt="user.userName"
            @error="handleImageError"
          />
          <div class="distance-badge">
            <van-icon name="location-o" />
            {{ formatDistance(user.distance) }}
          </div>
        </div>
        <div class="nearby-info">
          <h3 class="nearby-name">{{ user.userName }}</h3>
          <div class="nearby-id">用户ID: #{{ user.id }}</div>
          <div class="nearby-distance">
            <van-icon name="compass-o" />
            距离你 {{ formatDistance(user.distance) }}
          </div>
        </div>
      </div>

      <div class="nearby-content">
        <p class="nearby-profile" v-if="user.profile">
          {{ user.profile }}
        </p>

        <div class="nearby-tags" v-if="user.tags && user.tags.length">
          <van-tag
            class="nearby-tag"
            plain
            type="primary"
            size="small"
            v-for="tag in getDisplayTags(user)"
            :key="tag"
          >
            {{ tag }}
          </van-tag>
          <van-button
            v-if="user.tags.length > 5"
            class="expand-tags-btn"
            size="mini"
            plain
            @click="toggleTagsExpand(user)"
          >
            {{ user.tagsExpanded ? '收起' : `+${user.tags.length - 5}` }}
          </van-button>
        </div>
      </div>

      <div class="nearby-actions">
        <van-button
          type="success"
          size="small"
          round
          icon="guide-o"
          @click="viewProfile(user)"
        >
          查看资料
        </van-button>
      </div>

      <div class="nearby-card-bg"></div>
    </div>
  </div>

  <div v-else class="empty-container">
    <van-empty
      image="https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png"
      description="附近没有用户"
    >
      <van-button
        round
        type="primary"
        class="refresh-button"
        @click="refreshData"
      >
        刷新位置
      </van-button>
    </van-empty>
  </div>

  <div id="blank">
    <van-divider />
  </div>

  <!-- 用户资料模态框 -->
  <UserProfileModal
    v-model="showProfileModal"
    :userId="selectedUserId"
  />
</template>

<script setup lang="ts">
import { onMounted, ref, onActivated } from 'vue'
import { getUserNearUser } from '@/api/controller/YongHuJieKou/getUserNearUser.js'
import { showFailToast, showSuccessToast } from 'vant'
import { useRouter } from 'vue-router'
import UserProfileModal from '@/components/UserProfileModal.vue'

// 为组件设置名称，确保 keep-alive 能正确缓存
defineOptions({
  name: 'NearUsers'
})

const router = useRouter()
const userList = ref()
const flag = ref(false)
const showProfileModal = ref(false)
const selectedUserId = ref(null)

const loadNearUsersData = async () => {
  try {
    const res = await getUserNearUser()
    const users = res.data.data || []

    // 解析标签
    users.forEach((user) => {
      try {
        user.tags = JSON.parse(user.tags)
      } catch (e) {
        user.tags = []
      }
    })

    if (res.data.code === 0) {
      userList.value = users
      flag.value = users.length > 0
      if (users.length > 0) {
        showSuccessToast(`找到 ${users.length} 位附近用户`)
      } else {
        showFailToast('附近没有用户')
      }
    } else {
      showFailToast('获取失败')
    }
  } catch (error) {
    console.error('获取附近用户失败:', error)
    showFailToast('网络错误，请重试')
  }
}

onMounted(async () => {
  await loadNearUsersData()
})

// 当页面从缓存中激活时重新获取数据
onActivated(async () => {
  await loadNearUsersData()
})

// 格式化距离显示
const formatDistance = (distance: number) => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`
  }
  return `${distance.toFixed(1)}km`
}

// 图片加载失败处理
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/ava.jpg'
}

// 刷新数据
const refreshData = async () => {
  await loadNearUsersData()
}


// 查看资料
const viewProfile = (user: any) => {
  selectedUserId.value = user.id
  showProfileModal.value = true
}

// 获取要显示的标签
const getDisplayTags = (user: any) => {
  if (!user.tags || !user.tags.length) return []

  // 如果已展开或标签数量少于等于5个，显示全部标签
  if (user.tagsExpanded || user.tags.length <= 5) {
    return user.tags
  }

  // 否则只显示前5个标签
  return user.tags.slice(0, 5)
}

// 切换标签展开状态
const toggleTagsExpand = (user: any) => {
  // 使用 Vue 的响应式系统
  if (user.tagsExpanded === undefined) {
    user.tagsExpanded = false
  }
  user.tagsExpanded = !user.tagsExpanded
}

</script>

<style scoped>
#blank {
  /* 底部间距已在全局设置，无需重复设置 */
}

/* 附近用户卡片容器 */
.nearby-cards-container {
  padding: 0 16px;
  margin-bottom: 20px;
}

/* 附近用户卡片样式 */
.nearby-card {
  background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
  animation: slideInUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.3s ease;
}

.nearby-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%);
}

.nearby-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.nearby-card-bg {
  position: absolute;
  top: -40%;
  right: -15%;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%);
  border-radius: 50%;
  z-index: 0;
}

/* 附近用户头部 */
.nearby-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
  position: relative;
  z-index: 1;
}

.nearby-avatar {
  position: relative;
  flex-shrink: 0;
}

.nearby-avatar img {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  object-fit: cover;
  border: 3px solid #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.distance-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
  color: white;
  border-radius: 12px;
  padding: 4px 8px;
  font-size: 11px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
  display: flex;
  align-items: center;
  gap: 2px;
}

.distance-badge .van-icon {
  font-size: 10px;
}

.nearby-info {
  flex: 1;
}

.nearby-name {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 4px 0;
  line-height: 1.3;
}

.nearby-id {
  font-size: 12px;
  color: #95a5a6;
  margin-bottom: 6px;
}

.nearby-distance {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #3b82f6;
  font-weight: 500;
}

.nearby-distance .van-icon {
  font-size: 14px;
}

/* 附近用户内容 */
.nearby-content {
  margin-bottom: 16px;
  position: relative;
  z-index: 1;
}

.nearby-profile {
  font-size: 14px;
  color: #7f8c8d;
  line-height: 1.5;
  margin: 0 0 12px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.nearby-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.nearby-tag {
  font-size: 12px;
  border-radius: 12px;
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.3);
  color: #3b82f6;
}

.expand-tags-btn {
  font-size: 11px;
  padding: 2px 6px;
  height: 20px;
  line-height: 16px;
  border-radius: 10px;
  border-color: rgba(59, 130, 246, 0.3);
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.05);
  transition: all 0.2s ease;
  align-self: center;
  min-width: 32px;
}

.expand-tags-btn:hover {
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.5);
}

.expand-tags-btn:active {
  transform: scale(0.95);
}

/* 附近用户操作 */
.nearby-actions {
  display: flex;
  gap: 8px;
  position: relative;
  z-index: 1;
  padding-top: 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.nearby-actions .van-button {
  flex: 1;
  padding: 6px 12px;
  font-size: 12px;
  border-radius: 18px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.nearby-actions .van-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 空状态容器 */
.empty-container {
  padding: 60px 20px;
  text-align: center;
}

.refresh-button {
  width: 140px;
  height: 40px;
  margin-top: 20px;
  background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
  border: none;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
}

/* 动画效果 */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .nearby-cards-container {
    padding: 0 12px;
  }

  .nearby-card {
    padding: 16px;
  }

  .nearby-avatar img {
    width: 56px;
    height: 56px;
  }

  .nearby-name {
    font-size: 16px;
  }

  .nearby-profile {
    font-size: 13px;
  }

  .nearby-actions {
    flex-direction: column;
    gap: 8px;
  }
}

@media (max-width: 480px) {
  .nearby-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 12px;
  }

  .nearby-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .nearby-tags {
    justify-content: center;
  }

  .nearby-actions {
    align-items: stretch;
  }
}
</style>
