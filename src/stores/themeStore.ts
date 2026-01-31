import { defineStore } from 'pinia';

export const useThemeStore = defineStore('theme', {
  state: () => ({
    currentTheme: localStorage.getItem('chat-theme') || 'default',
  }),

  getters: {
    themeConfig: (state) => {
      const themes: Record<string, any> = {
        default: {
          key: 'default',
          name: '清新蓝',
          primaryColor: '#1989fa',
          selfBubbleBg: '#dcf8c6',
          otherBubbleBg: '#ffffff'
        },
        purple: {
          key: 'purple',
          name: '优雅紫',
          primaryColor: '#7232dd',
          selfBubbleBg: '#e6d4fa',
          otherBubbleBg: '#ffffff'
        },
        green: {
          key: 'green',
          name: '自然绿',
          primaryColor: '#07c160',
          selfBubbleBg: '#c6f8dc',
          otherBubbleBg: '#ffffff'
        },
        pink: {
          key: 'pink',
          name: '温柔粉',
          primaryColor: '#ff6b9d',
          selfBubbleBg: '#fad4e6',
          otherBubbleBg: '#ffffff'
        }
      };

      return themes[state.currentTheme] || themes.default;
    }
  },

  actions: {
    setTheme(theme: string) {
      this.currentTheme = theme;
      localStorage.setItem('chat-theme', theme);
      // 应用主题到文档根元素
      document.documentElement.setAttribute('data-theme', theme);
    },

    initializeTheme() {
      // 从localStorage获取主题设置并应用
      const savedTheme = localStorage.getItem('chat-theme') || 'default';
      this.setTheme(savedTheme);
    }
  }
});