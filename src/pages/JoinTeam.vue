

<template>
  <van-empty v-if="flag" description="还没有加入的队伍" />
  <div v-if="flag">

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const flag=ref(false);
</script>

<style scoped>

</style>
