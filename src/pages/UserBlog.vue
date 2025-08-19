<template>
  <div class="blog-page">
    <!-- 文章头部区域 -->
    <div class="article-header">
      <div class="article-container">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ title }}</h1>

        <!-- 文章元信息 -->
        <div class="article-meta">
          <div class="meta-left">
            <span class="category-tag">{{ kind }}</span>
            <span class="publish-time">{{ formatTime(blog?.createTime) }}</span>
            <span class="read-count">阅读 {{ blog?.viewCount || 0 }}</span>
          </div>
        </div>

        <!-- 作者信息卡片 -->
        <div class="author-card">
          <div class="author-avatar">
            <img :src="userAvatar || '/ava.jpg'" alt="作者头像" @error="handleImageError" />
          </div>
          <div class="author-info">
            <div class="author-name">{{ userName }}</div>
            <div class="author-desc">{{ userProfile || '这个人很懒，什么都没有留下...' }}</div>
          </div>
          <div class="author-actions">
            <van-button type="primary" size="small" round>
              <van-icon name="plus" />
              关注
            </van-button>
          </div>
        </div>
      </div>
    </div>


    <!-- 文章内容区域 -->
    <div class="article-content">
      <div class="article-container">
        <div class="content-body">
          <EnhancedMarkdown :source="passage" />
        </div>
      </div>
    </div>

    <!-- 文章底部操作栏 -->
    <div class="article-actions">
      <div class="article-container">
        <div class="action-bar">
          <div class="action-left">
            <van-button
              :type="isLiked ? 'primary' : 'default'"
              size="small"
              round
              @click="like"
              class="action-btn"
            >
              <van-icon :name="isLiked ? 'good-job' : 'good-job-o'" />
              点赞 {{ praise }}
            </van-button>
            <van-button type="default" size="small" round class="action-btn">
              <van-icon name="star-o" />
              收藏
            </van-button>
            <van-button type="default" size="small" round class="action-btn">
              <van-icon name="share-o" />
              分享
            </van-button>
          </div>
          <div class="action-right" v-if="userId === id">
            <van-button type="danger" size="small" plain @click="DeleteBlog">
              <van-icon name="delete-o" />
              删除
            </van-button>
          </div>
        </div>
      </div>
    </div>


    <!-- 评论区域 -->
    <div class="comments-section">
      <div class="article-container">
        <div class="comments-header">
          <h3 class="comments-title">
            <van-icon name="chat-o" />
            评论 ({{ comments.length }})
          </h3>
        </div>

        <!-- 评论输入框 -->
        <div class="comment-input-section">
          <div class="comment-input-wrapper">
            <van-field
              v-model="newCommentContent"
              type="textarea"
              placeholder="写下你的评论，分享你的想法..."
              rows="4"
              autosize
              class="comment-input"
              show-word-limit
              maxlength="500"
            />
            <div class="comment-actions">
              <van-button
                type="primary"
                size="small"
                round
                @click="submitComment"
                :disabled="!newCommentContent.trim()"
                :loading="isSubmittingComment"
              >
                发表评论
              </van-button>
            </div>
          </div>
        </div>

        <!-- 评论列表 -->
        <div class="comments-list">
          <div v-if="comments.length > 0">
            <div v-for="comment in comments" :key="comment.id" class="comment-item">
              <div class="comment-avatar">
                <img :src="comment.avatarUrl || '/ava.jpg'" alt="用户头像"
                     @error="handleImageError" />
              </div>
              <div class="comment-main">
                <div class="comment-header">
                  <span class="comment-author">{{ comment.userName }}</span>
                  <span class="comment-time">{{ formatTime(comment.createTime) }}</span>
                </div>
                <div class="comment-content">
                  {{ comment.content }}
                </div>
                <div class="comment-footer">
                  <van-button type="default" size="mini" plain>
                    <van-icon name="good-job-o" />
                    点赞
                  </van-button>
                  <van-button type="default" size="mini" plain>
                    <van-icon name="chat-o" />
                    回复
                  </van-button>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="no-comments">
            <van-empty description="暂无评论，快来抢沙发吧~" />
          </div>
        </div>
      </div>
    </div>

    <div>
    </div>
  </div>


