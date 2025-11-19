<template>
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
          <van-tag type="primary" size="small">{{ blog.kind || '未分类' }}</van-tag>
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
          <van-button size="mini" plain icon="edit" @click.stop="editBlog(blog)"> 编辑 </van-button>
          <van-button size="mini" plain icon="delete" @click.stop="deleteBlog(blog)">
            删除
          </van-button>
        </div>
      </div>

      <div class="blog-card-bg"></div>
    </div>
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
</template>

<script setup lang="ts">
import { onMounted, ref, onActivated } from 'vue'
import { getBlogMyList } from '@/api/controller'
import { useRouter } from 'vue-router'

// 为组件设置名称，确保 keep-alive 能正确缓存
defineOptions({
  name: 'MyBlog',
})

const blogList = ref() || []
const user = ref()
const router = useRouter()
const flag = ref(false)

const loadMyBlogData = async () => {
  const response = await getBlogMyList()
  blogList.value = response.data.data || []
  if (response.data.code === 0 && blogList.value.length > 0) {
    flag.value = true
  } else {
    flag.value = false
  }
}

onMounted(async () => {
  await loadMyBlogData()
})

// 当页面从缓存中激活时重新获取数据
onActivated(async () => {
  await loadMyBlogData()
})

const goToBlog = (id) => {
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
}
</style>
