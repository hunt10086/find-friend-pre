<template>
  <van-form label-width="100%" @submit="onSubmit">
    <van-cell-group inset>
      <van-field
        v-model="teamName"
        name="teamName"
        label="队伍名称"
        placeholder="请输入队伍名称"
        maxlength="32"
        :rules="[{ required: true, message: '请填写队伍名称' }]"
      />
      <van-field
        v-model="description"
        rows="2"
        autosize
        label="留言"
        type="textarea"
        maxlength="256"
        placeholder="请输入队伍描述"
        show-word-limit
      />

      <van-field
        v-model="icon"
        name="icon"
        label="队伍头像链接"
        placeholder="请输入链接"
        maxlength="256"
        :rules="[{ required: false, message: '请输入队伍头像链接' }]"
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
        <p>选择队伍人数</p>
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
      <van-button round block type="primary" native-type="submit"> 提交 </van-button>
    </div>
  </van-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getUserCurrent, postTeamCreate, postUpload } from '@/api/dist/controller'
import { watch } from 'vue'
import { showFailToast, showSuccessToast } from 'vant'
import { useRouter } from 'vue-router'

const teamName = ref('')
const description = ref('')
const maxNum = ref()
const icon = ref('')
const userId = ref()
const status = ref(0)
const password = ref('')
const router = useRouter()

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

const check = async () => {
  const res = await getUserCurrent()
  userId.value = res.data.data.id
}
check()

const handleUpload = async (item: any) => {
  try {
    uploading.value = true
    const file = Array.isArray(item) ? item[0].file : item.file
    if (!file) {
      showFailToast('未选择文件')
      return
    }
    const res = await postUpload(
      { file: file as File },
      { headers: { 'Content-Type': 'multipart/form-data' } },
    )
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
const onSubmit = async () => {
  const input = {
    teamName: teamName.value,
    description: description.value,
    maxNum: maxNum.value,
    userId: userId.value,
    status: status.value,
    icon: icon.value,
    password: password.value,
  }
  const res = await postTeamCreate(input)
  if (res.data.code === 0) {
    showSuccessToast('创建队伍成功')
    // 添加时间戳参数强制刷新列表
    await router.replace({ path: '/myTeam', query: { refresh: Date.now() } })
  } else {
    showFailToast('创建失败')
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