</template>


<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getBlogDelete, getBlogGetOne, getBlogLike, getUserCurrent } from '@/api/controller'
import myAxios from '@/plugins/myAxios'
import router from '@/config/router.ts'
import dayjs from 'dayjs'
import { showSuccessToast } from 'vant'
import EnhancedMarkdown from '@/components/EnhancedMarkdown.vue'

const route = useRoute()
const blogId = ref(Number(route.params.id))
const blog = ref()
const title = ref('')
const passage = ref('')
const kind = ref('')
const praise = ref()

const comments = ref([])
const userAvatar = ref('')
const userName = ref('')
const userProfile = ref('')
const id = ref(0)
const userId = ref(0)
const getBlogData = async () => {
  const response = await getBlogGetOne({ blogId: blogId.value })
  blog.value = response.data.data
  title.value = blog.value.title
  passage.value = blog.value.passage
  kind.value = blog.value.kind
  praise.value = blog.value.praise
  userId.value = blog.value.userId

  // 获取当前用户信息（根据博客中的 userId）
  const userResponse = await myAxios.get(`/user/search/one`, {
    params: {
      id: blog.value.userId
    }
  })
  const userData = userResponse.data.data
  userAvatar.value = userData.avatarUrl
  userName.value = userData.userName
  userProfile.value = userData.profile

  const commentResponse = await myAxios.get(`/comment/list`, {
    params: {
      blogId: blogId.value
    }
  })
  comments.value = commentResponse.data.data || []
}

const newCommentContent = ref('')
const isSubmittingComment = ref(false)
const isLiked = ref(false)

// 格式化时间
const formatTime = (time: string) => {
  if (!time) return ''
  return dayjs(time).format('YYYY-MM-DD HH:mm')
}


const submitComment = async () => {
  if (!newCommentContent.value.trim()) return

  isSubmittingComment.value = true
  try {
    await myAxios.get('/comment/create', {
      params: {
        blogId: blogId.value,
        comment: newCommentContent.value
      }
    })
    newCommentContent.value = ''
    await getBlogData()
    showSuccessToast('评论发表成功')
  } catch (error) {
    console.error('提交评论失败:', error)
    showSuccessToast('评论发表失败，请重试')
  } finally {
    isSubmittingComment.value = false
  }
}

const like = async () => {
  const params = {
    blogId: blogId.value
  }
  const res = await getBlogLike(params)
  await getBlogData()
}

const getId = async () => {
  const res = await getUserCurrent()
  id.value = res.data.data.id
}
getId()

const DeleteBlog = async () => {
  const res = await getBlogDelete({ id: blogId.value })
  if (res.data.code === 0) {
    showSuccessToast('删除成功')
    router.push('/Blog')
  } else {
    showSuccessToast('删除失败')
  }
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/ava.jpg'
}

onMounted(async () => {
  await getBlogData()
})

</script>


<style scoped>
/* 整体页面布局 */
.blog-page {
  background-color: #f5f6f7;
  min-height: 100vh;
  padding-bottom: 60px;
}

.article-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

/* 文章头部区域 */
.article-header {
  background: #fff;
  border-bottom: 1px solid #e4e6ea;
  padding: 24px 0;
}

.article-title {
  font-size: 32px;
  font-weight: 700;
  color: #252933;
  line-height: 1.4;
  margin: 0 0 16px 0;
  word-break: break-word;
}

.article-meta {
  margin-bottom: 24px;
}

