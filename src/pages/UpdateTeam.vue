<template>
  <van-form label-width="100%" @submit="onSubmit">
    <van-cell-group inset>
      <van-field
        v-model="teamName"
        name="teamName"
        label="更改伍名称"
        placeholder="请更改队伍名称"
        maxlength="32"
        :rules="[{ required: true, message: '请输入队伍名称' }]"
      />
      <van-field
        v-model="description"
        rows="2"
        autosize
        label="留言"
        type="textarea"
        maxlength="256"
        placeholder="请更改队伍描述"
        show-word-limit
      />
      <van-field
        v-model="icon"
        name="icon"
        label="更改队伍头像链接"
        placeholder="请输入链接"
        maxlength="256"
        :rules="[{ required: true, message: '请输入队伍头像链接' }]"
      />
      <br />
      <div>
        <p>更改队伍人数</p>
        <van-stepper v-model="maxNum" min="3" max="15" />
      </div>
      <br />
      <van-radio-group v-model="status" direction="horizontal">
        <van-radio :name="0">公开</van-radio>
        <van-radio :name="1">加密</van-radio>
      </van-radio-group>
      <br />
      <!-- 条件渲染密码输入框 -->
      <van-field
        v-if="status === 1"
        v-model="password"
        type="password"
        name="密码"
        label="密码"
        placeholder="密码"
        :rules="[{ required: true, message: '请填写密码' }]"
      />
    </van-cell-group>
    <div style="margin: 16px">
      <van-button round block type="primary" native-type="submit"> 更新</van-button>
    </div>
  </van-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getTeamSearchById, getUserCurrent, postTeamUpdate } from '@/api/controller'
import { watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showFailToast, showSuccessToast } from 'vant'

let teamName = ref('')
const description = ref('')
const icon = ref('')
const userId = ref()
const status = ref(0)
const password = ref('')
const router = useRouter()
const maxNum = ref(3)
let team = ref()
const route = useRoute()
const teamId = ref(Number(route.params.teamId))

const check = async () => {
  const res = await getUserCurrent()
  userId.value = res.data.data.id
}
check()
const onSubmit = async () => {
  const res = await getTeamSearchById({ teamId: teamId.value })
  const input = {
    id: teamId.value,
    teamName: teamName.value,
    maxNum: maxNum.value,
    description: description.value,
    status: status.value,
    icon: icon.value,
    password: password.value,
  }
  const response = await postTeamUpdate({ id: teamId.value }, input)
  if (response.data.code === 0) {
    showSuccessToast('更新成功')
    await router.replace('/myTeam')
  } else {
    showFailToast('更新失败')
  }
}

watch(status, (newVal) => {
  if (newVal === 1) {
    console.log('加密模式开启')
  } else {
    console.log('公开模式')
    password.value = '' // 可选：清空密码
  }
})
console.log(status.value)
</script>

<style scoped>
van-field {
  margin-top: 20px;
}
</style>
