<template>
  <div>
    <div v-if="flag" class="my-blogs-container">
      <div
        class="blog-card"
        v-for="(blog, index) in blogList"
        :key="blog.id"
        :style="{ animationDelay: `${index * 0.1}s` }"
        @click="goToBlog(blog.id)"
      >
        <div class="blog-header">
          <div class="blog-category">
            <van-tag type="primary">{{ blog.kind || '未分类' }}</van-tag>
          </div>
          <div class="blog-status">
            <van-icon name="edit" color="#1890ff" />
            我的博客
          </div>
        </div>

        <div class="blog-content">
          <h3 class="blog-title">{{ blog.title }}</h3>
          <div class="blog-excerpt" v-if="blog.content">
            {{ getExcerpt(blog.content) }}
          </div>
        </div>

        <div class="blog-footer">
          <div class="blog-stats">
            <div class="stat-item">
              <van-icon name="like-o" color="#ff6b6b" />
              <span>{{ blog.praise || 0 }}</span>
            </div>
            <div class="stat-item">
              <van-icon name="eye-o" color="#1890ff" />
              <span>{{ blog.viewCount || 0 }}</span>
            </div>
            <div class="stat-item">
              <van-icon name="comment-o" color="#52c41a" />
              <span>{{ blog.commentCount || 0 }}</span>
            </div>
          </div>
          <div class="blog-actions">
            <van-button size="mini" plain icon="edit" @click.stop="editBlog(blog)">
              编辑
            </van-button>
            <van-button size="mini" plain icon="delete" @click.stop="deleteBlog(blog)">
              删除
            </van-button>
          </div>
        </div>

        <div class="blog-card-bg"></div>
      </div>
    </div>

    <!-- 分页导航 -->
    <div v-if="flag && totalPages > 1" class="pagination-container">
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

    <div v-else class="empty-container">
      <van-empty
        image="https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png"
        description="暂无博客分享"
      >
        <van-button round type="primary" class="create-button" @click="handleAddBlog">
          写第一篇博客
        </van-button>
      </van-empty>
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
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onActivated } from 'vue'
import { api } from '@/api/apiClient'
import { useRouter } from 'vue-router'
import { showFailToast } from 'vant'

// 为组件设置名称，确保 keep-alive 能正确缓存
defineOptions({
  name: 'MyBlog',
})

const blogList = ref() || []
const user = ref()
const router = useRouter()

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const totalPages = ref(0)
const flag = ref(true)
const jumpPageInput = ref('')

const loadBlogData = async (page: number = 1) => {
  try {
    const res = await api.blog.getMyBlogList({ currentPage: page })
    const blogs = res.data.data?.records || []

    // 更新分页信息
    total.value = res.data.data?.total || 0
    pageSize.value = res.data.data?.size || 10
    totalPages.value = res.data.data?.pages || Math.ceil(total.value / pageSize.value)

    // 更新 flag 状态
    if (page === 1 && blogs.length === 0) {
      flag.value = false
    } else {
      flag.value = true
    }

    blogList.value = blogs
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

const goToBlog = (id: any) => {
  router.push(`/user/blog/${id}`)
}

const handleAddBlog = () => {
  router.push('/blog/create') // 替换为你的新增博客页面路径
}

// 获取内容摘要
const getExcerpt = (content: string, maxLength: number = 100) => {
  if (!content) return ''
  return content.length > maxLength ? content.substring(0, maxLength) + '...' : content
}

// 编辑博客
const editBlog = (blog: any) => {
  router.push(`/blog/edit/${blog.id}`)
}

// 删除博客
const deleteBlog = (blog: any) => {
  // 这里可以添加删除确认对话框和实际的删除逻辑
  // 已移除控制台日志，后续可在此调用实际删除接口
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

/* 我的博客容器 */
.my-blogs-container {
  padding-bottom: 20px;
}

/* 博客卡片样式 */
.blog-card {
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
  cursor: pointer;
}

.blog-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #ff6b6b 0%, #f39c12 100%);
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

.blog-status {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #1890ff;
  font-weight: 500;
}

.blog-status .van-icon {
  font-size: 14px;
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

/* 空状态容器 */
.empty-container {
  padding: 60px 20px;
  text-align: center;
}

.create-button {
  width: 140px;
  height: 40px;
  margin-top: 20px;
  background: linear-gradient(135deg, #ff6b6b 0%, #f39c12 100%);
  border: none;
  box-shadow: 0 4px 16px rgba(255, 107, 107, 0.3);
}

/* 圆形按钮 */
.round-button {
  width: 50px;
  height: 50px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-size: 20px;
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
  .my-blogs-container {
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
