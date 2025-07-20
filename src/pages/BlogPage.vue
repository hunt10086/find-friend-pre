<template>
  <van-card
    v-for="blog in blogList"
    :title="blog.title"
    :desc="blog.kind"
    :thumb="blog.avatarUrl"
    @click="goToBlog(blog.id)"
  >
    <template #footer>
      <van-button icon="like" size="mini">{{ blog.praise }}</van-button>
    </template>
  </van-card>
  <div id="blank">
    <van-divider />
  </div>

  <!-- 固定在右下角的按钮 -->
  <van-sticky :offset-bottom="20" position="bottom">
    <van-button
      icon="plus"
      type="primary"
      class="round-button"
      round
      style="position: fixed; right: 20px; bottom: 70px; z-index: 999999999"
      @click="handleAddBlog"
    >
    </van-button>
  </van-sticky>
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
})

const goToBlog = (id) => {
  router.push(`/user/blog/${id}`)
}

const handleAddBlog = () => {
  router.push('/blog/create')
}

</script>
<style scoped>
#blank{
  padding-bottom: 50px;
}
.van-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin: 10px;
  background-color: #F5F5DC;
}

.van-card__title {
  font-size: 24px;
  color: #333333;
}

.van-card__desc {
  font-size: 20px;
  color: #666666;
}
</style>
