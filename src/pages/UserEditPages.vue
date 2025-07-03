<template>
  <div>
  <van-form @submit="onSubmit">
    <van-cell-group inset>
      <van-field
        v-model="editUser.currentValue"
        :name="editUser.editKey"
        :label="editUser.editName"
        :placeholder="`请输入 ${editUser.editName}`"
      />
    </van-cell-group>
    <div style="margin: 16px">
      <van-button round block type="primary" native-type="submit"> 提交 </van-button>
    </div>
  </van-form>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { postUserUpdate } from '@/api/controller'
import { showSuccessToast } from 'vant'
import router from '@/config/router.ts'

const route = useRoute()
console.log(route.query)
const editUser = ref({
  editKey: route.query.editKey,
  currentValue: route.query.currentValue,
  editName: route.query.editName,
})

const onSubmit = async (values) => {
  const input = {
    [editUser.value.editKey]: values[editUser.value.editKey],
  }
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  const res=await postUserUpdate(input,config);
  if(res.data.code===0){
    showSuccessToast('修改成功');
    router.back();
  }else {

    showSuccessToast('修改失败');
  }

}
</script>

<style scoped></style>
