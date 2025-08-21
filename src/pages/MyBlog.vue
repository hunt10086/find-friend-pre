<template>
  <div v-if="flag">
    <van-card
      v-for="blog in blogList"
      :title="blog.title"
      :desc="blog.kind"
      @click="goToBlog(blog.id)"
    >
      <template #footer>
        <van-button icon="like" size="mini">{{ blog.praise }}</van-button>
      </template>
    </van-card>
    <div id="blank">
      <van-divider />
    </div>
  </div>
  <div v-else>
    <van-empty description="暂无数据" />
  </div>


  <!-- 固定在右下角的按钮 -->
  <van-sticky :offset-bottom="20" position="bottom">
    <van-button
      icon="plus"
      type="primary"
      class="round-button"
      round
      style="position: fixed; right: 20px; bottom: 120px; z-index: 999;"
      @click="handleAddBlog"
    >
    </van-button>
  </van-sticky>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getBlogMyList } from '@/api/controller'
import { useRouter } from 'vue-router'

const blogList = ref()||[]
const user = ref()
const router = useRouter()
const flag=ref(false)
onMounted(async () => {
  const response = await getBlogMyList();
  blogList.value = response.data.data || []
  if(response.data.code===0){
    flag.value=true
  }
})

const goToBlog = (id) => {
  router.push(`/user/blog/${id}`)
}

const handleAddBlog = () => {
  router.push('/blog/create') // 替换为你的新增博客页面路径
}
</script>
<style scoped>
.van-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin: 10px 15px;
  padding: 15px;
}

.van-card__title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.van-card__desc {
  font-size: 14px;
  color: #777;
}

#blank {
  padding-bottom: 60px;
}

.round-button {
  width: 50px;
  height: 50px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-size: 20px;
}

.van-empty__description {
  font-size: 16px;
  color: #999;
}

.van-button--mini {
  font-size: 12px;
  padding: 4px 8px;
}
</style>

