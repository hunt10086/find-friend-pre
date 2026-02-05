<template>
  <!-- Loading状态 -->
  <van-loading v-if="loading" type="spinner" color="#003366" size="24px"> 加载中... </van-loading>

  <!-- 正常内容 -->
  <div v-else class="team-members-container">
    <!-- 管理员操作区 -->
    <div class="admin-actions" v-if="captain === userId">
      <van-button
        type="primary"
        round
        icon="edit"
        @click="updateTeam(teamId)"
        class="update-team-btn"
      >
        更新队伍
      </van-button>
    </div>

    <!-- 队伍成员列表 -->
    <div class="members-cards-container">
      <div
        class="member-card"
        v-for="(user, index) in userList"
        :key="user.id"
        :style="{ animationDelay: `${index * 0.1}s` }"
      >
        <div class="member-header">
          <div class="member-avatar" @click="viewProfile(user)">
            <img
              :src="user.avatarUrl || '/ava.jpg'"
              :alt="user.userName"
              @error="handleImageError"
            />
          </div>
          <div class="member-info">
            <h3 class="member-name">{{ user.userName }}</h3>
            <div class="member-role">
              <template v-if="captain === user.id">
                <van-tag type="warning">队长</van-tag>
                <span class="role-text">队伍管理员</span>
              </template>
              <template v-else>
                <van-tag type="primary">成员</van-tag>
                <span class="role-text">队伍成员</span>
              </template>
            </div>
          </div>
        </div>

        <div class="member-content">
          <div class="member-tags" v-if="user.tags && user.tags.length">
            <van-tag
              class="member-tag"
              plain
              type="primary"
              v-for="tag in getDisplayTags(user)"
              :key="tag"
            >
              {{ tag }}
            </van-tag>
            <van-button
              v-if="user.tags.length > 6"
              class="expand-tags-btn"
              size="mini"
              plain
              @click="toggleTagsExpand(user)"
            >
              {{ user.tagsExpanded ? '收起' : `+${user.tags.length - 6}` }}
            </van-button>
          </div>
        </div>

        <div class="member-actions" v-if="captain === userId && user.id !== userId">
          <van-button type="warning" size="small" round icon="cross" @click="removeMember(user)">
            移除成员
          </van-button>
          <van-button
            v-if="isFriend(user.id)"
            type="primary"
            size="small"
            round
            icon="chat-o"
            @click="sendMessage(user)"
          >
            发送消息
          </van-button>
          <van-button
            v-else
            type="primary"
            size="small"
            round
            icon="friends-o"
            @click="viewProfile(user)"
          >
            添加好友
          </van-button>
        </div>

        <div class="member-actions" v-else-if="user.id !== userId">
          <van-button
            v-if="isFriend(user.id)"
            type="primary"
            size="small"
            round
            icon="chat-o"
            @click="sendMessage(user)"
          >
            发送消息
          </van-button>
          <van-button
            v-else
            type="primary"
            size="small"
            round
            icon="friends-o"
            @click="viewProfile(user)"
          >
            添加好友
          </van-button>
        </div>
      </div>
    </div>

    <div id="blank">
      <van-divider />
    </div>

    <!-- 用户资料模态框 -->
    <UserProfileModal v-model="showProfileModal" :userId="selectedUserId" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, onActivated } from 'vue'
import { api, type UserVO } from '@/api/apiClient'
import { useRoute } from 'vue-router'
import router from '@/config/router.ts'
import { showSuccessToast, showFailToast, showConfirmDialog } from 'vant'
import UserProfileModal from '@/components/UserProfileModal.vue'
import { useFriendStore } from '@/stores/friendStore'

// 为组件设置名称，确保 keep-alive 能正确缓存
defineOptions({
  name: 'TeamMembers',
})

interface MemberUser extends Omit<UserVO, 'tags'> {
  tags?: string[]
  tagsExpanded?: boolean
}

const userList = ref<MemberUser[]>([])
const route = useRoute()
const teamId = ref(Number(route.params.teamId))
const userId = ref()
const captain = ref()
const loading = ref(false)

const friendStore = useFriendStore()
const showProfileModal = ref(false)
const selectedUserId = ref<number | null>(null)

const getTeamData = async () => {
  loading.value = true
  try {
    // 清空旧数据，防止显示上一个队伍的信息
    userList.value = []
    captain.value = null

    const id = await api.user.getCurrentUser()
    userId.value = id.data.data?.id
    const response = await api.team.searchTeamById({ teamId: teamId.value })
    captain.value = response.data.data
    const res = await api.teamUser.list({ teamId: teamId.value })
    if (res.data.data) {
      res.data.data.forEach((user: any) => {
        try {
          if (user.tags) {
            user.tags = JSON.parse(user.tags)
          } else {
            user.tags = []
          }
        } catch (e) {
          user.tags = []
        }
      })
      userList.value = res.data.data as MemberUser[]
    } else {
      userList.value = []
    }
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await Promise.all([getTeamData(), friendStore.ensureLoaded()])
})

// 监听路由参数变化，当团队ID改变时重新获取数据
watch(
  () => route.params.teamId,
  async (newTeamId) => {
    if (newTeamId && Number(newTeamId) !== teamId.value) {
      teamId.value = Number(newTeamId)
      await getTeamData()
    }
  },
  { immediate: false },
)

