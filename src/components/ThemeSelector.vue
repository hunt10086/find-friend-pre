<template>
  <div class="theme-selector">
    <h3>选择聊天主题</h3>
    <div class="theme-options">
      <div
        v-for="theme in themes"
        :key="theme.key"
        :class="['theme-option', { active: currentTheme === theme.key }]"
        :style="getThemeStyle(theme)"
        @click="selectTheme(theme.key)"
      >
        <div class="theme-preview">
          <div class="self-bubble" :style="{ backgroundColor: theme.selfBubbleBg }"></div>
          <div class="other-bubble" :style="{ backgroundColor: theme.otherBubbleBg }"></div>
        </div>
        <span class="theme-name">{{ theme.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 定义主题
const themes = [
  {
    key: 'default',
    name: '清新蓝',
    primaryColor: '#1989fa',
    selfBubbleBg: '#dcf8c6',
    otherBubbleBg: '#ffffff'
  },
  {
    key: 'purple',
    name: '优雅紫',
    primaryColor: '#7232dd',
    selfBubbleBg: '#e6d4fa',
    otherBubbleBg: '#ffffff'
  },
  {
    key: 'green',
    name: '自然绿',
    primaryColor: '#07c160',
    selfBubbleBg: '#c6f8dc',
    otherBubbleBg: '#ffffff'
  },
  {
    key: 'pink',
    name: '温柔粉',
    primaryColor: '#ff6b9d',
    selfBubbleBg: '#fad4e6',
    otherBubbleBg: '#ffffff'
  }
];

// 当前选中的主题
const currentTheme = ref('default');

// 获取主题样式
const getThemeStyle = (theme: any) => {
  return {
    '--primary-color': theme.primaryColor,
    '--self-bubble-bg': theme.selfBubbleBg,
    '--other-bubble-bg': theme.otherBubbleBg
  };
};

// 定义 emits
const emit = defineEmits<{
  'theme-change': [themeKey: string];
}>();

// 选择主题
const selectTheme = (themeKey: string) => {
  currentTheme.value = themeKey;
  // 触发自定义事件，通知父组件更新主题
  emit('theme-change', themeKey);
};
</script>

<style scoped>
.theme-selector {
  padding: 16px;
  background: #f7f8fa;
  border-radius: 12px;
  margin-bottom: 16px;
}

.theme-selector h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #323233;
  text-align: center;
}

.theme-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.theme-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.theme-option:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.theme-option.active {
  border-color: var(--primary-color);
  background: rgba(var(--primary-color-rgb), 0.05);
}

.theme-preview {
  display: flex;
  gap: 6px;
  align-items: center;
}

.self-bubble {
  width: 24px;
  height: 20px;
  border-radius: 12px 4px 12px 12px;
  background: var(--self-bubble-bg, #dcf8c6);
}

.other-bubble {
  width: 24px;
  height: 20px;
  border-radius: 4px 12px 12px 12px;
  background: var(--other-bubble-bg, #ffffff);
  border: 1px solid #ebedf0;
}

.theme-name {
  font-size: 13px;
  color: #666;
  font-weight: 500;
}

@media (max-width: 480px) {
  .theme-options {
    grid-template-columns: repeat(2, 1fr);
  }

  .theme-name {
    font-size: 12px;
  }
}
</style>