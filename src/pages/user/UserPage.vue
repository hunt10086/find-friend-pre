<template id="UserPage">
  <div v-if="user">
    <van-cell
      title="用户名"
      is-link
      :value="user.userName"
      @click="toEdit('userName', '用户名', user.userName)"
    />
    <br />
    <van-cell title="头像" is-link @click="toEdit('avatarUrl', '头像地址', user.avatarUrl)">
      <img
        :src="user.avatarUrl || '/ava.jpg'"
        style="height: 50px; width: 50px; border-radius: 50%; object-fit: cover"
        @error="handleImageError"
      />
    </van-cell>
    <van-cell
      v-if="user.gender === 1"
      title="性别"
      is-link
      :value="'男'"
      @click="toEdit('gender', '性别', user.gender)"
    />
    <van-cell
      v-if="user.gender === 0"
      title="性别"
      is-link
      :value="'女'"
      @click="toEdit('gender', '性别', user.gender)"
    />
    <van-cell
      v-if="user.gender !== 1 && user.gender !== 0"
      title="性别"
      is-link
      :value="'未知'"
      @click="toEdit('gender', '性别', user.gender)"
    />
    <van-cell
      title="个人简介"
      is-link
      :value="user.profile"
      @click="toEdit('profile', '个人简介', user.profile)"
    />

    <van-cell title="邮箱" :value="user.email || '未设置'" />
    <br />
    <van-cell
      title="经度"
      is-link
      :value="user.longitude"
      @click="toEdit('longitude', '经度', user.longitude)"
    />
    <br />
    <van-cell
      title="纬度"
      is-link
      :value="user.latitude"
      @click="toEdit('latitude', '纬度', user.latitude)"
    />
    <br />
    <van-cell title="标签" is-link value="" @click="toEditTags('tags', '标签', user.tags)">
      <template #value>
        <van-tag color="#D94F4F" type="primary" v-for="tag in user.tags">
          {{ tag }}
        </van-tag>
      </template>
    </van-cell>
    <van-cell
      id="createTime"
      title="创建时间"
      :value="dayjs(user.createTime).format('YYYY-MM-DD HH:mm:ss')"
    />
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { api, type UserVO } from '@/api/apiClient'
import { onMounted, ref, onActivated, watch } from 'vue'
import { showSuccessToast } from 'vant'
import dayjs from 'dayjs'

const router = useRouter()
const route = useRoute()
const user = ref<any>()

const loadUserData = async () => {
  const res = await api.user.getCurrentUser()
  if (res.data.data) {
    user.value = res.data.data
    if (user.value.tags) {
      try {
        user.value.tags = JSON.parse(user.value.tags)
      } catch (e) {
        user.value.tags = []
      }
    }
    showSuccessToast('获取用户信息成功')
  } else {
    showSuccessToast('获取用户信息失败')
  }
}

onMounted(async () => {
  await loadUserData()
})

// 当页面从缓存中激活时重新获取数据
onActivated(async () => {
  await loadUserData()
})

// 监听路由变化，当从编辑页面返回时重新获取数据
watch(
  () => route.fullPath,
  async (newPath, oldPath) => {
    // 如果是从编辑页面返回到用户页面，重新加载数据
    if (newPath === '/user' && oldPath?.includes('/user/edit')) {
      await loadUserData()
    }
    if (newPath === '/user' && oldPath?.includes('/edit/tags')) {
      await loadUserData()
    }
  },
)

const toEdit = (editKey: string, editName: string, currentValue: string | number | undefined) => {
  router.push({
    path: '/user/edit',
    query: {
      editKey,
      editName,
      currentValue: currentValue !== undefined ? String(currentValue) : '',
    },
  })
}

const toEditTags = (editKey: string, editName: string, currentValue: any) => {
  router.push({
    path: '/edit/tags',
    query: {
      editKey,
      editName,
      currentValue: JSON.stringify(currentValue),
    },
  })
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/ava.jpg'
}
</script>
<style scoped>
.van-tag {
  margin-right: 2px;
}
#createTime {
  padding-bottom: 40px;
}
</style>
