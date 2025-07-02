<template>
  <van-card
    v-for="user in userList"
    :desc="user.profile"
    :title="`${user.userName}   编号:${user.id} `"
    :thumb="user.avatarUrl"
  >
    <template #tags>
      <van-tag plain type="warning" v-for="tag in user.tags">
        {{ tag }}
      </van-tag>
    </template>
    <template #footer>
      <van-button size="mini">联系我</van-button>
    </template>
  </van-card>
</template>

<script setup >
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import myAxios from '../plugins/myAxios'
import qs from 'qs'
const route = useRoute()
const tags  = route.query
const userList = ref([])
// onMounted(async () => {
//
//    const response= await myAxios.get('user/search/tags', {
//     params: {
//       tagsList: tags.tag // 假设 tags.tag 是数组 ['女', '大二']
//     },
//     paramsSerializer: params => {
//       const tagValues = params.tagsList;
//       if (Array.isArray(tagValues)) {
//         return tagValues.map(value => `tagsList=${encodeURIComponent(value)}`).join('&');
//       }
//       return `tagsList=${encodeURIComponent(tagValues)}`;
//     }
//   })
//   response.data.data.forEach(user => {
//     user.tags = JSON.parse(user.tags)
//   })
//   userList.value= response.data.data||[]
// })
onMounted(async () => {
  try {
    const response = await myAxios.get('user/search/tags', {
      params: {
        tagsList: tags.tag // 假设 tags.tag 是数组 ['女', '大二']
      },
      paramsSerializer: params => {
        const tagValues = params.tagsList;
        if (Array.isArray(tagValues)) {
          return tagValues.map(value => `tagsList=${encodeURIComponent(value)}`).join('&');
        }
        return `tagsList=${encodeURIComponent(tagValues)}`;
      }
    });

    response.data.data.forEach(user => {
      user.tags = JSON.parse(user.tags);
    });

    userList.value = response.data.data || [];
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
});


</script>


<style scoped>
.van-tag {
  margin-right: 8px;
}
</style>
