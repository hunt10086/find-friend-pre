<template>
  <div class="theme-selector-wrapper">
    <van-sticky :offset-top="0" z-index="999">
      <div class="theme-selector-bar">
        <div class="theme-selector-container">
          <div class="theme-selector-left">
            <van-icon name="palette-o" class="theme-icon" />
            <span class="theme-label">代码主题</span>
          </div>
          
          <div class="theme-selector-right">
            <van-dropdown-menu>
              <van-dropdown-item 
                v-model="currentTheme" 
                :options="themeOptions" 
                @change="onThemeChange"
                class="theme-dropdown"
              >
                <template #title>
                  <div class="theme-preview">
                    <div class="theme-color" :style="{ background: getThemeColor(currentTheme) }"></div>
                    <span>{{ getThemeName(currentTheme) }}</span>
                    <van-icon name="arrow-down" />
                  </div>
                </template>
              </van-dropdown-item>
            </van-dropdown-menu>
          </div>
        </div>
      </div>
    </van-sticky>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

interface Props {
  defaultTheme?: string
}

const props = withDefaults(defineProps<Props>(), {
  defaultTheme: 'dark'
})

const emit = defineEmits<{
  themeChange: [theme: string]
}>()

const currentTheme = ref(props.defaultTheme)

// 主题选项
const themeOptions = [
  { text: '🌙 暗黑主题', value: 'dark' },
  { text: '☀️ 明亮主题', value: 'light' },
  { text: '🔵 蓝色主题', value: 'blue' },
  { text: '🟢 绿色主题', value: 'green' },
  { text: '🟣 紫色主题', value: 'purple' },
  { text: '🐙 GitHub主题', value: 'github' },
  { text: '💻 VS Code主题', value: 'vscode' },
  { text: '⚡ 终端主题', value: 'terminal' }
]

// 获取主题颜色
const getThemeColor = (theme: string) => {
  const colors = {
    dark: 'linear-gradient(135deg, #2c3e50, #34495e)',
    light: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
    blue: 'linear-gradient(135deg, #667eea, #764ba2)',
    green: 'linear-gradient(135deg, #11998e, #38ef7d)',
    purple: 'linear-gradient(135deg, #667eea, #764ba2)',
    github: '#ffffff',
    vscode: '#1e1e1e',
    terminal: '#000000'
  }
  return colors[theme as keyof typeof colors] || colors.dark
}

// 获取主题名称
const getThemeName = (theme: string) => {
  const option = themeOptions.find(opt => opt.value === theme)
  return option ? option.text : '🌙 暗黑主题'
}

// 主题切换
const onThemeChange = (value: string) => {
  currentTheme.value = value
  emit('themeChange', value)
  
  // 更新全局CSS变量
  updateGlobalTheme(value)
  
  // 保存到本地存储
  localStorage.setItem('blog-code-theme', value)
}

// 更新全局主题
const updateGlobalTheme = (theme: string) => {
  // 移除所有主题类
  document.body.classList.remove('theme-dark', 'theme-light', 'theme-blue', 'theme-green', 'theme-purple', 'theme-github', 'theme-vscode', 'theme-terminal')
  
  // 添加新主题类
  document.body.classList.add(`theme-${theme}`)
  
  // 更新所有代码块的主题
  const codeContainers = document.querySelectorAll('.code-container')
  codeContainers.forEach(container => {
    container.className = container.className.replace(/theme-\w+/, `theme-${theme}`)
  })
}

// 组件挂载时恢复主题
onMounted(() => {
  const savedTheme = localStorage.getItem('blog-code-theme')
  if (savedTheme && themeOptions.some(option => option.value === savedTheme)) {
    currentTheme.value = savedTheme
    updateGlobalTheme(savedTheme)
  } else {
    updateGlobalTheme(currentTheme.value)
  }
})

// 监听主题变化
watch(currentTheme, (newTheme) => {
  updateGlobalTheme(newTheme)
}, { immediate: true })
</script>

<style scoped>
.theme-selector-wrapper {
  margin-bottom: 16px;
}

.theme-selector-bar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #e4e6ea;
  padding: 12px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.theme-selector-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.theme-selector-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.theme-icon {
  font-size: 18px;
  color: #667eea;
}

.theme-label {
  font-size: 14px;
  font-weight: 600;
  color: #252933;
}

.theme-selector-right {
  display: flex;
  align-items: center;
}

.theme-preview {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 8px;
  background: #f7f8fa;
  border: 1px solid #e4e6ea;
  transition: all 0.2s ease;
  min-width: 140px;
}

.theme-preview:hover {
  background: #e9ecef;
  border-color: #667eea;
}

.theme-color {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.theme-preview span {
  font-size: 13px;
  font-weight: 500;
  color: #252933;
  flex: 1;
}

/* 全局主题样式 */
:global(.theme-dark) {
  --code-bg: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  --code-color: #ecf0f1;
  --code-keyword: #ff6b6b;
  --code-string: #4ecdc4;
  --code-comment: #95a5a6;
  --code-number: #f39c12;
  --code-function: #74b9ff;
}

:global(.theme-light) {
  --code-bg: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  --code-color: #212529;
  --code-keyword: #d73a49;
  --code-string: #032f62;
  --code-comment: #6a737d;
  --code-number: #005cc5;
  --code-function: #6f42c1;
}

:global(.theme-blue) {
  --code-bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --code-color: #ffffff;
  --code-keyword: #ffd700;
  --code-string: #98fb98;
  --code-comment: #b0c4de;
  --code-number: #ffa500;
  --code-function: #87ceeb;
}

:global(.theme-green) {
  --code-bg: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  --code-color: #ffffff;
  --code-keyword: #ffeb3b;
  --code-string: #e1f5fe;
  --code-comment: #c8e6c9;
  --code-number: #ff9800;
  --code-function: #81c784;
}

:global(.theme-purple) {
  --code-bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --code-color: #ffffff;
  --code-keyword: #ff6b9d;
  --code-string: #c7ecee;
  --code-comment: #d1c4e9;
  --code-number: #ffb74d;
  --code-function: #81c784;
}

:global(.theme-github) {
  --code-bg: #ffffff;
  --code-color: #24292e;
  --code-keyword: #d73a49;
  --code-string: #032f62;
  --code-comment: #6a737d;
  --code-number: #005cc5;
  --code-function: #6f42c1;
}

:global(.theme-vscode) {
  --code-bg: #1e1e1e;
  --code-color: #d4d4d4;
  --code-keyword: #569cd6;
  --code-string: #ce9178;
  --code-comment: #6a9955;
  --code-number: #b5cea8;
  --code-function: #dcdcaa;
}

:global(.theme-terminal) {
  --code-bg: #000000;
  --code-color: #00ff00;
  --code-keyword: #ffff00;
  --code-string: #00ffff;
  --code-comment: #808080;
  --code-number: #ff00ff;
  --code-function: #ffffff;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .theme-selector-container {
    padding: 0 12px;
  }

  .theme-label {
    display: none;
  }

  .theme-preview {
    min-width: 120px;
    padding: 4px 8px;
  }

  .theme-preview span {
    font-size: 12px;
  }

  .theme-color {
    width: 14px;
    height: 14px;
  }
}

@media (max-width: 480px) {
  .theme-selector-container {
    padding: 0 8px;
  }

  .theme-preview {
    min-width: 100px;
  }

  .theme-preview span {
    font-size: 11px;
  }
}
</style>