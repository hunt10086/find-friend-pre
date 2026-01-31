<template>
  <div>
    <van-form label-width="100%" @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-if="editUser.editKey === 'avatarUrl'"
          v-model="editUser.currentValue"
          name="avatarUrl"
          label="头像链接"
          placeholder="请选择或粘贴头像链接"
        />
        <van-field v-if="editUser.editKey === 'avatarUrl'" name="avatarUploader" label="上传头像">
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
        <van-field
          v-else-if="editUser.editKey !== 'gender'"
          v-model="editUser.currentValue"
          :name="editUser.editKey"
          :label="editUser.editName"
          :placeholder="`请输入 ${editUser.editName}`"
        />

        <van-field
          v-else
          v-model="displayValue"
          name="gender"
          label="性别"
          placeholder="请选择性别"
          :rules="[{ required: true, message: '请选择性别' }]"
        >
          <template #input>
            <van-radio-group v-model="displayValue" direction="horizontal">
              <van-radio name="男">男</van-radio>
              <van-radio name="女">女</van-radio>
            </van-radio-group>
          </template>
        </van-field>
      </van-cell-group>

      <div style="margin: 16px">
        <van-button round block type="primary" native-type="submit">提交</van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onActivated, watch, nextTick } from 'vue'

import { useRoute } from 'vue-router'

import { postUserUpdate, postUpload } from '@/api/dist/controller'

import { showFailToast, showSuccessToast } from 'vant'

import router from '@/config/router.ts'

// 为组件设置名称，确保 keep-alive 能正确缓存
defineOptions({
  name: 'UserEditPages',
})

const route = useRoute()

const normalizeQueryString = (v: any): string => {
  if (Array.isArray(v)) return (v[0] ?? '') as string
  return (v ?? '') as string
}

const editUser = ref({
  editKey: normalizeQueryString(route.query.editKey),
  currentValue: normalizeQueryString(route.query.currentValue),
  editName: normalizeQueryString(route.query.editName),
})

// 展示用的当前值（转换为"男/女/未知"）

const displayValue = ref('')

const fileList = ref<any[]>([])

const uploading = ref<boolean>(false)

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

// 性别映射函数：数字 → 中文
const numberToGender = (val: string | number): string => {
  if (val === 1 || val === '1') return '男'
  if (val === 0 || val === '0') return '女'
  return '未知'
}

// 中文 → 数字
const genderToNumber = (val: string): number | null => {
  if (val === '男') return 1
  if (val === '女') return 0
  return null
}

// 初始化编辑数据的函数
const initEditData = () => {
  console.log('初始化编辑数据:', route.query)
  editUser.value = {
    editKey: normalizeQueryString(route.query.editKey),
    currentValue: normalizeQueryString(route.query.currentValue),
    editName: normalizeQueryString(route.query.editName),
  }

  if (editUser.value.editKey === 'gender') {
    displayValue.value = numberToGender(editUser.value.currentValue)
  } else {
    displayValue.value = editUser.value.currentValue as string
  }
}

// 页面加载时初始化展示值
onMounted(() => {
  initEditData()
})

// 当页面从缓存中激活时重新初始化数据
onActivated(async () => {
  await nextTick() // 确保路由参数已更新
  initEditData()
})

// 监听路由查询参数变化
watch(
  () => route.query,
  async (newQuery, oldQuery) => {
    console.log('路由查询参数变化:', { newQuery, oldQuery })
    if (JSON.stringify(newQuery) !== JSON.stringify(oldQuery)) {
      await nextTick()
      initEditData()
    }
  },
  { deep: true },
)

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
      editUser.value.currentValue = res.data.data
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
const onSubmit = async (values: any) => {
  let submitValue = values[editUser.value.editKey]

  if (editUser.value.editKey === 'gender') {
    // 将“男/女”转为数字
    const genderNum = genderToNumber(submitValue)
    if (genderNum === null) {
      showFailToast('请选择正确的性别')
      return
    }
    submitValue = genderNum
  }
  const input = {
    [editUser.value.editKey]: submitValue,
  }
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  const res = await postUserUpdate(input, config)
  if (res.data.code === 0) {
    showSuccessToast('修改成功')
    // 直接返回用户页面，由UserPage.vue的路由监听器处理数据刷新
    router.push('/user')
  } else {
    showSuccessToast('修改失败')
  }
}
</script>

<style scoped></style>
