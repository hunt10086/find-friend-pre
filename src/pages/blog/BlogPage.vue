<template>
  <div class="blog-cards-container">
    <div
      class="blog-card"
      v-for="(blog, index) in blogList"
      :key="blog.id"
      :style="{ animationDelay: `${index * 0.1}s` }"
      @click="goToBlog(blog.id)"
    >
      <div class="blog-header">
        <div class="blog-author">
          <img
            :src="(blog as any).avatarUrl || '/ava.jpg'"
            :alt="(blog as any).author || '作者'"
            class="author-avatar"
          />
          <div class="author-info">
            <span class="author-name">{{ (blog as any).author || '匿名用户' }}</span>
            <span class="post-time">{{
              blog.createTime ? formatTime(blog.createTime) : '刚刚'
            }}</span>
          </div>
        </div>
        <div class="blog-category">
          <van-tag type="primary">{{ blog.kind || '未分类' }}</van-tag>
        </div>
      </div>

      <div class="blog-content">
        <h3 class="blog-title">{{ blog.title }}</h3>
        <p class="blog-excerpt" v-if="blog.content">
          {{ getExcerpt(blog.content) }}
        </p>
      </div>

      <div class="blog-footer">
        <div class="blog-stats">
          <div class="stat-item">
            <van-icon name="like-o" />
            <span>{{ blog.praise || 0 }}</span>
          </div>
          <div class="stat-item">
            <van-icon name="comment-o" />
            <span>{{ blog.commentCount || 0 }}</span>
          </div>
          <div class="stat-item">
            <van-icon name="eye-o" />
            <span>{{ blog.viewCount || 0 }}</span>
          </div>
        </div>
        <div class="blog-actions">
          <van-button
            size="mini"
            plain
            :icon="(blog as any)._liked ? 'good-job' : 'like-o'"
            :type="(blog as any)._liked ? 'primary' : 'default'"
            @click.stop="likeBlog(blog)"
          >
            {{ (blog as any)._liked ? '已点赞' : '点赞' }}
          </van-button>
          <van-button size="mini" plain icon="star-o" @click.stop="collectBlog(blog)">
            收藏
          </van-button>
        </div>
      </div>

      <div class="blog-card-bg"></div>
    </div>
  </div>

  <!-- 分页导航 -->
  <div v-if="totalPages > 1" class="pagination-container">
    <div class="pagination-wrapper">
      <van-pagination
        v-model="currentPage"
        :total-items="total"
        :items-per-page="pageSize"
        :show-page-size="5"
        force-ellipses
        @change="onPageChange"
      />
      <div class="page-jump-controls">
        <span class="jump-label">跳转到</span>
        <van-field v-model="jumpPageInput" type="number" class="page-input" placeholder="页码" />
        <van-button type="primary" size="small" @click="goToPage">跳转</van-button>
        <span class="total-pages">共 {{ totalPages }} 页</span>
      </div>
    </div>
    <van-divider />
  </div>

  <div id="blank">
    <van-divider />
  </div>
  <!-- 固定在右下角的按钮 -->
  <van-sticky :offset-bottom="20" position="bottom">
    <van-button
      icon="plus"
      type="primary"
      class="round-button"
      round
      style="position: fixed; right: 20px; bottom: 120px; z-index: 999"
      @click="handleAddBlog"
    >
    </van-button>
  </van-sticky>
</template>

<script setup lang="ts">
import { onMounted, ref, onActivated } from 'vue'
import { api } from '@/api/apiClient'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { showSuccessToast, showFailToast } from 'vant'

// 为组件设置名称，确保 keep-alive 能正确缓存
defineOptions({
  name: 'BlogPage',
})

// 使用 any 以兼容后端动态字段（author、avatarUrl、_liked 等），避免 TS 严格校验报错
const blogList = ref<{ [key: string]: any }[]>([])
const user = ref<{ [key: string]: any }>()
const router = useRouter()

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const totalPages = ref(0)
const jumpPageInput = ref('')

