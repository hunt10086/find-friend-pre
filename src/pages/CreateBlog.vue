<template>
  <div class="create-blog-container">
    <h2>发表新博客</h2>

    <!-- 博客标题 -->
    <div class="form-group">
      <label for="title">标题</label>
      <input type="text" id="title" v-model="title" placeholder="请输入博客标题" />
    </div>

    <!-- 博客分类 -->
    <div class="form-group">
      <label for="category">分类</label>
      <select id="category" v-model="category">
        <option value="技术">技术</option>
        <option value="生活">生活</option>
        <option value="随笔">随笔</option>
        <option value="分享">分享</option>
        <option value="Java">Java</option>
        <option value="C++">C++</option>
        <option value="Python">Python</option>
        <option value="人工智能">人工智能</option>
      </select>
    </div>

    <!-- 博客内容 -->
    <div class="form-group">
      <label for="content">内容</label>
      <textarea id="content" v-model="content" rows="10" placeholder="写下你的博客内容..."></textarea>
    </div>

    <!-- 提交按钮 -->
    <button @click="submitBlog" class="submit-button">发布博客</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import myAxios from '@/plugins/myAxios'
import { showFailToast, showSuccessToast } from 'vant'

const router = useRouter()

const title = ref('')
const category = ref('技术')
const content = ref('')

const submitBlog = async () => {
  if (!title.value.trim() || !content.value.trim()) {
    showFailToast('标题和内容不能为空')
    return
  }

  try {
    const response = await myAxios.post('/blog/create', {
      title: title.value,
      kind: category.value,
      passage: content.value
    })

    if (response.data.code === 0) {
      showSuccessToast('博客发布成功！')
      router.push('/blog') // 跳转到首页或其他页面
    } else {
      showFailToast('发布失败，请重试')
    }
  } catch (error) {
    console.error('提交博客失败:', error)
  }
}
</script>




<style scoped>
.create-blog-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 8px;
}

input[type="text"],
select,
textarea {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 5px;
  resize: vertical;
}

.submit-button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #1976d2;
}
</style>
