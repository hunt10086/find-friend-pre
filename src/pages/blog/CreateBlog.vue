<template>
  <div class="create-blog-page">
    <!-- 顶部导航栏 -->
    <div class="editor-header">
      <div class="header-left">
        <van-icon name="arrow-left" class="back-icon" @click="handleBack" />
        <h1 class="page-title">{{ getPageTitle() }}</h1>
      </div>
      <div class="header-right">
        <button v-if="!isEditMode || blogStatus === 1" @click="saveDraft" class="draft-button">
          保存草稿
        </button>
        <button @click="submitBlog" class="publish-button">
          {{ getPublishButtonText() }}
        </button>
      </div>
    </div>

    <div class="editor-container">
      <!-- 左侧编辑区域 -->
      <div class="editor-main">
        <!-- 标题输入 -->
        <div class="title-section">
          <input
            type="text"
            v-model="title"
            placeholder="输入文章标题..."
            class="title-input"
            maxlength="100"
          />
          <div class="title-counter">{{ title.length }}/100</div>
        </div>

        <!-- 工具栏 -->
        <div class="editor-toolbar">
          <div class="toolbar-group">
            <button class="toolbar-btn" title="加粗" @click="insertFormat('**', '**')">
              <span class="icon">B</span>
            </button>
            <button class="toolbar-btn" title="斜体" @click="insertFormat('*', '*')">
              <span class="icon italic">I</span>
            </button>
            <button class="toolbar-btn" title="代码" @click="insertFormat('`', '`')">
              <span class="icon">&lt;/&gt;</span>
            </button>
            <button class="toolbar-btn" title="链接" @click="insertFormat('[', '](url)')">
              <span class="icon">🔗</span>
            </button>
          </div>
          <div class="toolbar-group">
            <button class="toolbar-btn" title="标题" @click="insertFormat('## ', '')">
              <span class="icon">H</span>
            </button>
            <button class="toolbar-btn" title="列表" @click="insertFormat('- ', '')">
              <span class="icon">≡</span>
            </button>
            <button class="toolbar-btn" title="引用" @click="insertFormat('> ', '')">
              <span class="icon">"</span>
            </button>
            <button class="toolbar-btn" title="代码块" @click="insertCodeBlock()">
              <span class="icon">{ }</span>
            </button>
          </div>
        </div>

        <!-- 内容编辑器 -->
        <div class="content-section">
          <textarea
            ref="contentTextarea"
            v-model="content"
            placeholder="开始写作吧，支持 Markdown 语法..."
            class="content-editor"
            @input="updateWordCount"
          ></textarea>
          <div class="editor-footer">
            <div class="word-count">字数：{{ wordCount }}</div>
            <div class="markdown-tip">支持 Markdown 语法</div>
          </div>
        </div>
      </div>

      <!-- 右侧设置面板 -->
      <div class="editor-sidebar">
        <div class="sidebar-section">
          <h3 class="sidebar-title">发布设置</h3>

          <!-- 分类选择 -->
          <div class="form-item">
            <label class="form-label">文章分类</label>
            <select v-model="category" class="form-select">
              <option value="技术">💻 技术</option>
              <option value="前端">🎨 前端</option>
              <option value="后端">⚙️ 后端</option>
              <option value="Java">☕ Java</option>
              <option value="Python">🐍 Python</option>
              <option value="JavaScript">📜 JavaScript</option>
              <option value="Vue">💚 Vue.js</option>
              <option value="React">⚛️ React</option>
              <option value="数据库">🗄️ 数据库</option>
              <option value="算法">🧮 算法</option>
              <option value="人工智能">🤖 人工智能</option>
              <option value="移动开发">📱 移动开发</option>
              <option value="运维">🔧 运维</option>
              <option value="架构">🏗️ 架构</option>
              <option value="生活">🌱 生活</option>
              <option value="随笔">✍️ 随笔</option>
              <option value="分享">📤 分享</option>
            </select>
          </div>

          <!-- 标签输入 -->
          <div class="form-item">
            <label class="form-label">文章标签</label>
            <div class="tags-input-container">
              <div class="tags-display">
                <span v-for="(tag, index) in tags" :key="index" class="tag-item">
                  {{ tag }}
                  <button @click="removeTag(index)" class="tag-remove">×</button>
                </span>
              </div>
              <input
                v-model="currentTag"
                @keyup.enter="addTag"
                @keyup.space="addTag"
                placeholder="输入标签，按回车添加"
                class="tag-input"
                maxlength="20"
              />
            </div>
            <div class="form-tip">最多添加5个标签，用于文章分类</div>
          </div>

          <!-- 摘要 -->
          <div class="form-item">
            <label class="form-label">文章摘要</label>
            <textarea
              v-model="summary"
              placeholder="简要描述文章内容（可选）"
              class="form-textarea"
              rows="3"
              maxlength="200"
            ></textarea>
            <div class="form-tip">{{ summary.length }}/200</div>
          </div>
        </div>

        <!-- Markdown预览区域 -->
        <div class="sidebar-section">
          <h3 class="sidebar-title">Markdown预览</h3>
          <div class="preview-container">
            <div class="preview-title">{{ title || '文章标题' }}</div>
            <div class="preview-meta">
              <span class="preview-category">{{ category }}</span>
            </div>
            <div class="preview-content">
              <VueMarkdown :source="content || '开始写作吧，支持 Markdown 语法...'" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch, onMounted, onBeforeUnmount, computed } from 'vue'
