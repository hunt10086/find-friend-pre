<template>
  <div>
    <van-form label-width="100%" @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-if="editUser.editKey !== 'gender' && editUser.editKey !== 'tags'"
          v-model="editUser.currentValue"
          :name="editUser.editKey"
          :label="editUser.editName"
          :placeholder="`请输入 ${editUser.editName}`"
        />
        <van-field
          v-if="editUser.editKey === 'gender'"
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

        <!-- 标签选择 -->
        <van-cell v-if="editUser.editKey === 'tags'" title="选择标签" />
        <van-tree-select
          v-if="editUser.editKey === 'tags'"
          v-model:active-id="activeIds"
          v-model:main-active-index="activeIndex"
          :items="tagList"
        />

      </van-cell-group>

      <div style="margin: 16px">
        <van-button round block type="primary" native-type="submit">提交</van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { postUserUpdate } from '@/api/controller'
import { showFailToast, showSuccessToast } from 'vant'
import router from '@/config/router.ts'
import {originTagList} from '@/config/tag.config.ts'
const  tagList = ref(originTagList)

const route = useRoute()
console.log(route.query)
const editUser = ref({
  editKey: route.query.editKey,
  currentValue: route.query.currentValue,
  editName: route.query.editName,
})

// 展示用的当前值（转换为“男/女/未知”）
const displayValue = ref('')

// 标签选择
const activeIds = ref<string[]>([])  // 存储选中的标签
const activeIndex = ref<number | string>(0)  // 当前激活的分类索引


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

// 页面加载时初始化展示值
onMounted(() => {
  if (editUser.value.editKey === 'gender') {
    displayValue.value = numberToGender(editUser.value.currentValue)
  }else if(editUser.value.editKey === 'tags'){
    try {
      // 尝试解析 JSON 字符串为数组
      const parsedTags = JSON.parse(editUser.value.currentValue)
      activeIds.value = Array.isArray(parsedTags) ? parsedTags : []
    } catch (e) {
      console.error('标签解析失败', e)
      activeIds.value = []
    }
  }
  else {
    displayValue.value = editUser.value.currentValue as string
  }
})

const onSubmit = async (values) => {
  let submitValue: any

  if (editUser.value.editKey === 'gender') {
    // 将“男/女”转为数字
    const genderNum = genderToNumber(submitValue)
    if (genderNum === null) {
      showFailToast('请选择正确的性别')
      return
    }
    submitValue = genderNum
  } else if (editUser.value.editKey === 'tags') {
    submitValue = JSON.stringify(activeIds.value)
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
    router.back()
  } else {
    showSuccessToast('修改失败')
  }
}
</script>

<style scoped></style>
