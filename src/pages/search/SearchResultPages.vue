<template>
  <div v-if="flag" class="search-results-container">
    <div class="search-results-header">
      <van-icon name="search" />
      <span>找到 {{ total }} 位匹配用户</span>
    </div>

    <div class="search-cards-container">
      <div
        class="search-card"
        v-for="(user, index) in userList"
        :key="user.id"
        :style="{ animationDelay: `${index * 0.1}s` }"
      >
        <div class="search-user-header">
          <div class="search-avatar">
            <img
              :src="user.avatarUrl || '/ava.jpg'"
              :alt="user.userName"
              @error="handleImageError"
            />
            <div class="match-badge">
              <van-icon name="like-o" />
              匹配用户
            </div>
          </div>
          <div class="search-info">
            <h3 class="search-name">{{ user.userName }}</h3>
            <div class="search-id">用户ID: #{{ user.id }}</div>
            <div class="search-match">
              <van-icon name="fire-o" color="#ff6b6b" />
              标签匹配
            </div>
          </div>
        </div>

        <div class="search-content">
          <p class="search-profile" v-if="user.profile">
            {{ user.profile }}
          </p>

          <div class="search-tags" v-if="user.tags && user.tags.length">
            <van-tag
              class="search-tag"
              plain
              type="warning"
              size="small"
              v-for="tag in getDisplayTags(user)"
              :key="tag"
            >
              {{ tag }}
            </van-tag>
            <van-button
              v-if="user.tags.length > 6"
              class="expand-tags-btn"
              size="mini"
              plain
              @click="toggleTagsExpand(user)"
            >
              {{ user.tagsExpanded ? '收起' : `+${user.tags.length - 6}` }}
            </van-button>
          </div>
        </div>

        <div class="search-actions">
          <van-button type="success" size="small" round icon="guide-o" @click="viewProfile(user)">
            查看资料
          </van-button>
        </div>

        <div class="search-card-bg"></div>
      </div>
    </div>

    <div id="blank">
      <div class="pagination-container" v-if="total > pageSize">
        <van-pagination
          v-model="currentPage"
          :total-items="total"
          :items-per-page="pageSize"
          :page-count="totalPages"
          mode="simple"
          @change="onPageChange"
        />
      </div>
      <van-divider />
    </div>
  </div>

  <div v-else class="empty-container">
    <van-empty
      image="https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png"
      description="未找到匹配用户"
    >
      <van-button round type="primary" class="search-button" @click="goSearch">
        重新搜索
      </van-button>
    </van-empty>
  </div>

  <!-- Loading状态 -->
  <van-loading v-if="isLoading" type="spinner" color="#1989fa" size="24px" class="loading-state">
    搜索中...
  </van-loading>

  <!-- 用户资料模态框 -->
  <UserProfileModal v-model="showProfileModal" :userId="selectedUserId" />
</template>

<script setup>
import { useRoute } from 'vue-router'
import { onMounted, ref, onActivated, watch, nextTick } from 'vue'
import myAxios from '@/plugins/myAxios.js'
import { showFailToast, showSuccessToast } from 'vant'
import { useRouter } from 'vue-router'
import UserProfileModal from '@/components/UserProfileModal.vue'

// 为组件设置名称，确保 keep-alive 能正确缓存
defineOptions({
  name: 'SearchResultPages',
})

const route = useRoute()

const router = useRouter()

const flag = ref(true)

const userList = ref([])

const isLoading = ref(false)

const showProfileModal = ref(false)

const selectedUserId = ref(null)

// 分页相关状态
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const totalPages = ref(0)
const allUsers = ref([])
const isServerPaged = ref(false)