import VueMarkdown from 'vue-markdown-render'
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router'
import myAxios from '@/plugins/myAxios'
import { showFailToast, showSuccessToast, showLoadingToast, showDialog } from 'vant'
import { api } from '@/api/apiClient'

const router = useRouter()
const route = useRoute()

// 编辑模式相关
const isEditMode = ref(false)
const blogId = ref<number>()
const blogStatus = ref<number>(0) // 博客状态：0=已发布，1=草稿

// 基本数据
const title = ref('')
const category = ref('技术')
const content = ref('')
const summary = ref('')

// 内容修改追踪
const initialTitle = ref('')
const initialCategory = ref('技术')
const initialContent = ref('')
const hasUnsavedChanges = computed(() => {
  return (
    title.value !== initialTitle.value ||
    category.value !== initialCategory.value ||
    content.value !== initialContent.value
  )
})
const isSaving = ref(false) // 标记是否正在保存

// 标签相关
const tags = ref<string[]>([])
const currentTag = ref('')

// 编辑器相关
const contentTextarea = ref<HTMLTextAreaElement>()
const wordCount = ref(0)

// 字数统计
const updateWordCount = () => {
  wordCount.value = content.value.replace(/\s/g, '').length
}

// 标签管理
const addTag = () => {
  const tag = currentTag.value.trim()
  if (tag && !tags.value.includes(tag) && tags.value.length < 5) {
    tags.value.push(tag)
    currentTag.value = ''
  }
}

const removeTag = (index: number) => {
  tags.value.splice(index, 1)
}

// Markdown 格式化工具
const insertFormat = (before: string, after: string) => {
  const textarea = contentTextarea.value
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = content.value.substring(start, end)

  const newText = before + selectedText + after
  content.value = content.value.substring(0, start) + newText + content.value.substring(end)

  nextTick(() => {
    textarea.focus()
    textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length)
  })
}

const insertCodeBlock = () => {
  insertFormat('\n```\n', '\n```\n')
}

// 获取页面标题
const getPageTitle = () => {
  if (isEditMode.value) {
    return blogStatus.value === 1 ? '编辑草稿' : '编辑博客'
  }
  return '写博客'
}

// 获取发布按钮文字
const getPublishButtonText = () => {
  if (isEditMode.value) {
    return blogStatus.value === 1 ? '发布文章' : '更新文章'
  }
  return '发布文章'
}

const handleBack = () => {
  if (!isSaving.value && hasUnsavedChanges.value) {
    showDialog({
      title: '提示',
      message: '您有未保存的内容，确定要离开吗？离开后将丢失未保存的数据。',
      showCancelButton: true,
      confirmButtonText: '离开',
      cancelButtonText: '取消',
      confirmButtonColor: '#ee0a24',
    })
      .then(() => {
        // 重置初始值，防止触发 onBeforeRouteLeave 的二次弹窗
        initialTitle.value = title.value
        initialCategory.value = category.value
        initialContent.value = content.value
        router.back()
      })
      .catch(() => {
        // 取消操作
      })
  } else {
    router.back()
  }
}

