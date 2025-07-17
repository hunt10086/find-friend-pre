

<template>
{{title}}
  {{passage}}
</template>


<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getBlogGetOne } from '@/api/controller'
const route= useRoute()
const blogId = ref(Number(route.params.id))
const blog= ref()
const title= ref('')
const passage= ref('')
onMounted(async () => {
  const response = await getBlogGetOne({blogId : blogId.value})
  blog.value = response.data.data;
  console.log(blog.value)
  title.value = blog.value.title
  passage.value = blog.value.passage
})

</script>


<style scoped>

</style>