const loadSearchData = async () => {
  if (isLoading.value) return // 防止重复请求

  try {
    isLoading.value = true

    const currentTags = route.query

    // 确保有查询参数

    if (!currentTags.tag || (Array.isArray(currentTags.tag) && currentTags.tag.length === 0)) {
      userList.value = []

      allUsers.value = []
      total.value = 0
      totalPages.value = 0
      flag.value = false

      return
    }

    console.log(
      'Loading search data with tags:',
      currentTags.tag,
      'page:',
      currentPage.value,
      'size:',
      pageSize.value,
    )

    const response = await myAxios.get('user/search/tags', {
      params: {
        tagsList: currentTags.tag, // 假设 currentTags.tag 是数组 ['女', '大二']

        current: currentPage.value,
        pageSize: pageSize.value,
      },
      paramsSerializer: (params) => {
        const parts = []
        const tagValues = params.tagsList

        if (Array.isArray(tagValues)) {
          parts.push(...tagValues.map((value) => `tagsList=${encodeURIComponent(value)}`))
        } else if (tagValues !== undefined) {
          parts.push(`tagsList=${encodeURIComponent(tagValues)}`)
        }
        if (params.current != null) {
          parts.push(`current=${encodeURIComponent(params.current)}`)
        }
        if (params.pageSize != null) {
          parts.push(`pageSize=${encodeURIComponent(params.pageSize)}`)
        }
        return parts.join('&')
      },
    })

    if (response.data && response.data.data != null) {
      const data = response.data.data
      // 判断是否为分页结构
      const pageItems = Array.isArray(data) ? data : data.records || data.items || data.list || []
      isServerPaged.value = !Array.isArray(data)

      // 解析 tags
      pageItems.forEach((user) => {
        try {
          user.tags = JSON.parse(user.tags)
        } catch (e) {
          user.tags = Array.isArray(user.tags) ? user.tags : []
        }
      })

      if (isServerPaged.value) {
        userList.value = pageItems

        const totalFromData = data.total ?? pageItems.length
        total.value = Number(totalFromData) || 0

        const sizeFromData = data.size ?? pageSize.value
        const numericSize = Number(sizeFromData) || pageSize.value
        pageSize.value = numericSize

        const currentFromData = data.current ?? currentPage.value
        currentPage.value = Number(currentFromData) || currentPage.value

        const pagesFromData = data.pages
        const calcPages = Math.ceil(total.value / pageSize.value)
        const pagesValue = pagesFromData ?? calcPages
        totalPages.value = Number(pagesValue) || 0
      } else {
        // 后端未分页，前端分页
        allUsers.value = pageItems
        total.value = allUsers.value.length
        totalPages.value = Math.ceil(total.value / pageSize.value)
        const start = (currentPage.value - 1) * pageSize.value
        const end = start + pageSize.value
        userList.value = allUsers.value.slice(start, end)
      }

      flag.value = total.value > 0
    } else {
      userList.value = []

      allUsers.value = []
      total.value = 0
      totalPages.value = 0
      flag.value = false
    }
  } catch (error) {
    flag.value = false

    userList.value = []

    allUsers.value = []
    total.value = 0
    totalPages.value = 0
    console.error('Failed to fetch data:', error)

    showFailToast('搜索失败，请重试')
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await loadSearchData()
})

// 当页面从缓存中激活时重新获取数据
onActivated(async () => {
  // 使用 nextTick 确保路由参数已经更新
  await nextTick()
  await loadSearchData()
})

// 监听路由查询参数变化，当查询参数改变时重新获取数据
watch(
  () => route.query,
  async (newQuery, oldQuery) => {
    console.log('Route query changed:', { newQuery, oldQuery })
    // 更严格的比较，确保真的发生了变化
    const newQueryStr = JSON.stringify(newQuery)
    const oldQueryStr = JSON.stringify(oldQuery)

    if (newQueryStr !== oldQueryStr) {
      console.log('Query parameters changed, reloading data...')

      // 清空当前数据，显示加载状态

      userList.value = []

      currentPage.value = 1
      await loadSearchData()
    }
  },
  { deep: true, immediate: false },
)

// 监听路由路径变化，确保在路由切换时也能正确刷新
watch(
  () => route.fullPath,
  async (newPath, oldPath) => {
    console.log('Route path changed:', { newPath, oldPath })
    if (newPath.includes('/user/list') && newPath !== oldPath) {
      await nextTick()
      await loadSearchData()
    }
  },
)

// 图片加载失败处理
const handleImageError = (event) => {
  const img = event.target
  img.src = '/ava.jpg'
}

// 查看资料
const viewProfile = (user) => {
  selectedUserId.value = user.id
  showProfileModal.value = true
}

// 重新搜索
const goSearch = () => {
  router.push('/user/tags')
}

// 获取要显示的标签
const getDisplayTags = (user) => {
  if (!user.tags || !user.tags.length) return []

  // 如果已展开或标签数量少于等于6个，显示全部标签
  if (user.tagsExpanded || user.tags.length <= 6) {
    return user.tags
  }

  // 否则只显示前6个标签
  return user.tags.slice(0, 6)
}

const toggleTagsExpand = (user) => {
  // 使用 Vue 的响应式系统

  if (user.tagsExpanded === undefined) {
    user.tagsExpanded = false
  }

  user.tagsExpanded = !user.tagsExpanded
}