// 保存草稿
const saveDraft = async () => {
  if (!title.value.trim()) {
    showFailToast('请输入文章标题')
    return
  }

  const toast = showLoadingToast({
    message: '保存中...',
    forbidClick: true,
  })

  try {
    isSaving.value = true
    let response

    if (isEditMode.value && blogId.value && blogStatus.value === 1) {
      // 编辑草稿模式 - 调用更新接口
      response = await api.blog.updateBlog(
        { id: blogId.value },
        {
          title: title.value,
          kind: category.value,
          passage: content.value,
          status: 1,
        },
      )
    } else {
      // 新建草稿 - 调用创建接口，status=1
      response = await myAxios.post('/blog/create', {
        title: title.value,
        kind: category.value,
        passage: content.value,
        status: 1,
      })
    }

    toast.close()

    if (response.data.code === 0) {
      showSuccessToast('草稿已保存')
      // 跳转回我的博客页面
      router.push({ path: '/my/blog', query: { refresh: Date.now() } })
    } else {
      showFailToast('保存失败，请重试')
      isSaving.value = false
    }
  } catch (error) {
    toast.close()
    showFailToast('保存失败，请检查网络连接')
    isSaving.value = false
  }
}

// 发布博客
const submitBlog = async () => {
  if (!title.value.trim() || !content.value.trim()) {
    showFailToast('标题和内容不能为空')
    return
  }

  const toast = showLoadingToast({
    message: '发布中...',
    forbidClick: true,
  })

  try {
    isSaving.value = true
    let response

    if (isEditMode.value && blogId.value && blogStatus.value === 0) {
      // 编辑已发布的博客 - 调用更新接口
      response = await api.blog.updateBlog(
        { id: blogId.value },
        {
          title: title.value,
          kind: category.value,
          passage: content.value,
          status: 0,
        },
      )
    } else {
      // 草稿发布：先删除原草稿，再创建新博客
      if (isEditMode.value && blogId.value && blogStatus.value === 1) {
        await api.blog.deleteBlog({ id: blogId.value })
      }

      // 新建博客 或 草稿发布 - 调用创建接口，status=0
      response = await myAxios.post('/blog/create', {
        title: title.value,
        kind: category.value,
        passage: content.value,
        status: 0,
      })
    }

    toast.close()

    if (response.data.code === 0) {
      showSuccessToast('博客发布成功！')
      // 跳转回我的博客页面
      router.push({ path: '/my/blog', query: { refresh: Date.now() } })
    } else {
      showFailToast('发布失败，请重试')
      isSaving.value = false
    }
  } catch (error) {
    toast.close()
    showFailToast('发布失败，请检查网络连接')
    isSaving.value = false
  }
}

// 加载博客数据（编辑模式）
const loadBlogData = async (id: number) => {
  const toast = showLoadingToast({
    message: '加载中...',
    forbidClick: true,
  })

  try {
    const response = await api.blog.getBlog({ blogId: id })
    toast.close()

    if (response.data.code === 0 && response.data.data) {
      const blog = response.data.data
      title.value = blog.title || ''
      category.value = blog.kind || '技术'
      content.value = blog.passage || ''
      blogStatus.value = Number(blog.status) || 0 // 记录博客状态
      // summary 字段在 Blog 类型中不存在，暂时留空
      summary.value = ''
      updateWordCount()

      // 记录初始值用于检测修改
      initialTitle.value = title.value
      initialCategory.value = category.value
      initialContent.value = content.value
    } else {
      showFailToast('加载博客失败')
      router.back()
    }
  } catch (error) {
    toast.close()
    showFailToast('加载博客失败，请检查网络连接')
    router.back()
  }
}

// 页面初始化
onMounted(async () => {
  // 检查是否为编辑模式
  const id = route.params.id
  if (id) {
    isEditMode.value = true
    blogId.value = Number(id)
    await loadBlogData(blogId.value)
  } else {
    // 新建模式，记录初始值
    initialTitle.value = ''
    initialCategory.value = '技术'
    initialContent.value = ''
  }
})

// 路由离开前确认
onBeforeRouteLeave((to, from, next) => {
  if (!isSaving.value && hasUnsavedChanges.value) {
    showDialog({
      title: '提示',
      message: '您有未保存的内容，确定要离开吗？离开后将丢失未保存的数据。',
      showCancelButton: true,
      confirmButtonText: '离开',
      cancelButtonText: '取消',
      confirmButtonColor: '#ee0a24',
    })
      .then(() => {
        next()
      })
      .catch(() => {
        next(false)
      })
  } else {
    next()
  }
})

