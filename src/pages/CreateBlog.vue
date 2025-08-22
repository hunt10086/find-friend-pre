<template>
  <div class="create-blog-page">
    <!-- 顶部导航栏 -->
    <div class="editor-header">
      <div class="header-left">
        <h1 class="page-title">写博客</h1>
      </div>
      <div class="header-right">
        <button @click="saveDraft" class="draft-button">保存草稿</button>
        <button @click="submitBlog" class="publish-button">发布文章</button>
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
                <span
                  v-for="(tag, index) in tags"
                  :key="index"
                  class="tag-item"
                >
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

          <!-- 可见性设置 -->
          <div class="form-item">
            <label class="form-label">可见性</label>
            <div class="radio-group">
              <label class="radio-item">
                <input type="radio" v-model="visibility" value="public" />
                <span class="radio-text">🌍 公开</span>
              </label>
              <label class="radio-item">
                <input type="radio" v-model="visibility" value="private" />
                <span class="radio-text">🔒 私密</span>
              </label>
            </div>
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
import { ref, nextTick } from 'vue'
import VueMarkdown from 'vue-markdown-render'
import { useRouter } from 'vue-router'
import myAxios from '@/plugins/myAxios'
import { showFailToast, showSuccessToast, showLoadingToast } from 'vant'

const router = useRouter()

// 基本数据
const title = ref('')
const category = ref('技术')
const content = ref('')
const summary = ref('')
const visibility = ref('public')

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
    // 这里可以实现草稿保存逻辑
    // 暂时使用 localStorage 保存
    const draft = {
      title: title.value,
      category: category.value,
      content: content.value,
      summary: summary.value,
      tags: tags.value,
      visibility: visibility.value,
      timestamp: Date.now()
    }

    localStorage.setItem('blog_draft', JSON.stringify(draft))
    toast.close()
    showSuccessToast('草稿已保存')
  } catch (error) {
    toast.close()
    showFailToast('保存失败')
    console.error('保存草稿失败:', error)
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
    const response = await myAxios.post('/blog/create', {
      title: title.value,
      kind: category.value,
      passage: content.value
    })

    toast.close()

    if (response.data.code === 0) {
      showSuccessToast('博客发布成功！')
      // 清除草稿
      localStorage.removeItem('blog_draft')
      // 添加时间戳参数强制刷新列表
      router.push({ path: '/blog', query: { refresh: Date.now() } })
    } else {
      showFailToast('发布失败，请重试')
    }
  } catch (error) {
    toast.close()
    showFailToast('发布失败，请检查网络连接')
    console.error('提交博客失败:', error)
  }
}

// 页面加载时恢复草稿
const loadDraft = () => {
  try {
    const draft = localStorage.getItem('blog_draft')
    if (draft) {
      const draftData = JSON.parse(draft)
      title.value = draftData.title || ''
      category.value = draftData.category || '技术'
      content.value = draftData.content || ''
      summary.value = draftData.summary || ''
      tags.value = draftData.tags || []
      visibility.value = draftData.visibility || 'public'
      updateWordCount()
    }
  } catch (error) {
    console.error('加载草稿失败:', error)
  }
}

// 组件挂载时加载草稿
loadDraft()
</script>




<style scoped>
/* 全局样式 */
.create-blog-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
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

.radio-item input[type="radio"] {
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
.preview-content :deep(pre code .keyword) { color: #e74c3c; }
.preview-content :deep(pre code .string) { color: #2ecc71; }
.preview-content :deep(pre code .comment) { color: #95a5a6; font-style: italic; }
.preview-content :deep(pre code .number) { color: #f39c12; }
.preview-content :deep(pre code .function) { color: #3498db; }
.preview-content :deep(pre code .variable) { color: #9b59b6; }

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

  .preview-content :deep(h1) { font-size: 20px; }
  .preview-content :deep(h2) { font-size: 18px; }
  .preview-content :deep(h3) { font-size: 16px; }
  .preview-content :deep(h4) { font-size: 15px; }
  .preview-content :deep(h5) { font-size: 14px; }
  .preview-content :deep(h6) { font-size: 13px; }

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
</style>
