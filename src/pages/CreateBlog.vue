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

.create-blog-container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.create-blog-container {
  max-width: 800px;
  margin: 40px auto;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

h2 {
  font-size: 24px;
  color: #212121;
  margin-bottom: 20px;
  text-align: center;
}
.form-group {
  margin-bottom: 25px;
}


input[type="text"],
select,
textarea {
  width: 100%;
  padding: 12px 15px;
  font-size: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fafafa;
  transition: border-color 0.3s ease;
  resize: vertical;
}

input[type="text"]:focus,
select:focus,
textarea:focus {
  border-color: #2196f3;
  outline: none;
  box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
}


select {
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24'%3E%3Cpath fill='%23999' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  padding-right: 36px;
}


.submit-button {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  font-weight: bold;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #1976d2;
}

.submit-button:active {
  transform: scale(0.98);
}

.blog-content {
  font-size: 1.1em;
  line-height: 1.8;
  color: #333;
  white-space: pre-line;
}




</style>