// 浏览器刷新/关闭前提示
onMounted(() => {
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (!isSaving.value && hasUnsavedChanges.value) {
      e.preventDefault()
      e.returnValue = '您有未保存的内容，确定要离开吗？'
      return e.returnValue
    }
  }

  window.addEventListener('beforeunload', handleBeforeUnload)

  onBeforeUnmount(() => {
    window.removeEventListener('beforeunload', handleBeforeUnload)
  })
})

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
  /* removed debug log: 开始初始化复制按钮 */

  nextTick(() => {
    // 尝试多个选择器
    let codeBlocks = document.querySelectorAll('.preview-content pre')
    if (codeBlocks.length === 0) {
      codeBlocks = document.querySelectorAll('.preview-container pre')
    }
    if (codeBlocks.length === 0) {
      codeBlocks = document.querySelectorAll('pre')
    }

    /* removed debug log: 找到的代码块数量 */
    /* removed debug log: 代码块元素 */

    codeBlocks.forEach((block, index) => {
      /* removed debug log: 处理代码块 */
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

// 使用 MutationObserver 监听预览区 DOM 变化
let previewObserver: MutationObserver | null = null

const setupPreviewCopyObserver = () => {
  // 清理之前的观察器
  if (previewObserver) {
    previewObserver.disconnect()
  }

  const targetNode = document.querySelector('.preview-content')
  if (!targetNode) {
    /* removed debug log: 未找到 .preview-content 元素 */
    return
  }

  previewObserver = new MutationObserver((mutations) => {
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
      /* removed debug log: 检测到新的代码块 */
      setTimeout(() => {
        initCodeCopyButtons()
      }, 100)
    }
  })

  previewObserver.observe(targetNode, {
    childList: true,
    subtree: true,
  })

  /* removed debug log: 设置预览区 DOM 变化监听器 */
}

// 监听内容变化，重新初始化复制按钮
watch(
  () => content.value,
  () => {
    if (content.value) {
      setTimeout(() => {
        initCodeCopyButtons()
        setupPreviewCopyObserver()
      }, 500)
    }
  },
)
</script>

<style scoped>
.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-icon {
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.3s;
}

.back-icon:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

/* 全局样式 */
.create-blog-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  padding-bottom: 120px; /* 增加底部间距，确保不被导航栏遮挡 */
}

/* 顶部导航栏 */
.editor-header {
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 0;
  z-index: 100;
}

.page-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #262626;
}

.header-right {
  display: flex;
  gap: 12px;
}

.draft-button {
  padding: 8px 16px;
  border: 1px solid #d9d9d9;
  background: #fff;
  color: #595959;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.draft-button:hover {
  border-color: #40a9ff;
  color: #40a9ff;
}

.publish-button {
  padding: 8px 20px;
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(238, 90, 36, 0.3);
}

.publish-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(238, 90, 36, 0.4);
}

/* 主编辑器容器 */
.editor-container {
  display: flex;
  max-width: 1400px;
  margin: 0 auto;
  gap: 24px;
  padding: 24px 24px 80px 24px; /* 增加底部内边距 */
  min-height: calc(100vh - 180px); /* 进一步调整最小高度 */
}

/* 左侧编辑区域 */
.editor-main {
  flex: 1;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

/* 标题输入区域 */
.title-section {
  padding: 24px 24px 0;
  position: relative;
}

.title-input {
  width: 100%;
  border: none;
  font-size: 24px;
  font-weight: 600;
  color: #262626;
  padding: 16px 0;
  outline: none;
  background: transparent;
  resize: none;
}

.title-input::placeholder {
  color: #bfbfbf;
  font-weight: 400;
}

.title-counter {
  position: absolute;
  right: 24px;
  bottom: 8px;
  font-size: 12px;
  color: #8c8c8c;
}

/* 工具栏 */
.editor-toolbar {
  display: flex;
  gap: 16px;
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
}

.toolbar-group {
  display: flex;
  gap: 8px;
}

.toolbar-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #d9d9d9;
  background: #fff;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  font-size: 14px;
}

.toolbar-btn:hover {
  border-color: #40a9ff;
  color: #40a9ff;
  background: #f6ffed;
}

.toolbar-btn .icon {
  font-weight: 600;
}

.toolbar-btn .icon.italic {
  font-style: italic;
}

