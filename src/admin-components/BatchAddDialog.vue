<template>
  <el-dialog v-model="show" title="批量添加" width="500" @close="closeDialog">
    <div>
      <el-link type="primary" @click="downloadTemplate">下载批量添加模板</el-link>
    </div>
    <el-upload
      class="upload-demo"
      drag
      action="#" 
      :auto-upload="false"
      v-model:file-list="fileList"
      :limit="1"
      :show-file-list="true"
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
    <!-- 显示上传结果 -->
    <el-dialog v-model="resultDialogVisible" title="上传结果" width="400">
      <div v-if="uploadResult">
        <p><strong>初始化密码:</strong> {{ uploadResult.password }}</p>
        <p v-if="uploadResult.existStu.length > 0">
          <strong>已存在的学生学号:</strong>
          <ul>
            <li v-for="student in uploadResult.existStu" :key="student">{{ student }}</li>
          </ul>
        </p>
        <p v-else>所有学生账户都已成功创建。</p>
      </div>
      <template #footer>
        <el-button @click="resultDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { downloadBatchFileAPI } from '../api/admin-student'

const props = defineProps({
  show: Boolean,
})
const emit = defineEmits(['update:show', 'submit'])

const fileList = ref([])
const resultDialogVisible = ref(false)
const uploadResult = ref<{ password: string, existStu: string[] } | null>(null)

// 下载模板的逻辑
const downloadTemplate = async () => {
  try {
    const response = await downloadBatchFileAPI()
    ElMessage({
      message: '下载文件成功，请在浏览器的下载列表中查看.',
      type: 'success',
    })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download','批量添加模板.xlsx')// 替换为实际的文件名
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

  } catch (error) {
    console.error('下载文件失败，请重试', error)
  }
}

// 关闭对话框
const closeDialog = () => {
  emit('update:show', false)
  resetForm()
}

// 提交文件
const submitFiles = async () => {
  if (fileList.value.length == 0) {
    ElMessage.error('请先上传文件')
    return
  }
  emit('submit', fileList.value)
  closeDialog()
}

// 重置表单
const resetForm = () => {
  fileList.value = []
}
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
</style>
