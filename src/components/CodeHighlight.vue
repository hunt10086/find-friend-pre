<template>
  <div class="code-highlight-wrapper">
    <!-- 主题选择器 -->
    <div class="theme-selector" v-if="showThemeSelector">
      <van-dropdown-menu>
        <van-dropdown-item v-model="currentTheme" :options="themeOptions" @change="onThemeChange">
          <template #title>
            <van-icon name="palette-o" />
            主题
          </template>
        </van-dropdown-item>
      </van-dropdown-menu>
    </div>

    <!-- 代码块容器 -->
    <div class="code-container" :class="`theme-${currentTheme}`">
      <div class="code-header">
        <div class="code-info">
          <span class="language-tag" v-if="language">{{ language }}</span>
          <span class="file-name" v-if="fileName">{{ fileName }}</span>
        </div>
        <div class="code-actions">
          <van-button 
            type="default" 
            size="mini" 
            icon="copy" 
            @click="copyCode"
            :loading="copying"
            class="copy-btn"
          >
            {{ copying ? '复制中...' : '复制代码' }}
          </van-button>
        </div>
      </div>
      <pre class="code-block"><code ref="codeRef" v-html="highlightedCode"></code></pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { showSuccessToast, showFailToast } from 'vant'

interface Props {
  code: string
  language?: string
  fileName?: string
  showThemeSelector?: boolean
  defaultTheme?: string
}

const props = withDefaults(defineProps<Props>(), {
  language: 'javascript',
  showThemeSelector: true,
  defaultTheme: 'dark'
})

const codeRef = ref<HTMLElement>()
const copying = ref(false)
const currentTheme = ref(props.defaultTheme)

// 主题选项
const themeOptions = [
  { text: '暗黑主题', value: 'dark' },
  { text: '明亮主题', value: 'light' },
  { text: '蓝色主题', value: 'blue' },
  { text: '绿色主题', value: 'green' },
  { text: '紫色主题', value: 'purple' },
  { text: 'GitHub主题', value: 'github' },
  { text: 'VS Code主题', value: 'vscode' },
  { text: '终端主题', value: 'terminal' }
]

