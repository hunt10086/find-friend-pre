import { ref, onMounted, onUnmounted } from 'vue'

export interface SwipeGestureOptions {
  threshold?: number // 滑动阈值，默认50px
  velocity?: number // 速度阈值，默认0.3
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
}

export function useSwipeGesture(element: HTMLElement | null, options: SwipeGestureOptions = {}) {
  const {
    threshold = 50,
    velocity = 0.3,
    onSwipeLeft,
    onSwipeRight
  } = options

  const startX = ref(0)
  const startY = ref(0)
  const startTime = ref(0)
  const isTracking = ref(false)

  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0]
    startX.value = touch.clientX
    startY.value = touch.clientY
    startTime.value = Date.now()
    isTracking.value = true
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (!isTracking.value) return
    
    // 防止默认滚动行为在某些情况下
    const touch = e.touches[0]
    const deltaX = Math.abs(touch.clientX - startX.value)
    const deltaY = Math.abs(touch.clientY - startY.value)
    
    // 如果水平滑动距离大于垂直滑动距离，阻止默认行为
    if (deltaX > deltaY && deltaX > 10) {
      e.preventDefault()
    }
  }

  const handleTouchEnd = (e: TouchEvent) => {
    if (!isTracking.value) return
    
    const touch = e.changedTouches[0]
    const endX = touch.clientX
    const endY = touch.clientY
    const endTime = Date.now()
    
    const deltaX = endX - startX.value
    const deltaY = endY - startY.value
    const deltaTime = endTime - startTime.value
    
    // 计算滑动距离和速度
    const distance = Math.abs(deltaX)
    const velocityX = distance / deltaTime
    
    // 判断是否为有效的水平滑动
    if (Math.abs(deltaY) < Math.abs(deltaX) && 
        (distance > threshold || velocityX > velocity)) {
      
      if (deltaX > 0) {
        // 向右滑动
        onSwipeRight?.()
      } else {
        // 向左滑动
        onSwipeLeft?.()
      }
    }
    
    isTracking.value = false
  }

  const addEventListeners = () => {
    if (!element) return
    
    element.addEventListener('touchstart', handleTouchStart, { passive: false })
    element.addEventListener('touchmove', handleTouchMove, { passive: false })
    element.addEventListener('touchend', handleTouchEnd, { passive: true })
  }

  const removeEventListeners = () => {
    if (!element) return
    
    element.removeEventListener('touchstart', handleTouchStart)
    element.removeEventListener('touchmove', handleTouchMove)
    element.removeEventListener('touchend', handleTouchEnd)
  }

  onMounted(() => {
    addEventListeners()
  })

  onUnmounted(() => {
    removeEventListeners()
  })

  return {
    addEventListeners,
    removeEventListeners
  }
}