.meta-left {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.category-tag {
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
}

.publish-time,
.read-count {
  color: #86909c;
  font-size: 14px;
}

/* 作者信息卡片 */
.author-card {
  display: flex;
  align-items: center;
  padding: 16px;
  background: #f7f8fa;
  border-radius: 8px;
  border: 1px solid #e4e6ea;
}

.author-avatar {
  margin-right: 12px;
}

.author-avatar img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.author-info {
  flex: 1;
}

.author-name {
  font-size: 16px;
  font-weight: 600;
  color: #252933;
  margin-bottom: 4px;
}

.author-desc {
  font-size: 14px;
  color: #86909c;
  line-height: 1.4;
}

.author-actions {
  margin-left: 12px;
}

/* 文章内容区域 */
.article-content {
  background: #fff;
  margin-top: 8px;
  padding: 32px 0;
}

.content-body {
  font-size: 16px;
  line-height: 1.8;
  color: #252933;
  word-break: break-word;
}

.content-body :deep(p) {
  margin-bottom: 16px;
  text-align: justify;
}

.content-body :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 16px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Markdown渲染样式 - 优化颜色和间距 */
.content-body :deep(h1),
.content-body :deep(h2),
.content-body :deep(h3),
.content-body :deep(h4),
.content-body :deep(h5),
.content-body :deep(h6) {
  color: #1a1a1a;
  margin: 32px 0 20px 0;
  font-weight: 700;
  line-height: 1.3;
}

.content-body :deep(h1) { 
  font-size: 36px; 
  color: #0066cc;
  border-bottom: 3px solid #e6f3ff;
  padding-bottom: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.content-body :deep(h2) { 
  font-size: 30px; 
  color: #0080ff;
  border-bottom: 2px solid #f0f8ff;
  padding-bottom: 10px;
}
.content-body :deep(h3) { 
  font-size: 26px; 
  color: #1a73e8;
}
.content-body :deep(h4) { 
  font-size: 22px; 
  color: #2196f3;
}
.content-body :deep(h5) { 
  font-size: 20px; 
  color: #42a5f5;
}
.content-body :deep(h6) { 
  font-size: 18px; 
  color: #64b5f6;
}

.content-body :deep(code) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-family: 'Fira Code', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 15px;
  font-weight: 600;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  border: none;
}

.content-body :deep(pre) {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  border: 2px solid #34495e;
  border-radius: 12px;
  padding: 20px;
  overflow-x: auto;
  margin: 24px 0;
  line-height: 1.6;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  position: relative;
}

.content-body :deep(pre code) {
  background: none;
  padding: 0;
  border: none;
  color: #ecf0f1;
  font-size: 15px;
  font-weight: 500;
  box-shadow: none;
}

/* 增强的代码高亮样式 */
.content-body :deep(pre code .keyword) { color: #ff6b6b; font-weight: 600; }
.content-body :deep(pre code .string) { color: #4ecdc4; }
.content-body :deep(pre code .comment) { color: #95a5a6; font-style: italic; opacity: 0.8; }
.content-body :deep(pre code .number) { color: #f39c12; font-weight: 600; }
.content-body :deep(pre code .function) { color: #74b9ff; font-weight: 600; }
.content-body :deep(pre code .variable) { color: #a29bfe; }
.content-body :deep(pre code .operator) { color: #fd79a8; }
.content-body :deep(pre code .punctuation) { color: #ddd; }

.content-body :deep(blockquote) {
  border-left: 4px solid #ff6b6b;
  margin: 20px 0;
  padding: 12px 20px;
  background: #f7f8fa;
  color: #4e5969;
  font-style: italic;
  border-radius: 0 4px 4px 0;
}

.content-body :deep(ul),
.content-body :deep(ol) {
  margin: 16px 0;
  padding-left: 24px;
}

.content-body :deep(li) {
  margin: 8px 0;
  line-height: 1.6;
}

.content-body :deep(a) {
  color: #ff6b6b;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s;
}

.content-body :deep(a:hover) {
  border-bottom-color: #ff6b6b;
}

.content-body :deep(strong) {
  font-weight: 600;
  color: #252933;
}

.content-body :deep(em) {
  font-style: italic;
  color: #4e5969;
}

.content-body :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 20px 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.content-body :deep(th),
.content-body :deep(td) {
  border: 1px solid #e4e6ea;
  padding: 12px 16px;
  text-align: left;
}

.content-body :deep(th) {
  background: #f7f8fa;
  font-weight: 600;
  color: #252933;
}

.content-body :deep(tr:nth-child(even)) {
  background: #fafbfc;
}

.content-body :deep(hr) {
  border: none;
  height: 2px;
  background: linear-gradient(90deg, #ff6b6b, #ee5a24);
  margin: 32px 0;
  border-radius: 1px;
}

/* 文章操作栏 */
.article-actions {
  background: #fff;
  border-top: 1px solid #e4e6ea;
  padding: 16px 0;
  position: sticky;
  bottom: 0;
  z-index: 100;
}

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.action-left {
  display: flex;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 评论区域 */
.comments-section {
  background: #fff;
  margin-top: 8px;
  padding: 24px 0;
}

.comments-header {
  margin-bottom: 24px;
}

.comments-title {
  font-size: 20px;
  font-weight: 600;
  color: #252933;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
}

/* 评论输入区域 */
.comment-input-section {
  margin-bottom: 32px;
}

.comment-input-wrapper {
  background: #f7f8fa;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e4e6ea;
}

.comment-input :deep(.van-field__control) {
  background: transparent;
  border: none;
  font-size: 14px;
  line-height: 1.6;
}

.comment-actions {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}

/* 评论列表 */
.comments-list {
  margin-top: 24px;
}

.comment-item {
  display: flex;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-avatar {
  margin-right: 12px;
  flex-shrink: 0;
}

.comment-avatar img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.comment-main {
  flex: 1;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.comment-author {
  font-size: 14px;
  font-weight: 600;
  color: #252933;
}

.comment-time {
  font-size: 12px;
  color: #86909c;
}

.comment-content {
  font-size: 14px;
  line-height: 1.6;
  color: #4e5969;
  margin-bottom: 12px;
  word-break: break-word;
}

.comment-footer {
  display: flex;
  gap: 16px;
}

.no-comments {
  text-align: center;
  padding: 40px 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .article-container {
    padding: 0 12px;
  }

  .article-title {
    font-size: 24px;
  }

  .article-header {
    padding: 16px 0;
  }

  .article-content {
    padding: 24px 0;
  }

  .author-card {
    padding: 12px;
  }

  .author-avatar img {
    width: 40px;
    height: 40px;
  }

  .author-name {
    font-size: 14px;
  }

  .author-desc {
    font-size: 12px;
  }

  .content-body {
    font-size: 15px;
  }

  .comments-section {
    padding: 16px 0;
  }

  .comments-title {
    font-size: 18px;
  }

  .action-left {
    gap: 8px;
  }

  .action-btn {
    font-size: 12px;
    padding: 6px 12px;
  }

  /* 移动端Markdown样式优化 */
  .content-body :deep(h1) { 
    font-size: 28px; 
    margin: 24px 0 16px 0;
  }
  .content-body :deep(h2) { 
    font-size: 24px; 
    margin: 20px 0 14px 0;
  }
  .content-body :deep(h3) { 
    font-size: 22px; 
    margin: 18px 0 12px 0;
  }
  .content-body :deep(h4) { 
    font-size: 20px; 
    margin: 16px 0 10px 0;
  }
  .content-body :deep(h5) { 
    font-size: 18px; 
    margin: 14px 0 8px 0;
  }
  .content-body :deep(h6) { 
    font-size: 16px; 
    margin: 12px 0 6px 0;
  }

  .content-body :deep(code) {
    font-size: 13px;
    padding: 3px 6px;
  }

  .content-body :deep(pre) {
    padding: 16px;
    margin: 16px 0;
    border-radius: 8px;
    font-size: 13px;
  }

  .content-body :deep(pre code) {
    font-size: 13px;
    line-height: 1.5;
  }

  .content-body :deep(table) {
    font-size: 13px;
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }

  .content-body :deep(th),
  .content-body :deep(td) {
    padding: 8px 12px;
    min-width: 100px;
  }

  .content-body :deep(blockquote) {
    margin: 16px 0;
    padding: 12px 16px;
    font-size: 14px;
  }

  .content-body :deep(ul),
  .content-body :deep(ol) {
    padding-left: 20px;
  }

  .content-body :deep(li) {
    margin: 6px 0;
    line-height: 1.5;
  }
}

@media (max-width: 480px) {
  .article-container {
    padding: 0 8px;
  }

  .article-title {
    font-size: 20px;
  }

  .meta-left {
    gap: 8px;
  }

  .category-tag {
    font-size: 11px;
    padding: 3px 8px;
  }

  .content-body {
    font-size: 14px;
  }

  .action-left {
    flex-wrap: wrap;
    gap: 6px;
  }

  .comment-input-wrapper {
    padding: 12px;
  }
}


</style>
