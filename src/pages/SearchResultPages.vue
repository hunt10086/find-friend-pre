<template>
  <div v-if="flag">
    <van-card
      class="card"
      v-for="user in userList"
      :desc="user.profile"
      :title="`${user.userName}
         编号:${user.id} `"
      :thumb="user.avatarUrl || '/ava.jpg'"
      size="80px"
    >
      <template #tags>
        <van-tag plain type="warning" v-for="tag in user.tags">
          {{ tag }}
        </van-tag>
      </template>
      <template #footer>
        <van-button size="mini" @click="addUser">联系我</van-button>
      </template>
    </van-card>
    <van-divider />
  </div>
  <div v-if="!flag">
    <van-empty image="search" description="搜索失败" />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { onMounted, ref, onActivated, watch, nextTick } from 'vue'
import myAxios from '../plugins/myAxios'
import { showFailToast } from 'vant'

// 为组件设置名称，确保 keep-alive 能正确缓存
defineOptions({
  name: 'SearchResultPages'
})

const route = useRoute()
const flag = ref(true)
const userList = ref([])
const isLoading = ref(false)

const loadSearchData = async () => {
  if (isLoading.value) return // 防止重复请求
  
  try {
    isLoading.value = true
    const currentTags = route.query
    
    // 确保有查询参数
    if (!currentTags.tag || (Array.isArray(currentTags.tag) && currentTags.tag.length === 0)) {
      userList.value = []
      flag.value = false
      return
    }
    
    console.log('Loading search data with tags:', currentTags.tag)
    
    const response = await myAxios.get('user/search/tags', {
      params: {
        tagsList: currentTags.tag, // 假设 currentTags.tag 是数组 ['女', '大二']
      },
      paramsSerializer: (params) => {
        const tagValues = params.tagsList
        if (Array.isArray(tagValues)) {
          return tagValues.map((value) => `tagsList=${encodeURIComponent(value)}`).join('&')
        }
        return `tagsList=${encodeURIComponent(tagValues)}`
      },
    })

    if (response.data && response.data.data) {
      response.data.data.forEach((user) => {
        user.tags = JSON.parse(user.tags)
      })

      userList.value = response.data.data || []
      if (userList.value.length === 0) {
        flag.value = false
      } else {
        flag.value = true
      }
    } else {
      userList.value = []
      flag.value = false
    }
  } catch (error) {
    flag.value = false
    userList.value = []
    console.error('Failed to fetch data:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await loadSearchData()
})

// 当页面从缓存中激活时重新获取数据
onActivated(async () => {
  // 使用 nextTick 确保路由参数已经更新
  await nextTick()
  await loadSearchData()
})

// 监听路由查询参数变化，当查询参数改变时重新获取数据
watch(() => route.query, async (newQuery, oldQuery) => {
  console.log('Route query changed:', { newQuery, oldQuery })
  // 更严格的比较，确保真的发生了变化
  const newQueryStr = JSON.stringify(newQuery)
  const oldQueryStr = JSON.stringify(oldQuery)
  
  if (newQueryStr !== oldQueryStr) {
    console.log('Query parameters changed, reloading data...')
    // 清空当前数据，显示加载状态
    userList.value = []
    await loadSearchData()
  }
}, { deep: true, immediate: false })

// 监听路由路径变化，确保在路由切换时也能正确刷新
watch(() => route.fullPath, async (newPath, oldPath) => {
  console.log('Route path changed:', { newPath, oldPath })
  if (newPath.includes('/user/list') && newPath !== oldPath) {
    await nextTick()
    await loadSearchData()
  }
})

const addUser = async () => {
  showFailToast('功能暂未开放，敬请期待')
}
</script>

<style scoped>
.van-tag {
  margin-right: 4px;
}

.van-card {
  --van-card-thumb-size: 120px;
  margin-bottom: 30px;
}
</style>
