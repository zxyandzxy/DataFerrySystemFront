<template>
  <el-dialog v-model="show" :title="title" width="500" @close="closeDialog">
    <span>新密码：{{ newPassword }}</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="copyNewPassword">一键复制</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { ref, defineProps, defineEmits } from 'vue'
  import { ElMessage } from 'element-plus'

  const props = defineProps({
    show: Boolean,
    newPassword: String,
    accountInfo: Object, // 接收账号信息
    title: String, //弹窗标题
  })

  const emit = defineEmits(['update:show'])

  const closeDialog = () => {
    emit('update:show', false)
  }

  const copyNewPassword = () => {
    const textarea = document.createElement('textarea')
    textarea.value = props.newPassword
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    ElMessage.success('复制成功')
  }
</script>
