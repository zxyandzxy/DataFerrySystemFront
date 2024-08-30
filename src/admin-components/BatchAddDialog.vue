<template>
  <el-dialog v-model="show" title="批量添加" width="500" @close="closeDialog">
    <div>
      <el-link type="primary" @click="downloadTemplate">下载批量添加模板</el-link>
    </div>
    <el-upload
      class="upload-demo"
      drag
      action="https://jsonplaceholder.typicode.com/posts/"
      multiple
      :on-success="handleUploadSuccess"
      :file-list="fileList"
    >
      <el-icon size="35"><UploadFilled /></el-icon>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">请上传 .xlsx 文件</div>
    </el-upload>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="submitFiles">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { ElMessage } from 'element-plus'

  const props = defineProps({
    show: Boolean,
  })
  const emit = defineEmits(['update:show', 'submit'])

  const fileList = ref([])

  const downloadTemplate = () => {
    // 下载模板文件的逻辑
    const link = document.createElement('a')
    link.href = '/path-to-your-template-file.xlsx' // 替换为你的模板文件路径
    link.download = '批量添加模板.xlsx'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleUploadSuccess = (response, file, fileList) => {
    ElMessage.success('上传成功')
    console.log('上传成功的文件:', file, fileList)
  }

  const closeDialog = () => {
    emit('update:show', false)
    resetForm()
  }

  const submitFiles = () => {
    if (fileList.value.length === 0) {
      ElMessage.error('请先上传文件')
      return
    }
    emit('submit', fileList.value)
    closeDialog()
  }

  const resetForm = () => {
    fileList.value = []
  }
</script>

<style scoped>
  .dialog-footer {
    text-align: right;
  }
</style>
