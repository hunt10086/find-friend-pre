<template>
  <div id="app">
    <!-- 根据 meta 控制是否显示全局导航栏 -->
    <header-nav v-if="$route.meta.showNavBar" />
    <!-- 使用 keep-alive 缓存指定页面 -->
    <keep-alive>
      <router-view id="router" v-if="$route.meta.keepAlive" />
    </keep-alive>
    <!-- 非缓存页面直接渲染 -->
    <router-view id="router" v-if="!$route.meta.keepAlive" />
  </div>
</template>

<script>
import HeaderNav from '@/layouts/BasicLayout.vue';

export default {
  components: {
    HeaderNav
  }
};
</script>
<style scoped>
#app {
  margin: 0;
  padding: 0;
}
#router{
  padding-bottom: 0px;
}
</style>