const loadBlogData = async (page: number = 1) => {
  try {
    const response = await api.blog.getBlogList({ currentPage: page })
    const blogs: any[] = response.data.data?.records || []

    // 更新分页信息
    total.value = response.data.data?.total || 0
    pageSize.value = response.data.data?.size || 10
    totalPages.value = response.data.data?.pages || Math.ceil(total.value / pageSize.value)

    // 为每个博客添加作者信息和点赞状态
    const blogsWithInfo = await Promise.all(
      blogs.map(async (blog) => {
        try {
          // 获取用户信息
          if (blog.userId) {
            const userRes = await api.user.searchUserById({ id: blog.userId })
            if (userRes.data.code === 0 && userRes.data.data) {
              const userData = userRes.data.data
              blog.author = userData.userName || `用户${blog.userId}`
              blog.avatarUrl = userData.avatarUrl || blog.avatarUrl || '/ava.jpg'
            } else {
              blog.author = `用户${blog.userId}`
            }
          } else {
            blog.author = '匿名用户'
          }

          // 检查当前用户是否已点赞此博客
          if (blog.id) {
            const likeStatusRes = await api.blog.getBlogIsLike({ blogId: blog.id })
            if (likeStatusRes.data.code === 0) {
              blog._liked = likeStatusRes.data.data // Boolean值，表示是否已点赞
            } else {
              blog._liked = false // 默认为未点赞
            }
          } else {
            blog._liked = false
          }

          return blog
        } catch (error) {
          blog.author = '匿名用户'
          blog._liked = false
          return blog
        }
      }),
    )

    blogList.value = blogsWithInfo
  } catch (error) {
    showFailToast('加载失败')
  }
}

// 页码改变时
const onPageChange = (page: number) => {
  currentPage.value = page
  loadBlogData(page)
  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 跳转到指定页
const goToPage = () => {
  let targetPage = parseInt(jumpPageInput.value)
  if (isNaN(targetPage) || targetPage < 1 || targetPage > totalPages.value) {
    showFailToast('请输入有效的页码')
    return
  }
  currentPage.value = targetPage
  loadBlogData(targetPage)
  jumpPageInput.value = ''
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(async () => {
  await loadBlogData(1)
})

// 当页面从缓存中激活时重新获取数据
onActivated(async () => {
  await loadBlogData(currentPage.value)
})

const goToBlog = (id?: number) => {
  if (!id) return
  router.push(`/user/blog/${id}`)
}

const handleAddBlog = () => {
  router.push('/blog/create')
}

// 格式化时间
const formatTime = (time: any) => {
  return dayjs(time).format('MM-DD HH:mm')
}

// 获取内容摘要
const getExcerpt = (content: string, maxLength: number = 100) => {
  if (!content) return ''
  return content.length > maxLength ? content.substring(0, maxLength) + '...' : content
}

// 点赞 / 取消点赞（防抖 + 防止重复点击 + 点击频率限制 + 准确的状态更新）
const likeBlog = async (blog: any) => {
  if (!blog || !blog.id) return

  // 防止重复点击
  if (blog.isLiking) {
    showFailToast('正在处理中，请稍候...')
    return
  }

  // 记录点击时间用于频率检测
  const now = Date.now()
  if (!blog.clickTimes) {
    blog.clickTimes = []
  }

  // 添加当前点击时间
  blog.clickTimes.push(now)

  // 只保留最近5秒内的点击记录
  blog.clickTimes = blog.clickTimes.filter((time: any) => now - time < 5000)

  // 检查是否频繁重复点击（5秒内超过3次）
  if (blog.clickTimes.length > 3) {
    showFailToast('您点击得太快啦，请稍后再试~')
    return
  }

  blog.isLiking = true
  const originalPraise = blog.praise || 0
  const originalLiked = blog._liked

  try {
    // 执行点赞/取消点赞操作
    const res = await api.blog.getBlogLike({ blogId: blog.id })

    if (res.data.code === 0) {
      // 成功后，根据操作结果更新状态
      // 如果API返回的是新点赞数，直接使用
      if (typeof res.data.data === 'number') {
        blog.praise = Math.max(0, res.data.data)
      } else {
        // 如果API返回的是其他格式或无数据，使用状态翻转逻辑更新点赞数
        // 如果原来是已点赞，现在变成未点赞，则减1；反之则加1
        blog.praise = originalLiked ? Math.max(0, originalPraise - 1) : originalPraise + 1
      }

      // 重新获取当前博客的点赞状态来确保准确性
      const likeStatusRes = await api.blog.getBlogIsLike({ blogId: blog.id })
      if (likeStatusRes.data.code === 0) {
        blog._liked = likeStatusRes.data.data
      } else {
        // 如果获取状态失败，根据原始状态进行翻转（这是备选方案）
        blog._liked = !originalLiked
      }

      showSuccessToast(blog._liked ? '点赞成功' : '取消点赞')
    } else {
      // 操作失败，恢复原始状态
      blog.praise = originalPraise
      blog._liked = originalLiked
      showFailToast(res.data.message || '操作失败')
    }
  } catch (e) {
    // 请求失败，恢复原始状态
    blog.praise = originalPraise
    blog._liked = originalLiked
    showFailToast('网络错误，稍后再试')
  } finally {
    // 重置状态
    blog.isLiking = false
  }
}

// 收藏博客
const collectBlog = (blog: any) => {
  showSuccessToast('收藏成功')
}
</script>
<style scoped>
#blank {
  /* 底部间距已在全局设置，无需重复设置 */
}

/* 分页容器 */
.pagination-container {
  padding: 20px 16px;
  background: #fff;
}

.pagination-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
}