// 分页变更
const onPageChange = async (page) => {
  currentPage.value = Number(page) || 1
  if (isServerPaged.value) {
    await loadSearchData()
  } else {
    // 前端分页
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    userList.value = allUsers.value.slice(start, end)
    flag.value = total.value > 0
  }
}
</script>

<style scoped>
.pagination-container {
  display: flex;
  justify-content: center;
  padding: 8px 16px;
}

/* 搜索结果容器 */

.search-results-container {
  padding-bottom: 20px;
}

/* 搜索结果头部 */
.search-results-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  color: #ff6b6b;
  background: linear-gradient(135deg, #fff5f5 0%, #ffffff 100%);
  border-radius: 12px;
  margin: 16px;
  box-shadow: 0 2px 12px rgba(255, 107, 107, 0.1);
}

/* 搜索卡片容器 */
.search-cards-container {
  padding: 0 16px;
}

/* 搜索卡片样式 */
.search-card {
  background: linear-gradient(135deg, #ffffff 0%, #fff5f5 100%);
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

.search-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #ff6b6b 0%, #ffa502 100%);
}

.search-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.search-card-bg {
  position: absolute;
  top: -40%;
  right: -15%;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(255, 107, 107, 0.05) 0%, transparent 70%);
  border-radius: 50%;
  z-index: 0;
}

/* 搜索用户头部 */
.search-user-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
  position: relative;
  z-index: 1;
}

.search-avatar {
  position: relative;
  flex-shrink: 0;
}

.search-avatar img {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  object-fit: cover;
  border: 3px solid #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.match-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ffa502 100%);
  color: white;
  border-radius: 12px;
  padding: 4px 8px;
  font-size: 11px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
  display: flex;
  align-items: center;
  gap: 2px;
}

.match-badge .van-icon {
  font-size: 10px;
}

.search-info {
  flex: 1;
}

.search-name {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 4px 0;
  line-height: 1.3;
}

.search-id {
  font-size: 12px;
  color: #95a5a6;
  margin-bottom: 6px;
}

.search-match {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #ff6b6b;
  font-weight: 500;
}

.search-match .van-icon {
  font-size: 14px;
}

/* 搜索内容 */
.search-content {
  margin-bottom: 16px;
  position: relative;
  z-index: 1;
}

.search-profile {
  font-size: 14px;

  color: #7f8c8d;

  line-height: 1.5;

  margin: 0 0 12px 0;

  display: -webkit-box;

  -webkit-line-clamp: 2;

  line-clamp: 2;
  -webkit-box-orient: vertical;

  overflow: hidden;
}

.search-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.search-tag {
  font-size: 12px;
  border-radius: 12px;
  background: rgba(255, 107, 107, 0.1);
  border-color: rgba(255, 107, 107, 0.3);
  color: #ff6b6b;
}

.expand-tags-btn {
  font-size: 11px;
  padding: 2px 6px;
  height: 20px;
  line-height: 16px;
  border-radius: 10px;
  border-color: rgba(255, 107, 107, 0.3);
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.05);
  transition: all 0.2s ease;
  align-self: center;
  min-width: 32px;
}

.expand-tags-btn:hover {
  background: rgba(255, 107, 107, 0.1);
  border-color: rgba(255, 107, 107, 0.5);
}

.expand-tags-btn:active {
  transform: scale(0.95);
}

/* 搜索操作 */
.search-actions {
  display: flex;
  gap: 8px;
  position: relative;
  z-index: 1;
  padding-top: 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.search-actions .van-button {
  flex: 1;
  padding: 6px 12px;
  font-size: 12px;
  border-radius: 18px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.search-actions .van-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 空状态容器 */
.empty-container {
  padding: 60px 20px;
  text-align: center;
}

.search-button {
  width: 140px;
  height: 40px;
  margin-top: 20px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ffa502 100%);
  border: none;
  box-shadow: 0 4px 16px rgba(255, 107, 107, 0.3);
}

/* 加载状态 */
.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  z-index: 1000;
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
  .search-cards-container {
    padding: 0 12px;
  }

  .search-card {
    padding: 16px;
  }

  .search-avatar img {
    width: 56px;
    height: 56px;
  }

  .search-name {
    font-size: 16px;
  }

  .search-profile {
    font-size: 13px;
  }

  .search-actions {
    flex-direction: column;
    gap: 8px;
  }
}

@media (max-width: 480px) {
  .search-results-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 12px;
  }

  .search-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .search-tags {
    justify-content: center;
  }

  .search-actions {
    align-items: stretch;
  }
}
</style>
