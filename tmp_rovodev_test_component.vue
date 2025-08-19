<template>
  <div class="test-page">
    <h1>🧪 EnhancedMarkdown 组件测试</h1>
    
    <div class="test-section">
      <h2>测试用的Markdown内容</h2>
      <EnhancedMarkdown :source="testMarkdown" :defaultTheme="currentTheme" />
    </div>
    
    <div class="theme-controls">
      <h3>主题测试</h3>
      <div class="theme-buttons">
        <button 
          v-for="theme in themes" 
          :key="theme.value"
          @click="currentTheme = theme.value"
          :class="{ active: currentTheme === theme.value }"
          class="theme-btn"
        >
          {{ theme.text }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import EnhancedMarkdown from '@/components/EnhancedMarkdown.vue'

const currentTheme = ref('dark')

const themes = [
  { text: '🌙 暗黑', value: 'dark' },
  { text: '☀️ 明亮', value: 'light' },
  { text: '🔵 蓝色', value: 'blue' },
  { text: '🟢 绿色', value: 'green' },
  { text: '🟣 紫色', value: 'purple' },
  { text: '🐙 GitHub', value: 'github' },
  { text: '💻 VS Code', value: 'vscode' },
  { text: '⚡ 终端', value: 'terminal' }
]

const testMarkdown = `# 🎨 博客增强功能测试

这是一个测试页面，用来验证我们的增强Markdown组件是否正常工作。

## ✨ 功能特性

- **多种代码高亮主题**：8种精美主题可选
- **一键复制代码**：每个代码块都有复制按钮
- **优化的样式**：更美观的Markdown渲染

## 📝 代码示例

### JavaScript 代码

\`\`\`javascript
function createBlogPost(title, content) {
    const post = {
        id: Date.now(),
        title: title,
        content: content,
        created: new Date(),
        published: true
    };
    
    console.log('创建博客文章:', post);
    return post;
}

// 使用示例
const myPost = createBlogPost('Hello World', 'This is my first post!');
\`\`\`

### Python 代码

\`\`\`python
def process_blog_content(content):
    """处理博客内容"""
    if not content:
        return ""
    
    # 处理代码高亮
    highlighted = highlight_code(content)
    return highlighted

# 示例用法
markdown_text = "# Hello World\\n\\nThis is a **bold** text."
result = process_blog_content(markdown_text)
print(result)
\`\`\`

### HTML 代码

\`\`\`html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>博客页面</title>
</head>
<body>
    <div class="blog-container">
        <h1>欢迎来到我的博客</h1>
        <p>这里有很多有趣的内容！</p>
    </div>
</body>
</html>
\`\`\`

### CSS 代码

\`\`\`css
.code-highlight-wrapper {
    margin: 20px 0;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.code-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: rgba(0, 0, 0, 0.2);
}
\`\`\`

## 🎯 其他Markdown元素

### 行内代码
这是一个行内代码示例：\`console.log('Hello World')\`

### 引用块
> 这是一个引用块的示例。它应该有特殊的样式，包括左侧的彩色边框和背景色。

### 列表
- 第一个列表项
- 第二个列表项
- 第三个列表项

### 有序列表
1. 第一步
2. 第二步
3. 第三步

### 链接
这是一个链接示例：[GitHub](https://github.com)

### 粗体和斜体
这是**粗体文本**，这是*斜体文本*。

### 水平线

---

## 🚀 测试说明

1. 点击上方的主题按钮切换代码高亮主题
2. 点击代码块右上角的复制按钮测试复制功能
3. 检查各种Markdown元素的渲染效果
4. 在不同屏幕尺寸下测试响应式效果

如果一切正常，你应该能看到：
- ✅ 代码块有语法高亮
- ✅ 复制按钮可以正常工作
- ✅ 主题切换生效
- ✅ 样式美观且响应式
`
</script>

<style scoped>
.test-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  background: #f5f6f7;
  min-height: 100vh;
}

.test-section {
  background: white;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.theme-controls {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.theme-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.theme-btn {
  padding: 8px 16px;
  border: 2px solid #e4e6ea;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.theme-btn:hover {
  border-color: #667eea;
  background: #f8f9fa;
}

.theme-btn.active {
  border-color: #667eea;
  background: #667eea;
  color: white;
}

h1 {
  color: #333;
  text-align: center;
  margin-bottom: 30px;
}

h2, h3 {
  color: #0066cc;
}
</style>