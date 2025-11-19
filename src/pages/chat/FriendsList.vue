<template>
  <div class="friends-list-container">
    <div class="page-header">
      <van-icon name="arrow-left" class="back-icon" @click="goBack" />
      <h2 class="page-title">我的好友</h2>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <van-loading type="spinner" color="#1989fa" size="24px"> 加载中... </van-loading>
    </div>

    <!-- 好友列表 -->
    <div v-else-if="friendsList.length > 0" class="friends-list">
      <div
        class="friend-card"
        v-for="(friend, index) in friendsList"
        :key="friend.id"
        :style="{ animationDelay: `${index * 0.05}s` }"
        @click="goChat(friend)"
      >
        <div class="friend-avatar">
          <img
            :src="friend.avatarUrl || '/ava.jpg'"
            :alt="friend.userName"
            @error="handleImageError"
          />
        </div>
        <div class="friend-info">
          <h3 class="friend-name">{{ friend.userName }}</h3>
          <div class="friend-profile" v-if="friend.profile">
            {{
              friend.profile.length > 20 ? friend.profile.substring(0, 20) + '...' : friend.profile
            }}
          </div>
        </div>
        <div class="friend-actions">
          <van-button type="primary" size="small" round @click.stop="viewProfile(friend)">
            查看资料
          </van-button>
          <van-button
            type="success"
            size="small"
            round
            class="chat-btn"
            @click.stop="goChat(friend)"
          >
            聊天
          </van-button>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <van-empty description="暂无好友">
        <van-button round type="primary" @click="goToSearch"> 去寻找好友 </van-button>
      </van-empty>
    </div>
  </div>

  <!-- 用户资料模态框 -->
  <UserProfileModal v-model="showProfileModal" :userId="selectedUserId" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getFriendsList } from '@/api/controller/HaoYouGuanXiJieKou/getFriendsList.js'
import { useRouter } from 'vue-router'
import { showFailToast } from 'vant'
import UserProfileModal from '@/components/UserProfileModal.vue'
import { useFriendStore } from '@/stores/friendStore'

const friendStore = useFriendStore()

const router = useRouter()
const loading = ref(true)
const friendsList = ref([])
const showProfileModal = ref(false)
const selectedUserId = ref(null)

// 返回上一页
const goBack = () => {
  router.go(-1)
}

// 去搜索页面
const goToSearch = () => {
  router.push('/search')
}

// 加载好友列表
const loadFriendsList = async () => {
  try {
    loading.value = true
    const response = await getFriendsList()

    /* 移除冗余日志: 好友列表API响应 */

    if (response.data.code === 0 && response.data.data) {
      friendsList.value = response.data.data
      /* 移除冗余日志: 好友列表数据 */
    } else {
      showFailToast('获取好友列表失败: ' + (response.data.message || '未知错误'))
      friendsList.value = []
    }
  } catch (error) {
    console.error('获取好友列表失败:', error)
    showFailToast('网络错误，请重试')
    friendsList.value = []
  } finally {
    loading.value = false
  }
}

// 查看资料
const viewProfile = (friend: any) => {
  selectedUserId.value = friend.id
  showProfileModal.value = true
}

// 进入聊天
const goChat = (friend: any) => {
  router.push(`/friendChat/${friend.id}`)
}

// 图片加载失败处理
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/ava.jpg'
}

onMounted(async () => {
  // 预加载好友缓存，避免后续资料弹窗重复判定
  await friendStore.ensureLoaded()
  await loadFriendsList()
})
</script>

<style scoped>
.friends-list-container {
  padding: 16px;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.page-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #ebedf0;
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.back-icon {
  font-size: 24px;
  color: #666;
  margin-right: 12px;
  cursor: pointer;
}

.page-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #323233;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
}

.friends-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.friend-card {
  display: flex;
  align-items: center;
  padding: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  animation: fadeInUp 0.3s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease;
}

.friend-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.friend-avatar {
  flex-shrink: 0;
  margin-right: 16px;
}

.friend-avatar img {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #f0f0f0;
}

.friend-info {
  flex: 1;
  min-width: 0;
}

.friend-name {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #323233;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.friend-profile {
  font-size: 13px;
  color: #969799;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.friend-actions {
  flex-shrink: 0;
  margin-left: 16px;
}

.empty-state {
  padding: 60px 20px;
  text-align: center;
}

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
@media (max-width: 480px) {
  .friends-list-container {
    padding: 12px;
  }

  .friend-card {
    padding: 12px;
  }

  .friend-avatar img {
    width: 48px;
    height: 48px;
  }

  .friend-name {
    font-size: 15px;
  }

  .friend-profile {
    font-size: 12px;
  }
}
</style>
