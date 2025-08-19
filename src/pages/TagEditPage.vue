<template>
  <form action="/">
    <van-divider content-position="left">已选标签</van-divider>
    <div v-if="activeIds.length === 0">请选择标签</div>
    <van-tag color="#00FFFF"
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
  <div>
    <van-button type="primary" @click="submit">确认修改</van-button>
  </div>
  <div id="divbo"></div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getTeamMyTeam, getUserCurrent, postUserUpdate } from '@/api/controller'
import { showSuccessToast } from 'vant'

const router = useRouter()
//选中的标签
const activeIds = ref([])
const activeIndex = ref('')

onMounted(async () => {
  const res=await getUserCurrent();
  activeIds.value = JSON.parse(res.data.data.tags);
})


/**
 * 清除标签
 * @param tag
 */
const doClose = (tag) => {
  activeIds.value = activeIds.value.filter((item) => {
    return item !== tag
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
  {
    text: '编程',
    children: [
      { text: 'Java', id: 'Java' },
      { text: 'C++', id: 'C++' },
      { text: 'C', id: 'C' },
      { text: 'go', id: 'go' },
      { text: 'Python', id: 'Python' },
      { text: 'JavaScript', id: 'JavaScript' },
      { text: 'PHP', id: 'PHP' },
      { text: 'C#', id: 'C#' },
      { text: 'Swift', id: 'Swift' },
      { text: 'Rust', id: 'Rust' },
      { text: 'Go', id: 'Go' },
      { text: 'Kotlin', id: 'Kotlin' },
    ],
  },
  {
    text: '爱好',
    children: [
      { text: '羽毛球', id: '羽毛球' },
      { text: '篮球', id: '篮球' },
      { text: '足球', id: '足球' },
      { text: '排球', id: '排球' },
      { text: '乒乓球', id: '乒乓球' },
      { text: '游泳', id: '游泳' },
      { text: '跑步', id: '跑步' },
      { text: '健身', id: '健身' },
    ],
  },
  {
    text: '技术',
    children: [
      { text: 'SpringBoot', id: 'SpringBoot' },
      { text: 'Vue', id: 'Vue' },
      { text: 'React', id: 'React' },
      { text: 'Redis', id: 'Redis' },
      { text: 'Mybatis', id: 'Mybatis' },
      { text: 'Spring Cloud', id: 'Spring Cloud' },
      { text: 'Docker', id: 'Docker' },
      { text: 'Kubernetes', id: 'Kubernetes' },
      { text: 'Nginx', id: 'Nginx' },
      { text: 'Linux', id: 'Linux' },
      { text: 'Git', id: 'Git' },
      { text: 'MySQL', id: 'MySQL' },
      { text: 'MongoDB', id: 'MongoDB' },
      { text: 'Elasticsearch', id: 'Elasticsearch' },
      { text: 'Kafka', id: 'Kafka' },
      { text: 'RabbitMQ', id: 'RabbitMQ' },
      { text: 'Django', id: 'Django' },
      { text: 'Flask', id: 'Flask' },
      { text: 'Spring', id: 'Spring' },
      { text: 'Spring MVC', id: 'Spring MVC' },
      { text: 'Spring Security', id: 'Spring Security' },
    ],
  },
  {
    text: '性格',
    children: [
      { text: '开朗', id: '开朗' },
      { text: '内向', id: '内向' },
      { text: '外向', id: '外向' },
      { text: '活泼', id: '活泼' },
      { text: ' 谨慎', id: ' 谨慎' },
    ]
  }
]

let tagList = ref(originTagList)


const submit = async () => {
  const input = {
    tags: JSON.stringify(activeIds.value)
  }
  const res=await postUserUpdate(input);
  if(res.data.code===0){
    showSuccessToast('修改成功');
    router.push('/user')
  }else{
    showSuccessToast('修改失败');
  }
}

</script>

<style scoped>
.van-tag {
  margin: 10px;
}

#divbo{
  padding-bottom: 50px;
}
</style>
