<template>
  <van-button plain type="primary" @click="createTeam">创建队伍</van-button>
  <van-empty v-if="!flag" description="还没有创建队伍" />
  <div v-if="flag">
    <van-card
      class="card"
      v-for="team in teamList"
      :desc="`队伍描述: ${team.description}`"
      :title="` 队伍名:  ${team.teamName} `"
      :thumb="team.icon"
    >
      <template #tags>
        <van-tag v-if="team.status===0" plain type="danger">公开</van-tag>
        <van-tag v-if="team.status===1" plain type="danger">加密</van-tag>
        <div>
          最大人数: {{team.maxNum}}
        </div>
      </template>

      <template #footer>
        <van-button plain type="warning" size="mini" @click="">退出队伍</van-button>
        <van-button plain type="danger" size="mini" @click="">解散队伍</van-button>

      </template>
      <van-divider />
    </van-card>
  </div>
</template>


<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getTeamMyTeam, getUserCurrent } from '@/api/controller'

const flag=ref(false);
const router = useRouter();
const userId=ref(0);

const createTeam = () => {
  router.push('/create');
}

const teamList = ref();
onMounted(async () => {
  const res=await getTeamMyTeam();
  teamList.value=res.data.data||[];
  if(teamList.value.length>0){
    flag.value=true;
  }
})
//TODO 需要完成我的队伍的退出，解散，更新页面，查看队伍详细信息

</script>



<style scoped>

</style>
