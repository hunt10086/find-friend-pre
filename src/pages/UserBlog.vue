<template>
  <div class="blog-container">
    <!-- 博客标题 -->
    <h1 class="blog-title">{{ title }}</h1>

    <!-- 博客分类 -->
    <p class="blog-kind"><strong>分类:</strong> {{ kind }}</p>

    <!-- 用户信息 -->
    <div class="user-info">
      <img :src="userAvatar || '/ava.jpg'"  width="50px" alt="用户头像" class="avatar" @error="handleImageError" />
      <div class="user-details">
        <p><strong>作者:</strong> {{ userName }}</p>
        <p><strong>简介:</strong> {{ userProfile }}</p>
      </div>
    </div>

    <!-- 博客内容 -->
    <div class="blog-content">
      <p>{{ passage }}</p>
    </div>
  </div>
<!-- 点赞-->
  <div>
    <van-button icon="like" size="small" @click="like">{{praise}}</van-button>
  </div>


  <!-- 评论区 -->
  <div class="comments-section">
    <h2>评论区</h2>
    <div v-if="comments.length > 0">
      <div v-for="comment in comments"  class="comment-item">
        <div class="comment-header">
          <img :src="comment.avatarUrl || '/ava.jpg'" alt="用户头像" class="comment-avatar" @error="handleImageError" />
          <div class="comment-user-info">
            <p><strong>{{ comment.userName }}</strong></p>
            {{ dayjs(comment.createTime).format('YYYY-MM-DD HH:mm:ss') }}
          </div>
        </div>
        <div class="comment-content">
          <van-text-ellipsis :content="comment.content" expand-text="展开" collapse-text="收起" />
        </div>
      </div>
    </div>
    <p v-else>暂无评论</p>
  </div>

  <div class="add-comment">
    <textarea v-model="newCommentContent" placeholder="写下你的评论..." rows="5" class="comment-textarea"></textarea>
    <button @click="submitComment"  class="submit-button">提交评论</button>
    <br/>
    <button  v-if="userId===id" @click="DeleteBlog" class="submit-button">删除博客</button>
  </div>

  <div>
  </div>


</template>



<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getBlogDelete, getBlogGetOne, getBlogLike, getUserCurrent } from '@/api/controller'
import myAxios from '@/plugins/myAxios'
import router from '@/config/router.ts'
import dayjs from 'dayjs'
import { showSuccessToast } from 'vant'
const route= useRoute()
const blogId = ref(Number(route.params.id))
const blog= ref()
const title= ref('')
const passage= ref('')
const kind= ref('')
const praise= ref()

const comments=ref([])
const userAvatar= ref('')
const userName= ref('')
const userProfile= ref('')
const id= ref(0)
const userId= ref(0)
const getBlogData = async () => {
  const response = await getBlogGetOne({blogId : blogId.value})
  blog.value = response.data.data;
  console.log(blog.value)
  title.value = blog.value.title
  passage.value = blog.value.passage
  kind.value = blog.value.kind
  praise.value = blog.value.praise
  userId.value = blog.value.userId

  // 获取当前用户信息（根据博客中的 userId）
  const userResponse = await myAxios.get(`/user/search/one`, {
    params:{
      id: blog.value.userId
    }
  })
  const userData = userResponse.data.data
  userAvatar.value = userData.avatarUrl
  userName.value = userData.userName
  userProfile.value = userData.profile

  const commentResponse = await myAxios.get(`/comment/list`, {
    params:{
      blogId: blogId.value
    }
  })
  comments.value = commentResponse.data.data||[]
}

onMounted(async () => {
  await getBlogData()
})

const newCommentContent = ref('')

const submitComment = async () => {
  // if (!newCommentContent.value.trim()) return
  try {
    await myAxios.get('/comment/create', {
      params:{
        blogId: blogId.value,
        comment: newCommentContent.value
      }
    })
    newCommentContent.value = ''
    await getBlogData()
  } catch (error) {
    console.error('提交评论失败:', error)
  }
}

const like=async()=>{
  const params={
    blogId: blogId.value
  }
  const res=await getBlogLike(params)
  await getBlogData()
}

const getId=async()=>{
  const res=await getUserCurrent()
  id.value=res.data.data.id
}
getId()

const DeleteBlog=async()=>{
  const res=await getBlogDelete({id:blogId.value})
  if(res.data.code===0){
    showSuccessToast('删除成功')
    router.push('/Blog')
  }else{
    showSuccessToast('删除失败')
  }
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/ava.jpg'
}

</script>


<style scoped>
.blog-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.blog-title {
  font-size: 2em;
  margin-bottom: 10px;
}

.blog-kind {
  font-size: 1em;
  color: #555;
  margin-bottom: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 15px;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.blog-content {
  font-size: 1.1em;
  line-height: 1.6;
}

.comments-section {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #ccc;
}

.comment-item {
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
  margin-bottom: 15px;
}

.comment-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.comment-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.comment-user-info p {
  margin: 0;
  font-size: 14px;
}

.comment-user-info small {
  color: #999;
}

.comment-content {
  font-size: 15px;
}

.add-comment {
  margin-top: 20px;
  padding-bottom: 50px;
}

.comment-textarea {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  resize: none;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.submit-button {
  margin-top: 10px;
  padding: 8px 16px;
  font-size: 14px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #0056b3;
}

.blog-content {
  font-size: 1.1em;
  line-height: 1.6;
  word-break: break-all; /* 或使用 overflow-wrap: break-word; */
}

.blog-content img {
  max-width: 100%;
  height: auto;
  display: block;
}

.blog-container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.blog-title {
  font-size: 2.5em;
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 10px;
}

.blog-kind {
  font-size: 1em;
  color: #3498db;
  margin-bottom: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  background-color: #f9f9f9;
  padding: 10px 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}


.blog-content {
  font-size: 1.1em;
  line-height: 1.8;
  color: #333;
  word-break: break-word;
}

.blog-content p {
  margin-bottom: 1.2em;
}

.blog-content img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 10px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.submit-button {
  margin-top: 10px;
  padding: 10px 20px;
  font-size: 14px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #2980b9;
}

.van-button--small {
  margin: 20px auto 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  padding: 8px 16px;
}

.blog-content {
  font-size: 1.1em;
  line-height: 1.8;
  color: #333;
  white-space: pre-line; /* 关键样式 */
  word-break: break-word;
}


</style>
