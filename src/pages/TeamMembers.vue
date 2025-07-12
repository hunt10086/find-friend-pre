<template>

  <van-button v-if="captain===userId" plain type="primary"  @click="updateTeam(teamId)">更新队伍</van-button>
  <van-card class="card"
              v-for="user in userList"
              :title="`${user.userName}  编号:${user.id} `"
              :thumb="user.avatarUrl" size="80px"
    >
      <template #tags>
        <van-tag plain type="warning" v-for="tag in user.tags">
          {{ tag }}
        </van-tag>
      </template>

      <template #footer>
        <div v-if="captain===user.id">
          队长
        </div>
        <van-button size="mini">查看</van-button>
      </template>
    <br/>
  </van-card>

  <van-divider />
</template>


<script setup lang="ts">

import { onMounted, ref } from 'vue'
import { getTeamSearchById, getTeamUserList, getUserCurrent } from '@/api/controller'
import { useRoute } from 'vue-router'
import router from '@/config/router.ts'

const userList = ref()
const route = useRoute()
const teamId=ref(Number (route.params.teamId))
const userId=ref()
const captain=ref()
onMounted(async () => {
  const id=await getUserCurrent();
  userId.value=id.data.data.id;
  const response=await getTeamSearchById({teamId:teamId.value})
  captain.value=response.data.data;
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  const res=await getTeamUserList({teamId:teamId.value}, config)
  res.data.data.forEach(user => {
    user.tags = JSON.parse(user.tags);
  });
  userList.value=res.data.data||[];
})

const updateTeam = async (teamId) => {
  router.push(`/updateTeam/${teamId}`)
}

</script>


<style scoped>
.van-tag {
  margin-right: 2px;
}
.van-card{
  margin-bottom: 30px;
}
</style>
