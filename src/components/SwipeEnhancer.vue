<template>
  <div 
    ref="containerRef" 
    class="swipe-enhancer"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    <slot />
    
    <!-- 滑动提示 -->
    <transition name="fade">
      <div v-if="showHint" class="swipe-hint" :class="hintDirection">
        <van-icon :name="hintIcon" size="24" />
        <span>{{ hintText }}</span>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

interface Props {
  leftAction?: () => void | string  // 左滑动作或路由
  rightAction?: () => void | string // 右滑动作或路由
  threshold?: number                // 滑动阈值
  showHints?: boolean              // 是否显示滑动提示
}

const props = withDefaults(defineProps<Props>(), {
  threshold: 80,
  showHints: true
})

const router = useRouter()
const containerRef = ref<HTMLElement>()

// 触摸状态
const startX = ref(0)
const startY = ref(0)
const currentX = ref(0)
const isTracking = ref(false)
const showHint = ref(false)
const hintDirection = ref('')

// 计算提示信息
const hintIcon = computed(() => {
  return hintDirection.value === 'left' ? 'arrow-left' : 'arrow'
})

const hintText = computed(() => {
  if (hintDirection.value === 'left') {
    return typeof props.leftAction === 'string' ? '返回上页' : '左滑操作'
  } else {
    return typeof props.rightAction === 'string' ? '前往下页' : '右滑操作'
  }
})

// 触摸开始
const handleTouchStart = (e: TouchEvent) => {
  const touch = e.touches[0]
  startX.value = touch.clientX
  startY.value = touch.clientY
  currentX.value = touch.clientX
  isTracking.value = true
}

// 触摸移动
const handleTouchMove = (e: TouchEvent) => {
  if (!isTracking.value) return
  
  const touch = e.touches[0]
  currentX.value = touch.clientX
  
  const deltaX = currentX.value - startX.value
  const deltaY = Math.abs(touch.clientY - startY.value)
  
  // 只处理水平滑动
  if (Math.abs(deltaX) > deltaY && Math.abs(deltaX) > 20) {
    if (props.showHints) {
      showHint.value = true
      hintDirection.value = deltaX > 0 ? 'right' : 'left'
    }
    
    // 阻止垂直滚动
    e.preventDefault()
  }
}

// 触摸结束
const handleTouchEnd = (e: TouchEvent) => {
  if (!isTracking.value) return
  
  const deltaX = currentX.value - startX.value
  const deltaY = Math.abs(e.changedTouches[0].clientY - startY.value)
  
  // 隐藏提示
  showHint.value = false
  
  // 判断是否为有效滑动
  if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > props.threshold) {
    if (deltaX > 0 && props.rightAction) {
      // 右滑
      executeAction(props.rightAction)
    } else if (deltaX < 0 && props.leftAction) {
      // 左滑
      executeAction(props.leftAction)
    }
  }
  
  isTracking.value = false
}

// 执行动作
const executeAction = (action: (() => void) | string) => {
  if (typeof action === 'string') {
    router.push(action)
  } else {
    action()
  }
}
</script>

<style scoped>
.swipe-enhancer {
  position: relative;
  height: 100%;
  overflow: hidden;
}

.swipe-hint {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 12px 16px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 1000;
  backdrop-filter: blur(10px);
  font-size: 14px;
  transition: all 0.3s ease;
}

.swipe-hint.left {
  left: 20px;
}

.swipe-hint.right {
  right: 20px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>