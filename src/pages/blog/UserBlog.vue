<template>
  <!-- Loading状态 -->
  <div v-if="loading" class="loading-container">
    <van-loading type="spinner" color="#1989fa" size="24px">
      加载博客内容中...
    </van-loading>
  </div>
  
  <!-- 博客内容 -->
  <div v-else class="blog-page">
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
          <VueMarkdown :source="passage" />
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
import { onMounted, ref, watch, onActivated, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { getBlogDelete, getBlogGetOne, getBlogLike, getUserCurrent } from '@/api/controller'
import myAxios from '@/plugins/myAxios'
import router from '@/config/router.ts'
import dayjs from 'dayjs'
import { showSuccessToast, showFailToast } from 'vant'
import VueMarkdown from 'vue-markdown-render'

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
const loading = ref(false)

const getBlogData = async () => {
  loading.value = true
  try {
    // 清空旧数据，防止显示上一篇博客的内容
    blog.value = null
    title.value = ''
    passage.value = ''
    kind.value = ''
    praise.value = 0
    userId.value = 0
    userAvatar.value = ''
    userName.value = ''
    userProfile.value = ''
    comments.value = []

    const response = await getBlogGetOne({ blogId: blogId.value })
    blog.value = response.data.data
    title.value = blog.value.title
    passage.value = blog.value.passage
    kind.value = blog.value.kind
    praise.value = blog.value.praise
    userId.value = blog.value.userId
    
    // 初始化点赞状态（如果API返回了点赞状态）
    // 注意：这里需要根据你的API实际返回的字段来调整
    isLiked.value = blog.value.isLiked || false

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
    
    // 延迟初始化代码块复制按钮，确保DOM完全渲染
    setTimeout(() => {
      initCodeCopyButtons()
      setupCodeCopyObserver()
    }, 1000)
  } finally {
    loading.value = false
  }
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
  try {
    const params = {
      blogId: blogId.value
    }
    const res = await getBlogLike(params)
    
    // 只更新点赞数，不重新加载整个页面
    if (res.data.code === 0) {
      // 切换点赞状态
      isLiked.value = !isLiked.value
      
      // 更新点赞数（根据API返回的数据或本地计算）
      if (res.data.data !== undefined) {
        praise.value = res.data.data
      } else {
        // 如果API没有返回新的点赞数，本地计算
        praise.value = isLiked.value ? praise.value + 1 : praise.value - 1
      }
      
      showSuccessToast(isLiked.value ? '点赞成功' : '取消点赞')
    } else {
      showFailToast('操作失败，请重试')
    }
  } catch (error) {
    console.error('点赞操作失败:', error)
    showFailToast('网络错误，请重试')
  }
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

// 复制代码功能
const copyCode = async (code: string) => {
  if (!code) return
  
  try {
    await navigator.clipboard.writeText(code)
    showSuccessToast('代码已复制到剪贴板')
  } catch (err) {
    // 降级方案
    const textArea = document.createElement('textarea')
    textArea.value = code
    document.body.appendChild(textArea)
    textArea.select()
    try {
      document.execCommand('copy')
      showSuccessToast('代码已复制到剪贴板')
    } catch (fallbackErr) {
      showFailToast('复制失败，请手动复制')
    }
    document.body.removeChild(textArea)
  }
}

// 初始化代码块复制按钮
const initCodeCopyButtons = () => {
  console.log('🔍 开始初始化复制按钮...')
  
  nextTick(() => {
    // 尝试多个选择器
    let codeBlocks = document.querySelectorAll('.content-body pre')
    if (codeBlocks.length === 0) {
      codeBlocks = document.querySelectorAll('pre')
    }
    if (codeBlocks.length === 0) {
      codeBlocks = document.querySelectorAll('.article-content pre')
    }
    
    console.log('📊 找到的代码块数量:', codeBlocks.length)
    console.log('📋 代码块元素:', codeBlocks)
    
    codeBlocks.forEach((block, index) => {
      console.log(`🔧 处理第 ${index + 1} 个代码块:`, block)
      // 检查是否已经添加了复制按钮
      if (block.querySelector('.copy-code-btn')) return
      
      const codeElement = block.querySelector('code')
      if (!codeElement) return
      
      const code = codeElement.textContent || ''
      
      // 创建复制按钮
      const copyBtn = document.createElement('button')
      copyBtn.className = 'copy-code-btn'
      copyBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z" fill="currentColor"/>
        </svg>
        <span>复制</span>
      `
      copyBtn.title = '复制代码'
      
      // 添加点击事件
      copyBtn.addEventListener('click', () => {
        copyCode(code)
      })
      
      // 设置代码块容器为相对定位
      ;(block as HTMLElement).style.position = 'relative'
      
      // 添加按钮到代码块
      block.appendChild(copyBtn)
    })
  })
}

onMounted(async () => {
  await getBlogData()
})

// 使用 MutationObserver 监听 DOM 变化
let observer: MutationObserver | null = null

const setupCodeCopyObserver = () => {
  // 清理之前的观察器
  if (observer) {
    observer.disconnect()
  }
  
  const targetNode = document.querySelector('.content-body')
  if (!targetNode) {
    console.log('❌ 未找到 .content-body 元素')
    return
  }
  
  observer = new MutationObserver((mutations) => {
    let shouldInit = false
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        // 检查是否有新的 pre 元素被添加
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element
            if (element.tagName === 'PRE' || element.querySelector('pre')) {
              shouldInit = true
            }
          }
        })
      }
    })
    
    if (shouldInit) {
      console.log('🔄 检测到新的代码块，重新初始化复制按钮')
      setTimeout(() => {
        initCodeCopyButtons()
      }, 100)
    }
  })
  
  observer.observe(targetNode, {
    childList: true,
    subtree: true
  })
  
  console.log('👀 已设置 DOM 变化监听器')
}

// 监听 passage 变化，重新初始化复制按钮
watch(() => passage.value, () => {
  if (passage.value) {
    setTimeout(() => {
      initCodeCopyButtons()
      setupCodeCopyObserver()
    }, 500)
  }
})

// 监听路由参数变化，当博客ID改变时重新获取数据
watch(() => route.params.id, async (newId) => {
  if (newId) {
    blogId.value = Number(newId)
    await getBlogData()
  }
}, { immediate: false })

// 当页面从缓存中激活时，检查路由参数是否变化
onActivated(async () => {
  const currentBlogId = Number(route.params.id)
  if (currentBlogId !== blogId.value) {
    blogId.value = currentBlogId
    await getBlogData()
  }
})

</script>


<style scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  width: 100%;
}
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

/* 代码块复制按钮样式 */
.content-body :deep(pre) {
  position: relative;
}

.content-body :deep(.copy-code-btn) {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 12px;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;
  backdrop-filter: blur(4px);
  z-index: 10;
}

.content-body :deep(.copy-code-btn:hover) {
  background: rgba(255, 255, 255, 1);
  color: #333;
  border-color: rgba(0, 0, 0, 0.2);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.content-body :deep(.copy-code-btn:active) {
  transform: translateY(0);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.content-body :deep(.copy-code-btn svg) {
  width: 14px;
  height: 14px;
  opacity: 0.7;
}

.content-body :deep(.copy-code-btn:hover svg) {
  opacity: 1;
}

.content-body :deep(.copy-code-btn span) {
  font-weight: 500;
  white-space: nowrap;
}

/* 暗色主题的代码块样式优化 */
.content-body :deep(pre) {
  background: #2d3748;
  color: #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  overflow-x: auto;
  margin: 16px 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.content-body :deep(pre code) {
  background: none;
  color: inherit;
  font-family: 'Fira Code', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .content-body :deep(.copy-code-btn) {
    padding: 4px 8px;
    font-size: 11px;
    top: 6px;
    right: 6px;
  }
  
  .content-body :deep(.copy-code-btn svg) {
    width: 12px;
    height: 12px;
  }
  
  .content-body :deep(pre) {
    padding: 12px;
    margin: 12px 0;
  }
  
  .content-body :deep(pre code) {
    font-size: 13px;
  }
}


</style>