// 简单的语法高亮函数
const highlightCode = (code: string, lang: string) => {
  // 基础的语法高亮规则
  const rules = {
    // 关键字
    keyword: /\b(function|const|let|var|if|else|for|while|return|class|import|export|from|default|async|await|try|catch|finally|throw|new|this|super|extends|implements|interface|type|enum|namespace|public|private|protected|static|readonly|abstract)\b/g,
    // 字符串
    string: /(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g,
    // 注释
    comment: /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm,
    // 数字
    number: /\b\d+(\.\d+)?\b/g,
    // 函数名
    function: /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g,
    // 操作符
    operator: /[+\-*/%=<>!&|^~?:]/g,
    // 标点符号
    punctuation: /[{}[\]();,\.]/g,
    // HTML标签
    tag: /<\/?[a-zA-Z][^>]*>/g,
    // CSS属性
    property: /([a-zA-Z-]+)\s*:/g,
    // 变量
    variable: /\$[a-zA-Z_][a-zA-Z0-9_]*/g
  }

  let highlighted = code
  
  // 应用高亮规则
  highlighted = highlighted.replace(rules.comment, '<span class="comment">$&</span>')
  highlighted = highlighted.replace(rules.string, '<span class="string">$&</span>')
  highlighted = highlighted.replace(rules.keyword, '<span class="keyword">$&</span>')
  highlighted = highlighted.replace(rules.number, '<span class="number">$&</span>')
  highlighted = highlighted.replace(rules.function, '<span class="function">$1</span>')
  highlighted = highlighted.replace(rules.operator, '<span class="operator">$&</span>')
  highlighted = highlighted.replace(rules.punctuation, '<span class="punctuation">$&</span>')
  
  if (lang === 'html' || lang === 'xml') {
    highlighted = highlighted.replace(rules.tag, '<span class="tag">$&</span>')
  }
  
  if (lang === 'css' || lang === 'scss' || lang === 'less') {
    highlighted = highlighted.replace(rules.property, '<span class="property">$1</span>:')
  }
  
  if (lang === 'bash' || lang === 'shell') {
    highlighted = highlighted.replace(rules.variable, '<span class="variable">$&</span>')
  }

  return highlighted
}

const highlightedCode = computed(() => {
  return highlightCode(props.code, props.language || 'javascript')
})

// 复制代码功能
const copyCode = async () => {
  if (!props.code) return
  
  copying.value = true
  try {
    await navigator.clipboard.writeText(props.code)
    showSuccessToast('代码已复制到剪贴板')
  } catch (err) {
    // 降级方案
    const textArea = document.createElement('textarea')
    textArea.value = props.code
    document.body.appendChild(textArea)
    textArea.select()
    try {
      document.execCommand('copy')
      showSuccessToast('代码已复制到剪贴板')
    } catch (fallbackErr) {
      showFailToast('复制失败，请手动复制')
    }
    document.body.removeChild(textArea)
  } finally {
    copying.value = false
  }
}

// 主题切换
const onThemeChange = (value: string) => {
  currentTheme.value = value
  // 可以触发事件让父组件知道主题变化
}

// 监听主题变化，保存到本地存储
watch(currentTheme, (newTheme) => {
  localStorage.setItem('code-highlight-theme', newTheme)
}, { immediate: true })

onMounted(() => {
  // 从本地存储恢复主题
  const savedTheme = localStorage.getItem('code-highlight-theme')
  if (savedTheme && themeOptions.some(option => option.value === savedTheme)) {
    currentTheme.value = savedTheme
  }
})
</script>

<style scoped>
.code-highlight-wrapper {
  margin: 20px 0;
}

.theme-selector {
  margin-bottom: 12px;
}

.code-container {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.code-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.language-tag {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.file-name {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  font-family: 'Fira Code', monospace;
}

.copy-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  transition: all 0.2s ease;
}

.copy-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.code-block {
  margin: 0;
  padding: 20px;
  overflow-x: auto;
  line-height: 1.6;
  font-family: 'Fira Code', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
}

.code-block code {
  background: none;
  padding: 0;
  border: none;
  font-size: inherit;
  font-family: inherit;
}

/* 暗黑主题 */
.theme-dark {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
}

.theme-dark .code-header {
  background: rgba(0, 0, 0, 0.2);
}

.theme-dark .code-block {
  background: transparent;
  color: #ecf0f1;
}

.theme-dark :deep(.keyword) { color: #ff6b6b; font-weight: 600; }
.theme-dark :deep(.string) { color: #4ecdc4; }
.theme-dark :deep(.comment) { color: #95a5a6; font-style: italic; opacity: 0.8; }
.theme-dark :deep(.number) { color: #f39c12; font-weight: 600; }
.theme-dark :deep(.function) { color: #74b9ff; font-weight: 600; }
.theme-dark :deep(.variable) { color: #a29bfe; }
.theme-dark :deep(.operator) { color: #fd79a8; }
.theme-dark :deep(.punctuation) { color: #ddd; }
.theme-dark :deep(.tag) { color: #e17055; }
.theme-dark :deep(.property) { color: #00b894; }

/* 明亮主题 */
.theme-light {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: 1px solid #dee2e6;
}

.theme-light .code-header {
  background: rgba(0, 0, 0, 0.05);
  border-bottom-color: #dee2e6;
}

.theme-light .language-tag {
  background: #007bff;
  color: white;
}

.theme-light .file-name {
  color: #6c757d;
}

.theme-light .copy-btn {
  background: #f8f9fa;
  border-color: #dee2e6;
  color: #495057;
}

.theme-light .code-block {
  background: transparent;
  color: #212529;
}

.theme-light :deep(.keyword) { color: #d73a49; font-weight: 600; }
.theme-light :deep(.string) { color: #032f62; }
.theme-light :deep(.comment) { color: #6a737d; font-style: italic; }
.theme-light :deep(.number) { color: #005cc5; font-weight: 600; }
.theme-light :deep(.function) { color: #6f42c1; font-weight: 600; }
.theme-light :deep(.variable) { color: #e36209; }
.theme-light :deep(.operator) { color: #d73a49; }
.theme-light :deep(.punctuation) { color: #24292e; }
.theme-light :deep(.tag) { color: #22863a; }
.theme-light :deep(.property) { color: #005cc5; }

/* 蓝色主题 */
.theme-blue {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.theme-blue .code-header {
  background: rgba(0, 0, 0, 0.2);
}

.theme-blue .code-block {
  background: transparent;
  color: #ffffff;
}

.theme-blue :deep(.keyword) { color: #ffd700; font-weight: 600; }
.theme-blue :deep(.string) { color: #98fb98; }
.theme-blue :deep(.comment) { color: #b0c4de; font-style: italic; }
.theme-blue :deep(.number) { color: #ffa500; font-weight: 600; }
.theme-blue :deep(.function) { color: #87ceeb; font-weight: 600; }
.theme-blue :deep(.variable) { color: #dda0dd; }
.theme-blue :deep(.operator) { color: #ff69b4; }
.theme-blue :deep(.punctuation) { color: #f0f8ff; }

/* 绿色主题 */
.theme-green {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

.theme-green .code-header {
  background: rgba(0, 0, 0, 0.2);
}

.theme-green .code-block {
  background: transparent;
  color: #ffffff;
}

.theme-green :deep(.keyword) { color: #ffeb3b; font-weight: 600; }
.theme-green :deep(.string) { color: #e1f5fe; }
.theme-green :deep(.comment) { color: #c8e6c9; font-style: italic; }
.theme-green :deep(.number) { color: #ff9800; font-weight: 600; }
.theme-green :deep(.function) { color: #81c784; font-weight: 600; }
.theme-green :deep(.variable) { color: #ce93d8; }
.theme-green :deep(.operator) { color: #f48fb1; }
.theme-green :deep(.punctuation) { color: #f1f8e9; }

/* 紫色主题 */
.theme-purple {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.theme-purple .code-header {
  background: rgba(0, 0, 0, 0.2);
}

.theme-purple .code-block {
  background: transparent;
  color: #ffffff;
}

.theme-purple :deep(.keyword) { color: #ff6b9d; font-weight: 600; }
.theme-purple :deep(.string) { color: #c7ecee; }
.theme-purple :deep(.comment) { color: #d1c4e9; font-style: italic; }
.theme-purple :deep(.number) { color: #ffb74d; font-weight: 600; }
.theme-purple :deep(.function) { color: #81c784; font-weight: 600; }
.theme-purple :deep(.variable) { color: #f8bbd9; }
.theme-purple :deep(.operator) { color: #ff8a65; }
.theme-purple :deep(.punctuation) { color: #e8eaf6; }

/* GitHub主题 */
.theme-github {
  background: #ffffff;
  border: 1px solid #e1e4e8;
}

.theme-github .code-header {
  background: #f6f8fa;
  border-bottom-color: #e1e4e8;
}

.theme-github .language-tag {
  background: #0366d6;
  color: white;
}

.theme-github .file-name {
  color: #586069;
}

.theme-github .copy-btn {
  background: #fafbfc;
  border-color: #e1e4e8;
  color: #24292e;
}

.theme-github .code-block {
  background: transparent;
  color: #24292e;
}

.theme-github :deep(.keyword) { color: #d73a49; font-weight: 600; }
.theme-github :deep(.string) { color: #032f62; }
.theme-github :deep(.comment) { color: #6a737d; font-style: italic; }
.theme-github :deep(.number) { color: #005cc5; font-weight: 600; }
.theme-github :deep(.function) { color: #6f42c1; font-weight: 600; }
.theme-github :deep(.variable) { color: #e36209; }
.theme-github :deep(.operator) { color: #d73a49; }
.theme-github :deep(.punctuation) { color: #24292e; }

/* VS Code主题 */
.theme-vscode {
  background: #1e1e1e;
  border: 1px solid #3c3c3c;
}

.theme-vscode .code-header {
  background: #2d2d30;
  border-bottom-color: #3c3c3c;
}

.theme-vscode .code-block {
  background: transparent;
  color: #d4d4d4;
}

.theme-vscode :deep(.keyword) { color: #569cd6; font-weight: 600; }
.theme-vscode :deep(.string) { color: #ce9178; }
.theme-vscode :deep(.comment) { color: #6a9955; font-style: italic; }
.theme-vscode :deep(.number) { color: #b5cea8; font-weight: 600; }
.theme-vscode :deep(.function) { color: #dcdcaa; font-weight: 600; }
.theme-vscode :deep(.variable) { color: #9cdcfe; }
.theme-vscode :deep(.operator) { color: #d4d4d4; }
.theme-vscode :deep(.punctuation) { color: #d4d4d4; }

/* 终端主题 */
.theme-terminal {
  background: #000000;
  border: 2px solid #00ff00;
  font-family: 'Courier New', monospace;
}

.theme-terminal .code-header {
  background: #001100;
  border-bottom-color: #00ff00;
}

.theme-terminal .language-tag {
  background: #00ff00;
  color: #000000;
}

.theme-terminal .file-name {
  color: #00ff00;
}

.theme-terminal .copy-btn {
  background: #001100;
  border-color: #00ff00;
  color: #00ff00;
}

.theme-terminal .code-block {
  background: transparent;
  color: #00ff00;
}

.theme-terminal :deep(.keyword) { color: #ffff00; font-weight: 600; }
.theme-terminal :deep(.string) { color: #00ffff; }
.theme-terminal :deep(.comment) { color: #808080; font-style: italic; }
.theme-terminal :deep(.number) { color: #ff00ff; font-weight: 600; }
.theme-terminal :deep(.function) { color: #ffffff; font-weight: 600; }
.theme-terminal :deep(.variable) { color: #00ff00; }
.theme-terminal :deep(.operator) { color: #ff0000; }
.theme-terminal :deep(.punctuation) { color: #00ff00; }

/* 响应式设计 */
@media (max-width: 768px) {
  .code-header {
    padding: 8px 12px;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .code-info {
    gap: 8px;
  }

  .language-tag {
    font-size: 11px;
    padding: 3px 6px;
  }

  .file-name {
    font-size: 12px;
  }

  .copy-btn {
    font-size: 12px;
    padding: 4px 8px;
  }

  .code-block {
    padding: 16px 12px;
    font-size: 13px;
  }
}
</style>