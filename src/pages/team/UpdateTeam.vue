<template>
  <!-- Loading状态 -->
  <van-loading v-if="loading" type="spinner" color="#1989fa" size="24px">
    加载队伍信息中...
  </van-loading>

  <!-- 表单内容 -->
  <van-form v-else label-width="100%" @submit="onSubmit">
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
      <van-field name="uploader" label="上传队伍头像">
        <template #input>
          <van-uploader
            :before-read="beforeRead"
            v-model="fileList"
            :max-count="1"
            :after-read="handleUpload"
            :disabled="uploading"
            accept="image/*"
          />
        </template>
      </van-field>
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
import { ref, onMounted, watch, onActivated } from 'vue'
import { api, type TeamVO } from '@/api/apiClient'
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
let team = ref<TeamVO>()
const route = useRoute()
const teamId = ref(Number(route.params.teamId))
const loading = ref(false)

const fileList = ref<any[]>([])
const uploading = ref(false)

const MAX_UPLOAD_SIZE = 4 * 1024 * 1024
const ALLOWED_EXTS = ['jpeg', 'jpg', 'png', 'webp']
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp']

const beforeRead = (input: any) => {
  const toFile = (it: any): File => (it && (it.file as File)) || (it as File)

  const validate = (file: File): boolean => {
    const name = (file?.name || '').toLowerCase()
    const ext = name.includes('.') ? name.split('.').pop() || '' : ''
    if (file.size > MAX_UPLOAD_SIZE) {
      showFailToast('图片大小不能超过 4MB')
      return false
    }
    if (!ALLOWED_EXTS.includes(ext) || !ALLOWED_MIME.includes(file.type)) {
      showFailToast('仅支持 jpeg / jpg / png / webp 格式')
      return false
    }
    return true
  }

  if (Array.isArray(input)) {
    return input.every((it) => validate(toFile(it)))
  }
  return validate(toFile(input))
}

const handleUpload = async (item: any) => {
  try {
    uploading.value = true
    const file = Array.isArray(item) ? item[0].file : item.file
    if (!file) {
      showFailToast('未选择文件')
      return
    }
    const res = await api.upload.uploadPicture({ type: 'Team' }, { file: file as File })
    if (res?.data?.code === 0 && res?.data?.data) {
      icon.value = res.data.data
      fileList.value = [{ url: res.data.data } as any]
      showSuccessToast('上传成功')
    } else {
      showFailToast(res?.data?.message || '上传失败')
    }
  } catch (e) {
    showFailToast('上传失败')
  } finally {
    uploading.value = false
  }
}

const loadTeamData = async () => {
  loading.value = true
  try {
    // 清空表单数据
    teamName.value = ''
    description.value = ''
    icon.value = ''
    status.value = 0
    password.value = ''
    maxNum.value = 3

    // 获取队伍详情并预填充表单
    const teamRes = await api.team.getMyTeam()
    const teamData = teamRes.data.data

    if (teamData) {
      const team = teamData.find((t) => t.id === teamId.value)
      if (team) {
        teamName.value = team.teamName || ''
        description.value = team.description || ''
        icon.value = team.icon || ''
        if (team.icon) {
          fileList.value = [{ url: team.icon }]
        }
        status.value = team.status || 0
        maxNum.value = team.maxNum || 3
      }
    }
  } catch (error) {
    showFailToast('加载队伍信息失败')
  } finally {
    loading.value = false
  }
}

const check = async () => {
  const res = await api.user.getCurrentUser()
  userId.value = res.data.data?.id
}

onMounted(async () => {
  await check()
  await loadTeamData()
})

// 监听路由参数变化，当团队ID改变时重新加载数据
watch(
  () => route.params.teamId,
  async (newTeamId) => {
    if (newTeamId && Number(newTeamId) !== teamId.value) {
      teamId.value = Number(newTeamId)
      await loadTeamData()
    }
  },
  { immediate: false },
)

// 当页面从缓存中激活时，检查路由参数是否变化
onActivated(async () => {
  const currentTeamId = Number(route.params.teamId)
  if (currentTeamId !== teamId.value) {
    teamId.value = currentTeamId
    await loadTeamData()
  }
})
const onSubmit = async () => {
  const input: TeamVO = {
    id: teamId.value,
    teamName: teamName.value,
    maxNum: maxNum.value,
    description: description.value,
    status: status.value,
    icon: icon.value,
    password: password.value,
  }
  const response = await api.team.updateTeam({ id: teamId.value }, input)
  if (response.data.code === 0) {
    showSuccessToast('更新成功')
    // 添加时间戳参数强制刷新列表
    await router.replace({ path: '/myTeam', query: { refresh: Date.now() } })
  } else {
    showFailToast('更新失败')
  }
}

watch(status, (newVal) => {
  if (newVal === 1) {
    // 加密模式开启
  } else {
    // 公开模式
    password.value = '' // 可选：清空密码
  }
})
</script>

<style scoped>
van-field {
  margin-top: 20px;
}
</style>