// 当页面从缓存中激活时，检查路由参数是否变化
onActivated(async () => {
  const currentTeamId = Number(route.params.teamId)
  if (currentTeamId !== teamId.value) {
    teamId.value = currentTeamId
    await getTeamData()
  }
})

const updateTeam = async (teamId: number) => {
  router.push(`/updateTeam/${teamId}`)
}

// 图片加载失败处理
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/ava.jpg'
}

// 移除成员
const removeMember = async (user: any) => {
  try {
    await showConfirmDialog({
      title: '确认移除',
      message: `确定要将 ${user.userName} 移出队伍吗？`,
    })

    // 这里可以添加实际的移除成员逻辑
    showSuccessToast(`${user.userName} 已被移出队伍`)
    await getTeamData() // 重新加载数据
  } catch {
    // 用户取消操作
  }
}

// 查看资料
const viewProfile = (user: any) => {
  selectedUserId.value = user.id
  showProfileModal.value = true
}

// 发送消息
const sendMessage = (user: any) => {
  router.push(`/friendChat/${user.id}`)
}

const isFriend = (id?: number) => (id ? friendStore.isFriend(id) : false)

// 获取要显示的标签
const getDisplayTags = (user: any) => {
  if (!user.tags || !user.tags.length) return []

  // 如果已展开或标签数量少于等于6个，显示全部标签
  if (user.tagsExpanded || user.tags.length <= 6) {
    return user.tags
  }

  // 否则只显示前6个标签
  return user.tags.slice(0, 6)
}

// 切换标签展开状态
const toggleTagsExpand = (user: any) => {
  // 使用 Vue 的响应式系统
  if (user.tagsExpanded === undefined) {
    user.tagsExpanded = false
  }
  user.tagsExpanded = !user.tagsExpanded
}
</script>

<style scoped>
#blank {
  /* 底部间距已在全局设置，无需重复设置 */
}

/* 队伍成员容器 */
.team-members-container {
  padding-bottom: 20px;
}

/* 管理员操作区 */
.admin-actions {
  padding: 16px;
  text-align: center;
  margin-bottom: 20px;
}

.update-team-btn {
  background: #003366;
  border: none;
  box-shadow: 0 4px 16px rgba(0, 51, 102, 0.3);
  padding: 12px 24px;
}

/* 成员卡片容器 */
.members-cards-container {
  padding: 0 16px;
}

/* 成员卡片样式 */
.member-card {
  background: linear-gradient(135deg, #ffffff 0%, #f5f5dc 100%);
  border: 1px solid #a89f91;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
  animation: slideInUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.3s ease;
}

.member-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

/* 成员头部 */
.member-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
  position: relative;
  z-index: 1;
}

.member-avatar {
  position: relative;
  flex-shrink: 0;
  cursor: pointer;
}

.member-avatar img {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  object-fit: cover;
  border: 3px solid #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.role-text {
  margin-left: 8px;
  font-size: 13px;
  color: #4b4b4b;
}

.member-info {
  flex: 1;
}

.member-name {
  font-size: 18px;
  font-weight: 600;
  color: #003366;
  margin: 0 0 4px 0;
  line-height: 1.3;
}

.member-id {
  font-size: 12px;
  color: #4b4b4b;
  margin-bottom: 6px;
}

.member-role {
  display: flex;
  align-items: center;
  margin-top: 4px;
}

/* 成员内容 */
.member-content {
  margin-bottom: 16px;
  position: relative;
  z-index: 1;
}

.member-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.member-tag {
  font-size: 12px;
  border-radius: 12px;
  background: rgba(157, 193, 131, 0.2);
  border-color: #9dc183;
  color: #003366;
}

.expand-tags-btn {
  font-size: 11px;
  padding: 2px 6px;
  height: 20px;
  line-height: 16px;
  border-radius: 10px;
  border-color: #9dc183;
  color: #003366;
  background: rgba(157, 193, 131, 0.1);
  transition: all 0.2s ease;
  align-self: center;
  min-width: 32px;
}

.expand-tags-btn:hover {
  background: rgba(157, 193, 131, 0.2);
  border-color: #8db600;
}

.expand-tags-btn:active {
  transform: scale(0.95);
}

/* 成员操作 */
.member-actions {
  display: flex;
  gap: 8px;
  position: relative;
  z-index: 1;
  padding-top: 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.member-actions .van-button {
  flex: 1;
  padding: 6px 12px;
  font-size: 12px;
  border-radius: 18px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.member-actions .van-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 加载状态 */
.van-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
}

/* 动画效果 */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .members-cards-container {
    padding: 0 12px;
  }

  .member-card {
    padding: 16px;
  }

  .member-avatar img {
    width: 56px;
    height: 56px;
  }

  .member-name {
    font-size: 16px;
  }

  .member-actions {
    flex-direction: column;
    gap: 8px;
  }
}

@media (max-width: 480px) {
  .member-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 12px;
  }

  .member-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .member-tags {
    justify-content: center;
  }

  .member-actions {
    align-items: stretch;
  }
}
</style>
