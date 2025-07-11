<template>
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
      <van-button plain type="success" size="mini" @click="joinTeam(team)">加入队伍</van-button>
    </template>
    <van-divider />
  </van-card>

  <p class="pages">{{currentPage}}</p>
  <div style="display: flex; justify-content: center; gap: 20px; margin-top: 16px;">
    <van-button v-if="flagPre" type="primary" @click="GoPre">上一页</van-button>
    <van-button v-if="flag" type="primary" @click="loadMore">下一页</van-button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getTeamList, postTeamJoin } from '@/api/controller'
import { showSuccessToast,showFailToast } from 'vant'
import router from '@/config/router.ts'
const currentPage = ref(1)
const flag=ref(true)
const flagPre=ref(false)
const teamList = ref()
onMounted(async () => {
  const params = {
    count: currentPage.value,
  }
  const res = await getTeamList(params)
  teamList.value = res.data.data || []
  if(res.data.code<6) {
    flag.value = false;
  }
})

const loadMore = async () => {
  currentPage.value++;
  const res=await getTeamList({
    count:currentPage.value

  });
  teamList.value=res.data.data||[];
  if(res.data.code<6) {
    flag.value = false;
  }
  flagPre.value=true;
};

const GoPre = async () => {
  currentPage.value--;
  const res=await getTeamList({
    count:currentPage.value

  });
  teamList.value=res.data.data||[];
  flag.value=true;
  if(currentPage.value==1){
    flagPre.value=false;
  }
};

const joinTeam = async (team) => {
  if(team.status===1){
    await router.push("/JoinTeam")
  }else{
    const res=await postTeamJoin({
      password:team.password
    },team)
    if(res.data.code===0){
      showSuccessToast("加入成功");
    }else{
      showFailToast("加入失败");
    }
  }
};
</script>


<style scoped>
.custom-text-box {
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
