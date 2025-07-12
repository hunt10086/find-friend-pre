<template>
  <form action="/">
    <van-search
      v-model="searchText"
      show-action
      placeholder="请输入搜索的标签"
      @search="onSearch"
      @cancel="onCancel"
    />
    <van-divider content-position="left">已选标签</van-divider>
    <div v-if="activeIds.length === 0">请选择标签</div>
    <van-tag
      v-for="tag in activeIds"
      padding="16px"
      closeable
      size="medium"
      type="primary"
      @close="doClose(tag)"
    >
      {{ tag }}
    </van-tag>

    <van-divider content-position="left">选择标签</van-divider>

    <van-tree-select
      v-model:active-id="activeIds"
      v-model:main-active-index="activeIndex"
      :items="tagList"
    />
  </form>
  <div style="padding: 16px">
    <van-button block type="primary" @click="doSearchResult">搜索用户</van-button>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const searchText = ref('')
const onSearch = (val) => {
  tagList.value = originTagList.map((parentTag) => {
    const tempChildren = [...parentTag.children]
    const tempParentTag = { ...parentTag }
    tempParentTag.children = tempChildren.filter((item) => item.text.includes(searchText.value))
    return tempParentTag
  })
}
const onCancel = () => {
  searchText.value = ''
  tagList.value = originTagList
}
//选中的标签
const activeIds = ref([])
const activeIndex = ref('')

/**
 * 清除标签
 * @param tag
 */
const doClose = (tag) => {
  activeIds.value = activeIds.value.filter((item) => {
    return item !== tag
  })
}

/**
 * 搜索跳转
 */
const doSearchResult = () => {
  router.push({
    path: 'user/list',
    query: {
      tag: activeIds.value,
    },
  })
}
const originTagList = [
  {
    text: '性别',
    children: [
      { text: '女', id: '女' },
      { text: '男', id: '男' },
    ],
  },
  {
    text: '年级',
    children: [
      { text: '大一', id: '大一' },
      { text: '大二', id: '大二' },
      { text: '大三', id: '大三' },
      { text: '大四', id: '大四' },
      { text: '研一', id: '研一' },
      { text: '研二', id: '研二' },
      { text: '研三', id: '研三' },
    ],
  },
]

let tagList = ref(originTagList)
</script>

<style scoped>
.van-tag {
  margin: 10px;
}
</style>
