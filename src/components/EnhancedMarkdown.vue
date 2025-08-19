<template>
  <div class="enhanced-markdown">
    <div v-for="(block, index) in parsedBlocks" :key="index">
      <!-- 代码块 -->
      <div v-if="block.type === 'code'" class="code-highlight-wrapper">
        <div class="code-container">
          <div class="code-header">
            <div class="code-actions">
              <button class="copy-btn" @click="copyCode(block.code)">
                <span class="copy-icon">📋</span>
                <span class="copy-text">复制代码</span>
              </button>
            </div>
          </div>
          <pre class="code-block"><code>{{ block.code }}</code></pre>
        </div>
      </div>
      <!-- 普通内容 -->
      <div v-else v-html="block.content" class="markdown-content"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { showSuccessToast, showFailToast } from 'vant'

interface Props {
  source: string
}

const props = defineProps<Props>()

// 解析Markdown内容为块
const parsedBlocks = computed(() => {
  const content = props.source || ''
  const blocks: Array<{type: string, content?: string, code?: string}> = []
  
  // 分割代码块和普通内容
  const parts = content.split(/(```[\s\S]*?```)/g)
  
  parts.forEach(part => {
    if (part.startsWith('```')) {
      // 代码块
      const match = part.match(/```[\s\S]*?\n([\s\S]*?)```/)
      if (match) {
        const code = match[1].trim()
        blocks.push({
          type: 'code',
          code
        })
      }
    } else if (part.trim()) {
      // 普通内容
      let processedContent = part
      
      // 处理行内代码
      processedContent = processedContent.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
      
      // 处理标题
      processedContent = processedContent.replace(/^### (.*$)/gim, '<h3 class="markdown-h3">$1</h3>')
      processedContent = processedContent.replace(/^## (.*$)/gim, '<h2 class="markdown-h2">$1</h2>')
      processedContent = processedContent.replace(/^# (.*$)/gim, '<h1 class="markdown-h1">$1</h1>')
      
      // 处理粗体和斜体
      processedContent = processedContent.replace(/\*\*(.*?)\*\*/g, '<strong class="markdown-bold">$1</strong>')
      processedContent = processedContent.replace(/\*(.*?)\*/g, '<em class="markdown-italic">$1</em>')
      
      // 处理链接
      processedContent = processedContent.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="markdown-link" target="_blank" rel="noopener noreferrer">$1</a>')
      
      // 处理图片
      processedContent = processedContent.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="markdown-image" />')
      
      // 处理引用
      processedContent = processedContent.replace(/^> (.*$)/gim, '<blockquote class="markdown-blockquote">$1</blockquote>')
      
      // 处理无序列表
      processedContent = processedContent.replace(/^\* (.*$)/gim, '<li class="markdown-li">$1</li>')
      processedContent = processedContent.replace(/(<li class="markdown-li">.*<\/li>)/gs, '<ul class="markdown-ul">$1</ul>')
      
      // 处理有序列表
      processedContent = processedContent.replace(/^\d+\. (.*$)/gim, '<li class="markdown-oli">$1</li>')
      processedContent = processedContent.replace(/(<li class="markdown-oli">.*<\/li>)/gs, '<ol class="markdown-ol">$1</ol>')
      
      // 处理水平线
      processedContent = processedContent.replace(/^---$/gim, '<hr class="markdown-hr" />')
      
      // 处理段落
      processedContent = processedContent.replace(/\n\n/g, '</p><p class="markdown-p">')
      processedContent = '<p class="markdown-p">' + processedContent + '</p>'
      
      // 清理空段落
      processedContent = processedContent.replace(/<p class="markdown-p"><\/p>/g, '')
      
      blocks.push({
        type: 'content',
        content: processedContent
      })
    }
  })
  
  return blocks
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

</script>

<style scoped>
.enhanced-markdown {
  font-size: 16px;
  line-height: 1.8;
  color: #252933;
  word-break: break-word;
}

/* Markdown元素样式 */
.enhanced-markdown :deep(.markdown-h1) {
  font-size: 36px;
  color: #0066cc;
  border-bottom: 3px solid #e6f3ff;
  padding-bottom: 12px;
  margin: 32px 0 20px 0;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.enhanced-markdown :deep(.markdown-h2) {
  font-size: 30px;
  color: #0080ff;
  border-bottom: 2px solid #f0f8ff;
  padding-bottom: 10px;
  margin: 28px 0 18px 0;
  font-weight: 700;
}

.enhanced-markdown :deep(.markdown-h3) {
  font-size: 26px;
  color: #1a73e8;
  margin: 24px 0 16px 0;
  font-weight: 700;
}

.enhanced-markdown :deep(.markdown-p) {
  margin-bottom: 16px;
  text-align: justify;
  line-height: 1.8;
}

.enhanced-markdown :deep(.inline-code) {
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

.enhanced-markdown :deep(.markdown-bold) {
  font-weight: 700;
  color: #1a1a1a;
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.enhanced-markdown :deep(.markdown-italic) {
  font-style: italic;
  color: #4e5969;
  background: linear-gradient(135deg, #a29bfe, #6c5ce7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.enhanced-markdown :deep(.markdown-link) {
  color: #ff6b6b;
  text-decoration: none;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 500;
}

.enhanced-markdown :deep(.markdown-link:hover) {
  border-bottom-color: #ff6b6b;
  transform: translateY(-1px);
}

.enhanced-markdown :deep(.markdown-image) {
  max-width: 100%;
  height: auto;
  border-radius: 12px;
  margin: 20px 0;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
}

.enhanced-markdown :deep(.markdown-image:hover) {
  transform: scale(1.02);
}

.enhanced-markdown :deep(.markdown-blockquote) {
  border-left: 4px solid #ff6b6b;
  margin: 20px 0;
  padding: 16px 24px;
  background: linear-gradient(135deg, #f7f8fa, #e9ecef);
  color: #4e5969;
  font-style: italic;
  border-radius: 0 8px 8px 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
}

.enhanced-markdown :deep(.markdown-blockquote::before) {
  content: '"';
  font-size: 48px;
  color: #ff6b6b;
  position: absolute;
  top: -10px;
  left: 10px;
  opacity: 0.3;
}

.enhanced-markdown :deep(.markdown-ul),
.enhanced-markdown :deep(.markdown-ol) {
  margin: 16px 0;
  padding-left: 32px;
}

.enhanced-markdown :deep(.markdown-li),
.enhanced-markdown :deep(.markdown-oli) {
  margin: 8px 0;
  line-height: 1.6;
  position: relative;
}

.enhanced-markdown :deep(.markdown-ul .markdown-li::before) {
  content: '●';
  color: #ff6b6b;
  font-weight: bold;
  position: absolute;
  left: -20px;
}

.enhanced-markdown :deep(.markdown-hr) {
  border: none;
  height: 3px;
  background: linear-gradient(90deg, #ff6b6b, #ee5a24, #fdcb6e, #6c5ce7, #74b9ff);
  margin: 32px 0;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 代码高亮容器样式 */
.enhanced-markdown :deep(.code-highlight-wrapper) {
  margin: 24px 0;
}

.enhanced-markdown :deep(.code-container) {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
}

.enhanced-markdown :deep(.code-container:hover) {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
}

.enhanced-markdown :deep(.code-header) {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 12px 16px;
  background: #2c3e50;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}


.enhanced-markdown :deep(.copy-btn) {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.enhanced-markdown :deep(.copy-btn:hover) {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.enhanced-markdown :deep(.copy-btn:disabled) {
  opacity: 0.6;
  cursor: not-allowed;
}

.enhanced-markdown :deep(.copy-icon) {
  font-size: 14px;
}

.enhanced-markdown :deep(.copy-text) {
  font-weight: 500;
}

.enhanced-markdown :deep(.code-block) {
  margin: 0;
  padding: 20px;
  overflow-x: auto;
  line-height: 1.6;
  font-family: 'Fira Code', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  background: transparent;
  color: #ecf0f1;
}

.enhanced-markdown :deep(.code-block code) {
  background: none;
  padding: 0;
  border: none;
  font-size: inherit;
  font-family: inherit;
}


/* 响应式设计 */
@media (max-width: 768px) {
  .enhanced-markdown {
    font-size: 15px;
  }

  .enhanced-markdown :deep(.markdown-h1) {
    font-size: 28px;
    margin: 24px 0 16px 0;
  }

  .enhanced-markdown :deep(.markdown-h2) {
    font-size: 24px;
    margin: 20px 0 14px 0;
  }

  .enhanced-markdown :deep(.markdown-h3) {
    font-size: 22px;
    margin: 18px 0 12px 0;
  }

  .enhanced-markdown :deep(.inline-code) {
    font-size: 13px;
    padding: 3px 6px;
  }

  .enhanced-markdown :deep(.code-header) {
    padding: 8px 12px;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .enhanced-markdown :deep(.code-block) {
    padding: 16px 12px;
    font-size: 13px;
  }

  .enhanced-markdown :deep(.copy-btn) {
    font-size: 11px;
    padding: 4px 8px;
  }

}
</style>