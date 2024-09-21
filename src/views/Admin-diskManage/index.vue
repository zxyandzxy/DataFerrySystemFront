<template>
  <div>
    <div class="app-container">
      <div class="app-container-inner">
        <div class="header">
          <h2>学生空间管理</h2>
        </div>
        <div class="table">
          <el-table :data="studentsSpace" border style="width: 100%">
            <el-table-column prop="studentAccount" label="学号" align="center" />
            <el-table-column prop="studentName" label="姓名" align="center" />
            <el-table-column prop="usedSpace" label="已使用容量" align="center" />
            <el-table-column label="操作" align="center">
              <template #default="{ row }">
                <el-button type="primary" @click="manageStudent(row)">管理</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 分页组件 -->
        <div class="pagination">
          <el-pagination
            background
            layout="total, prev, pager, next"
            :total="totalStudents"
            :page-size="pageSize"
            @current-change="handlePageChange"
          />
        </div>
      </div>

      <!-- 弹出窗口 -->
      <el-dialog title="文件管理" v-model="isDialogVisible" width="1000px">
        <div class="table">
          <el-table :data="currentFiles" border style="width: 100%" height="400px">
            <!-- 设置表格高度 -->
            <el-table-column prop="fileName" label="文件名" align="center" />
            <el-table-column prop="fileSize" label="文件大小" align="center" />
            <el-table-column prop="fileType" label="文件类型" align="center" />
            <el-table-column prop="submissionTime" label="上传时间" align="center" />
            <el-table-column label="操作" align="center">
              <template #default="{ row }">
                <el-button type="primary" @click="downloadFile(row)">下载</el-button>
                <el-button type="danger" @click="deleteFile(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 文件分页组件 -->
        <div class="pagination">
          <el-pagination
            background
            layout="total, prev, pager, next"
            :total="totalFiles"
            :page-size="filePageSize"
            @current-change="handleFilePageChange"
          />
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { ElMessage } from 'element-plus'
  import {
    getAllStudentsSpaceAPI,
    viewStudentFilesAPI,
    deleteStudentFilesAPI,
  } from '@/api/admin-disk'

  const studentsSpace = ref([])
  const currentFiles = ref([])
  const isDialogVisible = ref(false)
  const currentStudentAccount = ref('')

  const totalStudents = ref(0) // 总学生数
  const pageSize = 8 // 每页显示条数
  const currentPage = ref(1) // 当前页

  // 文件分页相关
  const totalFiles = ref(0) // 总文件数
  const filePageSize = 6 // 每页显示文件条数
  const currentFilePage = ref(1) // 当前文件页

  // 获取学生空间数据
  const getAllStudentsSpace = async (pageNum) => {
    try {
      const response = await getAllStudentsSpaceAPI(pageNum, pageSize)
      studentsSpace.value = response.studentsSpace // 学生空间数据
      totalStudents.value = response.total // 总学生数
    } catch (error) {
      return
    }
  }

  // 获得某个学生的所有文件
  const manageStudent = async (row) => {
    try {
      currentStudentAccount.value = row.studentAccount
      await getStudentFiles(currentFilePage.value) // 获取文件列表
      isDialogVisible.value = true
    } catch (error) {
      return
    }
  }

  // 获取学生文件数据
  const getStudentFiles = async (pageNum) => {
    try {
      const response = await viewStudentFilesAPI(currentStudentAccount.value, pageNum, filePageSize)
      currentFiles.value = response.array // 获取学生文件列表
      totalFiles.value = response.total // 总文件数
    } catch (error) {
      ElMessage.error('获取学生文件数据失败')
    }
  }

  // 下载文件
  const downloadFile = (file) => {
    window.open(file.fileURL) // 通过文件的URL下载
    ElMessage.success(`文件 ${file.fileName} 正在下载`)
  }

  // 删除文件
  const deleteFile = async (file) => {
    try {
      await deleteStudentFilesAPI(currentStudentAccount.value, file.uploadId)
      await getStudentFiles(currentFilePage.value) // 重新获取文件列表
      ElMessage.success(`文件 ${file.fileName} 删除成功`)
    } catch (error) {
      return
    }
  }

  // 处理分页
  const handlePageChange = async (page) => {
    currentPage.value = page
    await getAllStudentsSpace(page) // 根据页码获取学生数据
  }

  const handleFilePageChange = async (page) => {
    currentFilePage.value = page
    await getStudentFiles(page) // 根据页码获取学生文件数据
  }

  // 组件挂载时获取学生数据
  onMounted(async () => {
    await getAllStudentsSpace(currentPage.value)
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
    margin-top: 10px;
    margin-bottom: 20px;
  }
  .pagination {
    display: flex;
    justify-content: flex-end; /* 将内容靠右对齐 */
    align-items: center; /* 垂直居中 */
  }
</style>