/* 内容编辑区域 */
.content-section {
  padding: 0 24px 24px;
}

.content-editor {
  width: 100%;
  min-height: 500px;
  border: none;
  outline: none;
  font-size: 16px;
  line-height: 1.8;
  color: #262626;
  resize: vertical;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  padding: 20px 0;
}

.content-editor::placeholder {
  color: #bfbfbf;
}

.editor-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
  font-size: 12px;
  color: #8c8c8c;
}

/* 右侧设置面板 */
.editor-sidebar {
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.sidebar-section {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.sidebar-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

/* 表单元素 */
.form-item {
  margin-bottom: 20px;
}

.form-item:last-child {
  margin-bottom: 0;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #595959;
  margin-bottom: 8px;
}

.form-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 14px;
  background: #fff;
  cursor: pointer;
  transition: border-color 0.2s;
}

.form-select:focus {
  outline: none;
  border-color: #40a9ff;
  box-shadow: 0 0 0 2px rgba(64, 169, 255, 0.2);
}

.form-textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 14px;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.2s;
}

.form-textarea:focus {
  outline: none;
  border-color: #40a9ff;
  box-shadow: 0 0 0 2px rgba(64, 169, 255, 0.2);
}

.form-tip {
  font-size: 12px;
  color: #8c8c8c;
  margin-top: 4px;
}

/* 标签输入 */
.tags-input-container {
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  padding: 8px;
  min-height: 40px;
  transition: border-color 0.2s;
}

.tags-input-container:focus-within {
  border-color: #40a9ff;
  box-shadow: 0 0 0 2px rgba(64, 169, 255, 0.2);
}

.tags-display {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 6px;
}

.tag-item {
  display: inline-flex;
  align-items: center;
  background: #f6ffed;
  color: #52c41a;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  border: 1px solid #b7eb8f;
}

.tag-remove {
  background: none;
  border: none;
  color: #52c41a;
  cursor: pointer;
  margin-left: 4px;
  font-size: 14px;
  line-height: 1;
}

.tag-input {
  border: none;
  outline: none;
  flex: 1;
  font-size: 14px;
  min-width: 120px;
}

/* 单选按钮组 */
.radio-group {
  display: flex;
  gap: 16px;
}

.radio-item {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
}

.radio-item input[type='radio'] {
  margin-right: 6px;
  accent-color: #40a9ff;
}

.radio-text {
  color: #595959;
}

/* Markdown预览区域 */
.preview-container {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 16px;
  background: #fafafa;
  max-height: 500px;
  overflow-y: auto;
}

.preview-title {
  font-size: 18px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 8px;
  line-height: 1.4;
  border-bottom: 1px solid #e8e8e8;
  padding-bottom: 8px;
}

.preview-meta {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  font-size: 12px;
  color: #8c8c8c;
}

.preview-category {
  background: #e6f7ff;
  color: #1890ff;
  padding: 2px 6px;
  border-radius: 4px;
}

.preview-content {
  font-size: 14px;
  color: #595959;
  line-height: 1.6;
}

/* Markdown渲染样式 - 优化颜色和间距 */
.preview-content :deep(h1),
.preview-content :deep(h2),
.preview-content :deep(h3),
.preview-content :deep(h4),
.preview-content :deep(h5),
.preview-content :deep(h6) {
  color: #1a1a1a;
  margin: 20px 0 12px 0;
  font-weight: 700;
  line-height: 1.3;
}

.preview-content :deep(h1) {
  font-size: 24px;
  color: #0066cc;
  border-bottom: 2px solid #e6f3ff;
  padding-bottom: 8px;
}
.preview-content :deep(h2) {
  font-size: 20px;
  color: #0080ff;
  border-bottom: 1px solid #f0f8ff;
  padding-bottom: 6px;
}
.preview-content :deep(h3) {
  font-size: 18px;
  color: #1a73e8;
}
.preview-content :deep(h4) {
  font-size: 16px;
  color: #2196f3;
}
.preview-content :deep(h5) {
  font-size: 14px;
  color: #42a5f5;
}
.preview-content :deep(h6) {
  font-size: 12px;
  color: #64b5f6;
}

.preview-content :deep(p) {
  margin: 8px 0;
  line-height: 1.6;
}

