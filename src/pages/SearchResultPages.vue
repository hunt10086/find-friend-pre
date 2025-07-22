<template>
  <div v-if="flag">
    <van-card
      class="card"
      v-for="user in userList"
      :desc="user.profile"
      :title="`${user.userName}
         编号:${user.id} `"
      :thumb="user.avatarUrl"
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
import { onMounted, ref } from 'vue'
import myAxios from '../plugins/myAxios'
import { showFailToast } from 'vant'

const route = useRoute()
const tags = route.query
const flag = ref(true)
const userList = ref([])
onMounted(async () => {
  try {
    const response = await myAxios.get('user/search/tags', {
      params: {
        tagsList: tags.tag, // 假设 tags.tag 是数组 ['女', '大二']
      },
      paramsSerializer: (params) => {
        const tagValues = params.tagsList
        if (Array.isArray(tagValues)) {
          return tagValues.map((value) => `tagsList=${encodeURIComponent(value)}`).join('&')
        }
        return `tagsList=${encodeURIComponent(tagValues)}`
      },
    })

    response.data.data.forEach((user) => {
      user.tags = JSON.parse(user.tags)
    })

    userList.value = response.data.data || []
    if (userList.value.length === 0) {
      flag.value = false
    }
  } catch (error) {
    flag.value = false
    console.error('Failed to fetch data:', error)
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
