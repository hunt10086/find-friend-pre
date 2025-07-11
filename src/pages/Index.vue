<template>
    <div class="custom-text-box">
      <p class="text-content">猜你喜欢:</p>
    </div>
    <div class="card-show" v-for="user in userList"  style="margin-bottom: 16px;">
      <van-skeleton >
        <template #template>
          <div :style="{ display: 'flex', width: '100%' }">
            <div v-if="user.avatarUrl" style="width: 100px;">
              <img :src="user.avatarUrl" style="width: 100%" />
            </div>
            <div v-else style="width: 100px; text-align: center; line-height: 100px; background-color: #f0f0f0; font-weight: bold;">
              {{ getDefaultAvatarText(user) }}
            </div>
          </div>

          <div :style="{ display: 'flex', width: '100%' }">
            <div :style="{ flex: 1, marginLeft: '16px' }">
              <p>编号：{{ user.id}}</p>
              <p>用户名：{{ user.userName }}</p>
              <van-tag class="tag" plain type="warning" v-for="tag in user.tags">
                {{ tag }}
              </van-tag>
              <p>简介：{{ user.profile}}</p>
            </div>
          </div>
        </template>
      </van-skeleton>
      <van-divider />
    </div>

  <p class="pages">{{cont}}</p>
  <div style="display: flex; justify-content: center; gap: 20px; margin-top: 16px;">
    <van-button v-if="flagPre" type="primary" @click="GoPre">上一页</van-button>
    <van-button v-if="flag" type="primary" @click="loadMore">下一页</van-button>
  </div>


</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getUserListLike } from '@/api/controller'


const userList=ref();
const size=ref(8)
const cont=ref(1);
const max=ref(100)
const flag=ref(true)
const flagPre=ref(false)
onMounted(async() =>{

 const res=await getUserListLike({
   count:cont.value
 });
  res.data.data.forEach(user => {
    user.tags = JSON.parse(user.tags);
  });
 userList.value=res.data.data||[];
 if(res.data.code<8) {
   flag.value = false;
 }
});


const loadMore = async () => {
  cont.value++;
  const res=await getUserListLike({
    count:cont.value

  });
  res.data.data.forEach(user => {
    user.tags = JSON.parse(user.tags);
  });
  userList.value=res.data.data||[];
  if(res.data.code<8) {
    flag.value = false;
  }
  flagPre.value=true;
};

const GoPre = async () => {
  cont.value--;
  const res=await getUserListLike({
    count:cont.value

  });
  res.data.data.forEach(user => {
    user.tags = JSON.parse(user.tags);
  });
  userList.value=res.data.data||[];
  flag.value=true;
  if(cont.value==1){
    flagPre.value=false;
  }
};


const getDefaultAvatarText = (user) => {
  return user.userName ? user.userName.charAt(0).toUpperCase() : 'U'
}




</script>

<style scoped>.custom-text-box {
  padding: 20px;
  margin: 10px;
  background-color: #f0f0f0;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 50%;
}

.text-content {
  font-size: 16px;
  color: #333;
  line-height: 1.5;
}

.pages{
  text-align: center;
}

.card-show {
  padding: 10px;
  background-color: #fff;
}
.tag{
  margin: 2px;
}
</style>