.preview-content :deep(code) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 3px 6px;
  border-radius: 4px;
  font-family: 'Fira Code', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  font-weight: 500;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.preview-content :deep(pre) {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  border: 1px solid #34495e;
  border-radius: 8px;
  padding: 16px;
  overflow-x: auto;
  margin: 16px 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  position: relative;
}

.preview-content :deep(pre code) {
  background: none;
  padding: 0;
  color: #ecf0f1;
  font-size: 13px;
  line-height: 1.5;
  box-shadow: none;
}

/* 代码高亮样式 */
.preview-content :deep(pre code .keyword) {
  color: #e74c3c;
}
.preview-content :deep(pre code .string) {
  color: #2ecc71;
}
.preview-content :deep(pre code .comment) {
  color: #95a5a6;
  font-style: italic;
}
.preview-content :deep(pre code .number) {
  color: #f39c12;
}
.preview-content :deep(pre code .function) {
  color: #3498db;
}
.preview-content :deep(pre code .variable) {
  color: #9b59b6;
}

.preview-content :deep(blockquote) {
  border-left: 4px solid #ddd;
  margin: 12px 0;
  padding: 8px 16px;
  background: #f9f9f9;
  color: #666;
}

.preview-content :deep(ul),
.preview-content :deep(ol) {
  margin: 8px 0;
  padding-left: 20px;
}

.preview-content :deep(li) {
  margin: 4px 0;
}

.preview-content :deep(a) {
  color: #1890ff;
  text-decoration: none;
}

.preview-content :deep(a:hover) {
  text-decoration: underline;
}

.preview-content :deep(strong) {
  font-weight: 600;
  color: #262626;
}

.preview-content :deep(em) {
  font-style: italic;
  color: #595959;
}

.preview-content :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 12px 0;
}

.preview-content :deep(th),
.preview-content :deep(td) {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.preview-content :deep(th) {
  background: #f5f5f5;
  font-weight: 600;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .editor-container {
    flex-direction: column;
  }

  .editor-sidebar {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .editor-container {
    padding: 16px 16px 80px 16px;
    gap: 16px;
  }

  .editor-header {
    padding: 12px 16px;
  }

  .header-right {
    gap: 8px;
  }

  .draft-button,
  .publish-button {
    padding: 6px 12px;
    font-size: 13px;
  }

  .title-input {
    font-size: 20px;
  }

  .content-editor {
    font-size: 15px;
  }

  .sidebar-section {
    padding: 16px;
  }

  /* 移动端预览区域优化 */
  .preview-container {
    max-height: 300px;
    padding: 12px;
  }

  .preview-content :deep(h1) {
    font-size: 20px;
  }
  .preview-content :deep(h2) {
    font-size: 18px;
  }
  .preview-content :deep(h3) {
    font-size: 16px;
  }
  .preview-content :deep(h4) {
    font-size: 15px;
  }
  .preview-content :deep(h5) {
    font-size: 14px;
  }
  .preview-content :deep(h6) {
    font-size: 13px;
  }

  .preview-content :deep(code) {
    font-size: 12px;
    padding: 2px 4px;
  }

  .preview-content :deep(pre) {
    padding: 12px;
    margin: 12px 0;
    border-radius: 6px;
  }

  .preview-content :deep(pre code) {
    font-size: 12px;
    line-height: 1.4;
  }

  .preview-content :deep(table) {
    font-size: 12px;
  }

  .preview-content :deep(th),
  .preview-content :deep(td) {
    padding: 6px 8px;
  }
}

/* 代码块复制按钮样式 */
.preview-content :deep(pre) {
  position: relative;
}

.preview-content :deep(.copy-code-btn) {
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

.preview-content :deep(.copy-code-btn:hover) {
  background: rgba(255, 255, 255, 1);
  color: #333;
  border-color: rgba(0, 0, 0, 0.2);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.preview-content :deep(.copy-code-btn:active) {
  transform: translateY(0);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.preview-content :deep(.copy-code-btn svg) {
  width: 14px;
  height: 14px;
  opacity: 0.7;
}

.preview-content :deep(.copy-code-btn:hover svg) {
  opacity: 1;
}

.preview-content :deep(.copy-code-btn span) {
  font-weight: 500;
  white-space: nowrap;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .preview-content :deep(.copy-code-btn) {
    padding: 4px 8px;
    font-size: 11px;
    top: 6px;
    right: 6px;
  }

  .preview-content :deep(.copy-code-btn svg) {
    width: 12px;
    height: 12px;
  }
}
</style>
