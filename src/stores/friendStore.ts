import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getFriendsList } from '@/api/controller/HaoYouGuanXiJieKou/getFriendsList.js'
import { postFriendRequestsSend } from '@/api/controller/HaoYouShenQingJieKou/postFriendRequestsSend.js'

/**
 * FriendStore
 * 职责：
 * 1. 缓存当前用户的所有好友 ID（Set 结构，快速查询）
 * 2. 懒加载好友列表（只在首次需要时加载）
 * 3. 添加好友申请后更新申请状态（不立即加入好友集合，需等待对方同意）
 * 4. 提供 markFriend 方法，在外部同意好友申请后可立即更新缓存
 *
 * 使用方式：
 * const friendStore = useFriendStore()
 * await friendStore.ensureLoaded()
 * const isFriend = friendStore.isFriend(userId)
 * await friendStore.addFriendRequest(userId, '你好，想和你成为好友')
 * friendStore.markFriend(userId) // 在确认关系建立后调用
 */

export interface AddFriendResult {
  success: boolean
  message?: string
  code?: number
}

export const useFriendStore = defineStore('friendStore', () => {
  const friendIdsSet = ref<Set<number>>(new Set())
  const loaded = ref(false)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 已发送好友申请的用户 ID（防止重复发送）
  const pendingRequestIds = ref<Set<number>>(new Set())

  // 转为数组用于展示（保持响应性）
  const friendIdList = computed(() => Array.from(friendIdsSet.value))

  /**
   * 懒加载好友列表
   */
  const loadFriends = async (force = false): Promise<void> => {
    if (loading.value) return
    if (loaded.value && !force) return
    loading.value = true
    error.value = null
    try {
      const resp = await getFriendsList()
      if (resp?.data?.code === 0 && Array.isArray(resp.data.data)) {
        friendIdsSet.value = new Set(
          resp.data.data
            .map((u: any) => u?.id)
            .filter((id: any) => typeof id === 'number'),
        )
        loaded.value = true
      } else {
        error.value = resp?.data?.message || '好友列表获取失败'
      }
    } catch (e: any) {
      error.value = e?.message || '网络错误'
    } finally {
      loading.value = false
    }
  }

  /**
   * 确保已加载（对外暴露的简化方法）
   */
  const ensureLoaded = async () => {
    await loadFriends(false)
  }

  /**
   * 判断是否为好友
   */
  const isFriend = (userId: number | null | undefined): boolean => {
    if (!userId) return false
    return friendIdsSet.value.has(userId)
  }

  /**
   * 标记某个用户已经成为好友（例如同意申请后调用）
   */
  const markFriend = (userId: number) => {
    if (typeof userId !== 'number') return
    friendIdsSet.value.add(userId)
  }

  /**
   * 发送好友申请
   * 不会立即把目标用户加入好友集合，等待后端同意后再 markFriend
   */
  const addFriendRequest = async (
    userId: number,
    message: string = '',
  ): Promise<AddFriendResult> => {
    if (isFriend(userId)) {
      return { success: false, message: '已是好友，无需重复添加' }
    }
    if (pendingRequestIds.value.has(userId)) {
      return { success: false, message: '已发送申请，请等待处理' }
    }

    try {
      const resp = await postFriendRequestsSend({
        friendUserId: userId,
        message: message || '你好，想和你成为好友',
      })
      if (resp?.data?.code === 0) {
        pendingRequestIds.value.add(userId)
        return { success: true, message: '好友申请已发送', code: resp.data.code }
      }
      return { success: false, message: resp?.data?.message || '发送失败', code: resp?.data?.code }
    } catch (e: any) {
      return { success: false, message: e?.message || '网络错误' }
    }
  }

  /**
   * 清除某个用户的申请状态（例如对方同意 / 拒绝后）
   */
  const clearPendingRequest = (userId: number) => {
    pendingRequestIds.value.delete(userId)
  }

  /**
   * 接收到“好友关系已建立”事件时调用：
   * - 从 pending 中移除
   * - 加入好友集合
   */
  const confirmFriendship = (userId: number) => {
    clearPendingRequest(userId)
    markFriend(userId)
  }

  return {
    // state
    friendIdList,
    loaded,
    loading,
    error,
    pendingRequestIds,
    // getters / actions
    ensureLoaded,
    loadFriends,
    isFriend,
    markFriend,
    addFriendRequest,
    clearPendingRequest,
    confirmFriendship,
  }
})
