<template id="app">
  <div id="app" :class="{ 'container': shouldUseContainer }">
    <!-- 根据 meta 控制是否显示全局导航栏 -->
    <header-nav v-if="$route.meta.showNavBar" />
    <!-- 使用 keep-alive 缓存指定页面 -->
    <div id="router" v-if="$route.meta.keepAlive">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </div>
    <!-- 非缓存页面直接渲染 -->
    <div id="router" v-if="!$route.meta.keepAlive">
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </div>
  </div>
</template>

<script>
import HeaderNav from '@/layouts/BasicLayout.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

export default {
  components: {
    HeaderNav
  },
  setup() {
    const route = useRoute();
    
    // 定义不需要容器样式的全屏页面
    const fullScreenPages = ['/user/login', '/user/register'];
    
    const shouldUseContainer = computed(() => {
      return !fullScreenPages.includes(route.path);
    });
    
    return {
      shouldUseContainer
    };
  }
};
</script>
<style scoped>
/* 只为容器页面设置样式 */
#app.container {
  margin: 0;
  padding: 0;
}

#router{
  padding-bottom: 70px; /* 为底部导航栏预留空间 */
  min-height: calc(100vh - 120px); /* 减去顶部导航栏和底部导航栏的高度 */
}

/* 确保全屏页面没有任何边距和填充 */
#app:not(.container) {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
</style>
