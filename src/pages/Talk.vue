<script setup lang="ts">

import { useRouter } from 'vue-router'
import { showFailToast } from 'vant'

const router = useRouter()
showFailToast("功能未开发  敬请期待")
router.push('/')
</script>

<template>

</template>

<style scoped>

</style>
