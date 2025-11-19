<template>
  <van-row justify="space-between" align="center" style="padding: 10px;">
    <van-col span="12">
      <van-cell title="猜你喜欢" icon="like-o" />
    </van-col>
    <van-col span="12" style="text-align: right;">
      <van-button type="primary" round @click="goToFriends">
        <van-icon name="friends-o" />
        我的好友
      </van-button>
      <van-button type="success" round @click="findMore" style="margin-left: 10px;">
        <van-icon name="map-marked" />
        附近用户
      </van-button>
    </van-col>
  </van-row>


  <div class="user-cards-container">
    <div
      class="user-card"
      v-for="(user, index) in userList"
      :key="user.id"
      :style="{ animationDelay: `${index * 0.1}s` }"
    >
      <div class="user-avatar">
        <img
          :src="user.avatarUrl || '/ava.jpg'"
          :alt="user.userName"
          @error="handleImageError"
        />
        <div class="avatar-status-dot"></div>
      </div>

      <div class="user-info">
        <div class="user-header">
          <h3 class="user-name">{{ user.userName }}</h3>
          <span class="user-id">#{{ user.id }}</span>
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
      </div>
    </div>
  </div>

  <p class="pages">{{ cont }}</p>
  <div id="index-button-css" style="display: flex; justify-content: center; gap: 20px; margin-top: 16px">
    <van-button v-if="flagPre" type="primary" @click="GoPre">上一页</van-button>
    <van-button v-if="flag" type="primary" @click="loadMore">下一页</van-button>
  </div>

  <!-- 用户资料模态框 -->
  <UserProfileModal
    v-model="showProfileModal"
    :userId="selectedUserId"
  />
</template>

<script setup lang="ts">
import { onMounted, ref, onActivated } from 'vue'
import { getUserListLike } from '@/api/controller'
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

const loadUserData = async () => {
  const res = await getUserListLike({
    count: cont.value,
  })
  res.data.data.forEach((user) => {
    user.tags = JSON.parse(user.tags)
  })
  userList.value = res.data.data || []
  if (res.data.code < 8) {
    flag.value = false
  } else {
    flag.value = true
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
  const res = await getUserListLike({
    count: cont.value,
  })
  res.data.data.forEach((user) => {
    user.tags = JSON.parse(user.tags)
  })
  userList.value = res.data.data || []
  if (res.data.code < 8) {
    flag.value = false
  }
  flagPre.value = true
}

const GoPre = async () => {
  cont.value--
  const res = await getUserListLike({
    count: cont.value,
  })
  res.data.data.forEach((user) => {
    user.tags = JSON.parse(user.tags)
  })
  userList.value = res.data.data || []
  flag.value = true
  if (cont.value == 1) {
    flagPre.value = false
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

</script>

<style scoped>
/* 页面头部样式 */
.van-cell {
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.van-button {
  padding: 8px 16px;
}

.van-button:active {
  transform: scale(0.98);
}

/* 用户卡片容器 */
.user-cards-container {
  padding: 0 16px;
  margin-bottom: 20px;
}

/* 用户卡片样式 */
.user-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  gap: 16px;
  position: relative;
  overflow: hidden;
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease;
}

.user-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
}

.user-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

/* 用户头像区域 */
.user-avatar {
  position: relative;
  flex-shrink: 0;
}

.user-avatar img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.user-avatar img:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.avatar-status-dot {
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 16px;
  height: 16px;
  background-color: #4caf50;
  border: 2px solid #fff;
  border-radius: 50%;
  animation: pulse 2s infinite;
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
  color: #2c3e50;
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
  background: rgba(102, 126, 234, 0.1);
  border-color: rgba(102, 126, 234, 0.3);
  color: #667eea;
}

.expand-tags-btn {
  font-size: 11px;
  padding: 2px 6px;
  height: 20px;
  line-height: 16px;
  border-radius: 10px;
  border-color: rgba(102, 126, 234, 0.3);
  color: #667eea;
  background: rgba(102, 126, 234, 0.05);
  transition: all 0.2s ease;
  align-self: center;
  min-width: 32px;
}

.expand-tags-btn:hover {
  background: rgba(102, 126, 234, 0.1);
  border-color: rgba(102, 126, 234, 0.5);
}

.expand-tags-btn:active {
  transform: scale(0.95);
}

/* 用户简介 */
.user-profile {
  font-size: 14px;
  color: #7f8c8d;
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.user-actions .van-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 分页样式 */
.pages {
  text-align: center;
  margin: 20px 0;
  font-size: 14px;
  color: #7f8c8d;
}

#index-button-css {
  margin-bottom: 30px;
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

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(76, 175, 80, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
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

  .user-actions {
    justify-content: center;
  }
}
</style>
