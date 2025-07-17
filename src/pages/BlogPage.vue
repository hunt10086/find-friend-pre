<template>
  <van-card
    v-for="blog in blogList"
    :title="blog.title"
    :desc="blog.kind"
    :thumb="user.avatarUrl"
    @click="goToBlog(blog.id)"
  />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getBlogList, getUserCurrent } from '@/api/controller'
import { useRouter } from 'vue-router'

const blogList = ref()
const user = ref()
const router = useRouter()
onMounted(async () => {
  const response = await getBlogList()
  blogList.value = response.data.data || []
  const res = await getUserCurrent()
  user.value = res.data.data
})

const goToBlog = (id) => {
      router.push(`/user/blog/${id}`)
}
</script>
<style scoped></style>
