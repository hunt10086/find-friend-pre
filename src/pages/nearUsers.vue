<template>
  <van-card
    class="card"
    v-for="user in userList"
    :title="`${user.userName}  编号:${user.id} `"
    :thumb="user.avatarUrl"
    size="80px"
  >
    <template #tags>
      <van-tag plain type="warning" v-for="tag in user.tags">
        {{ tag }}
      </van-tag>
    </template>

    <template #footer>
      <div>距离你的距离:{{user.distance}}  km</div>
    </template>
    <br />
  </van-card>

  <van-divider />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getNearUser } from '@/api/controller/YongHuJieKou/getNearUser.js'
import { showSuccessToast } from 'vant'

const userList = ref()
onMounted(async () => {
  const res=await  getNearUser();
  res.data.data.forEach((user) => {
    user.tags = JSON.parse(user.tags)
  })
  if(res.data.code==0){
    showSuccessToast('获取成功');
    userList.value=res.data.data||[];
  }else{
    showSuccessToast('获取失败');
  }
})

</script>

<style scoped>
.van-tag {
  margin-right: 2px;
}

.van-card {
  margin-bottom: 30px;
}
</style>
