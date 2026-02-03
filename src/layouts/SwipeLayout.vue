<template>
  <div class="swipe-layout">
    <!-- 头部导航栏 -->
    <van-nav-bar
      :title="pageTitle"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
      v-if="showNavBar"
    >
      <template #right>
        <van-icon name="search" size="18" />
      </template>
    </van-nav-bar>

    <!-- 公告栏 -->
    <van-notice-bar
      left-icon="volume-o"
      scrollable
      text="交友需谨慎，以防上当受骗,希望你能找到合适的伙伴"
      v-if="showNavBar"
    />

    <!-- 滑动容器 -->
    <van-swipe
      ref="swipeRef"
      :initial-swipe="currentIndex"
      :show-indicators="false"
      :touchable="true"
      :loop="false"
      :duration="300"
      @change="onSwipeChange"
      @drag-start="onDragStart"
      @drag-end="onDragEnd"
      class="swipe-container"
    >
      <van-swipe-item v-for="(page, index) in pages" :key="page.path" class="swipe-item">
        <div class="page-content" :class="{ 'page-transitioning': isTransitioning }">
          <component
            :is="page.component"
            v-if="shouldRenderPage(index)"
            :class="{
              'active-page': index === currentIndex,
              'prev-page': index === currentIndex - 1,
              'next-page': index === currentIndex + 1,
            }"
          />
        </div>
      </van-swipe-item>
    </van-swipe>

    <!-- 底部标签栏 -->
    <van-tabbar v-model="activeTab" @change="onTabChange" class="footer-tabbar" v-if="showNavBar">
      <van-tabbar-item
        v-for="(page, index) in pages"
        :key="page.path"
        :icon="page.icon"
        :name="index"
      >
        {{ page.title }}
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, defineAsyncComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast, showFailToast, showSuccessToast } from 'vant'
import { api } from '@/api/apiClient'

const route = useRoute()
const router = useRouter()

// 动态导入页面组件
const pages = [
  {
    path: '/',
    title: '主页',
    icon: 'home-o',
    component: defineAsyncComponent(() => import('@/pages/home/Index.vue')),
  },
  {
    path: '/blog',
    title: '分享',
    icon: 'description',
    component: defineAsyncComponent(() => import('@/pages/blog/BlogPage.vue')),
  },
  {
    path: '/team',
    title: '队伍大厅',
    icon: 'search',
    component: defineAsyncComponent(() => import('@/pages/team/Team.vue')),
  },
  {
    path: '/talk',
    title: '交流',
    icon: 'envelop-o',
    component: defineAsyncComponent(() => import('@/pages/chat/Talk.vue')),
  },
  {
    path: '/Person',
    title: '个人',
    icon: 'user-circle-o',
    component: defineAsyncComponent(() => import('@/pages/user/I.vue')),
  },
]

const swipeRef = ref()
const currentIndex = ref(0)
const activeTab = ref(0)
const isTransitioning = ref(false)

// 计算当前页面标题
const pageTitle = computed(() => {
  return pages[currentIndex.value]?.title || '寻找志同道合的伙伴'
})

// 是否显示导航栏
const showNavBar = computed(() => {
  return route.meta.showNavBar !== false
})

// 性能优化：只渲染当前页面和相邻页面
const shouldRenderPage = (index: number) => {
  return Math.abs(index - currentIndex.value) <= 1
}

// 根据当前路由设置初始页面
const setInitialPage = () => {
  const currentPath = route.path
  const pageIndex = pages.findIndex((page) => page.path === currentPath)
  if (pageIndex !== -1) {
    currentIndex.value = pageIndex
    activeTab.value = pageIndex
  }
}

// 滑动开始事件
const onDragStart = () => {
  isTransitioning.value = true
}

// 滑动结束事件
const onDragEnd = () => {
  setTimeout(() => {
    isTransitioning.value = false
  }, 300)
}

// 滑动切换事件
const onSwipeChange = (index: number) => {
  currentIndex.value = index
  activeTab.value = index

  // 更新路由但不触发页面重新加载
  const targetPage = pages[index]
  if (targetPage && route.path !== targetPage.path) {
    router.replace(targetPage.path)
  }
}

// 标签栏切换事件
const onTabChange = (index: number) => {
  currentIndex.value = index
  activeTab.value = index

  // 滑动到对应页面
  if (swipeRef.value) {
    swipeRef.value.swipeTo(index)
  }

  // 更新路由
  const targetPage = pages[index]
  if (targetPage && route.path !== targetPage.path) {
    router.replace(targetPage.path)
  }
}

// 导航栏事件
const onClickLeft = () => {
  router.back()
}

const onClickRight = () => {
  router.push('/search')
}

// 监听路由变化
watch(
  () => route.path,
  (newPath) => {
    const pageIndex = pages.findIndex((page) => page.path === newPath)
    if (pageIndex !== -1 && pageIndex !== currentIndex.value) {
      currentIndex.value = pageIndex
      activeTab.value = pageIndex
      if (swipeRef.value) {
        swipeRef.value.swipeTo(pageIndex)
      }
    }
  },
)

// 用户登录检查
const checkUserLogin = async () => {
  try {
    const res = await api.user.getCurrentUser()
    if (res.data.code === 40100) {
      await router.push('/user/login')
      showFailToast('请先登录')
    } else {
      showSuccessToast('登录成功')
    }
  } catch (error) {
    // 登录检查失败，静默处理
  }
}

onMounted(() => {
  setInitialPage()
  checkUserLogin()
})
</script>

<style scoped>
.swipe-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.swipe-container {
  flex: 1;
  height: 100%;
}

.swipe-item {
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  position: relative; /* 确保fixed定位的子元素能正确显示 */
}

.page-content {
  height: 100%;
  padding-bottom: 60px; /* 为底部标签栏留出空间 */
}

.active-page {
  opacity: 1;
  transform: translateX(0);
  transition: all 0.3s ease;
}

.prev-page,
.next-page {
  opacity: 0.8;
  transition: all 0.3s ease;
}

.page-transitioning {
  pointer-events: none;
}

.footer-tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 50px;
  background-color: #fff;
  z-index: 9999;
  border-top: 1px solid #ebedf0;
}

/* 确保页面内容不被底部标签栏遮挡 */
:deep(.van-swipe-item) {
  padding-bottom: 0;
}

/* 滑动动画优化 */
.swipe-container :deep(.van-swipe__track) {
  transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* 移动端优化 */
@media (max-width: 768px) {
  .swipe-item {
    -webkit-overflow-scrolling: touch;
    overflow-scrolling: touch;
  }
}
</style>