.page-jump-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.jump-label {
  font-size: 14px;
  color: #666;
}

.page-input {
  width: 80px;
  padding: 4px 8px;
}

.page-input :deep(.van-field__control) {
  text-align: center;
}

.total-pages {
  font-size: 14px;
  color: #999;
  margin-left: 8px;
}

/* 博客卡片容器 */
.blog-cards-container {
  padding: 0 16px;
  margin-bottom: 20px;
}

/* 博客卡片样式 */
.blog-card {
  background: linear-gradient(135deg, #ffffff 0%, #f0f4ff 100%);
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
  cursor: pointer;
}

.blog-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #ff6b6b 0%, #ffa502 100%);
}

.blog-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.blog-card-bg {
  position: absolute;
  top: -50%;
  right: -10%;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(255, 107, 107, 0.05) 0%, transparent 70%);
  border-radius: 50%;
  z-index: 0;
}

/* 博客头部 */
.blog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  position: relative;
  z-index: 1;
}

.blog-author {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.author-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.author-name {
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
}

.post-time {
  font-size: 12px;
  color: #95a5a6;
}

/* 博客内容 */
.blog-content {
  margin-bottom: 16px;
  position: relative;
  z-index: 1;
}

.blog-title {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.blog-excerpt {
  font-size: 14px;
  color: #7f8c8d;
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 博客底部 */
.blog-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
  padding-top: 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.blog-stats {
  display: flex;
  gap: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #95a5a6;
}

.stat-item .van-icon {
  font-size: 14px;
}

.blog-actions {
  display: flex;
  gap: 8px;
}

.blog-actions .van-button {
  padding: 4px 12px;
  font-size: 12px;
  border-radius: 16px;
  border-color: rgba(255, 107, 107, 0.3);
  color: #ff6b6b;
  transition: all 0.2s ease;
}

.blog-actions .van-button:hover {
  background-color: rgba(255, 107, 107, 0.1);
  transform: translateY(-1px);
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
  .blog-cards-container {
    padding: 0 12px;
  }

  .blog-card {
    padding: 16px;
  }

  .blog-title {
    font-size: 16px;
  }

  .blog-excerpt {
    font-size: 13px;
  }

  .blog-footer {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .blog-actions {
    align-self: stretch;
    justify-content: space-around;
  }

  .pagination-wrapper {
    gap: 12px;
  }

  .page-jump-controls {
    flex-wrap: wrap;
    justify-content: center;
  }

  .page-input {
    width: 60px;
  }
}

@media (max-width: 480px) {
  .blog-header {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }

  .blog-stats {
    gap: 12px;
  }

  .stat-item {
    font-size: 12px;
  }

  .pagination-wrapper {
    gap: 8px;
  }

  .page-jump-controls {
    gap: 4px;
  }

  .page-input {
    width: 50px;
  }

  .total-pages {
    width: 100%;
    text-align: center;
  }
}
</style>
