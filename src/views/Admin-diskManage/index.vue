<template>
  <div class="app-container">
    <div class="app-container-inner">
      <div class="header">
        <div class="title">学生磁盘管理</div>
      </div>
      <div class="table">
        <el-table :data="students" border style="width: 100%">
          <el-table-column prop="name" label="学生姓名" align="center" />
          <el-table-column prop="studentId" label="学号" align="center" />
          <el-table-column prop="diskSize" label="磁盘容量" align="center" />
          <el-table-column label="操作" align="center">
            <template #default="{ row }">
              <el-button type="primary" @click="manageStudent(row)">管理</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 弹出窗口 -->
    <el-dialog title="文件管理" v-model="isDialogVisible" width="1000px">
      <div class="table">
        <el-table :data="currentFiles" border style="width: 100%">
          <el-table-column prop="fileName" label="文件名" align="center" />
          <el-table-column prop="fileSize" label="文件大小" align="center" />
          <el-table-column prop="fileType" label="文件类型" align="center" />
          <el-table-column prop="uploadTime" label="上传时间" align="center" />
          <el-table-column label="操作" align="center">
            <template #default="{ row }">
              <el-button type="primary" @click="downloadFile(row)">下载</el-button>
              <el-button
                type="danger"
                @click="deleteFile(row)"
                :disabled="!canDeleteFile(row.uploadTime)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { ElMessage } from 'element-plus'
  import dayjs from 'dayjs'

  // 模拟的学生和文件数据
  const students = ref([
    { name: '学生1', studentId: '20240101', diskSize: '10GB' },
    { name: '学生2', studentId: '20240102', diskSize: '20GB' },
    { name: '学生3', studentId: '20240103', diskSize: '30GB' },
  ])

  const files = {
    '20240101': [
      { fileName: '文件1', fileSize: '1GB', fileType: 'PDF', uploadTime: '2023-01-01' },
      { fileName: '文件2', fileSize: '2GB', fileType: 'DOC', uploadTime: '2023-07-01' },
    ],
    '20240102': [
      { fileName: '文件3', fileSize: '3GB', fileType: 'JPG', uploadTime: '2022-01-01' },
      { fileName: '文件4', fileSize: '4GB', fileType: 'PNG', uploadTime: '2023-01-15' },
    ],
    '20240103': [
      { fileName: '文件5', fileSize: '5GB', fileType: 'TXT', uploadTime: '2021-12-01' },
      { fileName: '文件6', fileSize: '6GB', fileType: 'MP4', uploadTime: '2023-03-20' },
    ],
  }

  const isDialogVisible = ref(false)
  const currentFiles = ref([])

  const manageStudent = (row) => {
    currentFiles.value = files[row.studentId] || []
    isDialogVisible.value = true
  }

  const downloadFile = (file) => {
    ElMessage.success(`文件 ${file.fileName} 正在下载`)
  }

  const deleteFile = (file) => {
    if (canDeleteFile(file.uploadTime)) {
      ElMessage.success(`文件 ${file.fileName} 已删除`)
      // 从currentFiles中移除文件
      currentFiles.value = currentFiles.value.filter((f) => f.fileName !== file.fileName)
    } else {
      ElMessage.error('文件没超过6个月，无法删除')
    }
  }

  const canDeleteFile = (uploadTime) => {
    const uploadDate = dayjs(uploadTime)

    const currentDate = dayjs()
    // 超过6个月即可删除，否则不可删除
    return currentDate.diff(uploadDate, 'month') >= 6
  }

  onMounted(() => {
    // 这里可以添加初始化逻辑，例如从服务器获取学生和文件数据
  })
</script>

<style scoped lang="scss">
  .app-container {
    padding: 20px;
  }

  .header {
    margin-bottom: 20px;
  }

  .table {
    margin-top: 30px;
  }

  .form-item {
    margin-bottom: 20px;
    display: flex;
    align-items: center;

    label {
      width: 100px;
    }

    .el-input {
      flex: 1;
    }

    .el-button {
      margin-left: 20px;
    }
  }
</style>
