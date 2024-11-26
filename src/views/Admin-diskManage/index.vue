<template>
  <div class="app-container">
    <div class="app-container-inner">
      <div v-if="adminStore.systemChoose != ''">
        <div class="header">
          <h2>学生空间管理</h2>
        </div>
        <!-- 搜索 -->
        <div class="search">
          <div class="search-type">
            <el-select v-model="searchType" placeholder="选择查询条件">
              <el-option label="学号" value="studentAccount"></el-option>
              <el-option label="姓名" value="studentName"></el-option>
            </el-select>
          </div>
          <el-input
            v-model="searchInfo"
            class="search-input"
            :placeholder="searchType === 'studentAccount' ? '按照学号查找' : '按照姓名查找'"
          />
          <el-button type="primary" @click="onSubmit" :icon="Search" class="search-button">
            查询
          </el-button>
        </div>
        <div class="table">
          <el-table :data="studentsSpace" border style="width: 100%">
            <el-table-column prop="studentAccount" label="学号" align="center" />
            <el-table-column prop="studentName" label="姓名" align="center" />
            <el-table-column label="已使用容量 (MB)" align="center">
              <template v-slot="scope"> {{ formatBytesToMB(scope.row.usedSpace) }} MB </template>
            </el-table-column>
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
      <div v-else>
        <Error />
      </div>
      <!-- 弹出窗口 -->
      <el-dialog
        title="文件管理"
        v-model="isDialogVisible"
        width="1400px"
        :before-close="handleDialogClose"
      >
        <!-- 搜索区域 -->
        <div class="file-search">
          <div class="search-type">
            <el-input
              v-model="searchFileName"
              placeholder="按照文件名模糊搜索"
              class="file-search-input"
            />
          </div>

          <!-- 时间区间选择 -->
          <div class="search-date">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="center"
              class="date-picker"
            />
          </div>

          <el-button type="primary" @click="onSearchFiles" :icon="Search" class="search-button">
            搜索
          </el-button>

          <el-checkbox
            v-model="fileSizeFlag"
            class="file-size-checkbox"
            style="margin-left: 20px"
            @change="checkBoxChange"
          >
            按照文件从大到小排序
          </el-checkbox>
        </div>

        <div class="table">
          <el-table :data="currentFiles" border style="width: 100%" height="400px">
            <!-- 设置表格高度 -->
            <el-table-column prop="fileName" label="文件名" align="center" />
            <el-table-column label="文件大小 (MB)" align="center">
              <template v-slot="scope"> {{ formatBytesToMB(scope.row.fileSize) }} MB </template>
            </el-table-column>
            <el-table-column
              prop="fileType"
              label="文件类型"
              align="center"
              :formatter="formatFileType"
            />
            <el-table-column
              prop="submissionTime"
              label="上传时间"
              align="center"
              :formatter="formatSubmissionTime"
            />
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
  import { Search } from '@element-plus/icons-vue'
  import { ref, onMounted } from 'vue'
  import { ElMessage } from 'element-plus'
  import {
    getAllStudentsSpaceAPI,
    viewStudentFilesAPI,
    deleteStudentFilesAPI,
  } from '@/api/admin-disk'
  import { useAdminStore } from '../../store/modules/admin'
  import Error from '@/views/error/404.vue'
  import { getFileAPI } from '../../api/admin-disk'

  const adminStore = useAdminStore()
  const studentsSpace = ref([])
  const currentFiles = ref([])
  const isDialogVisible = ref(false)
  const currentStudentAccount = ref('')

  const searchType = ref('studentAccount')
  const searchInfo = ref('')

  const totalStudents = ref(0) // 总学生数
  const pageSize = 8 // 每页显示条数
  const currentPage = ref(1) // 当前页

  // 文件分页相关
  const totalFiles = ref(0) // 总文件数
  const filePageSize = 6 // 每页显示文件条数
  const currentFilePage = ref(1) // 当前文件页

  const searchFileName = ref('') // 文件名搜索关键词
  const dateRange = ref([]) // 时间区间选择

  const fileSizeFlag = ref(false) // 控制是否显示文件大小

  // 将字节转换为MB
  const formatBytesToMB = (bytes) => {
    return (bytes / (1024 * 1024)).toFixed(2) // 保留两位小数
  }

  const formatFileType = (row) => {
    const fileTypeMap = {
      0: 'Docx',
      1: 'PDF',
      2: 'PPTX',
      3: 'ZIP',
      4: '其他',
    }
    return fileTypeMap[row.fileType] || '未知'
  }

  const formatSubmissionTime = (row: any, column: any, cellValue: string) => {
    if (cellValue) {
      return cellValue.replace('T', ' ')
    }
    return ''
  }

  // 查询事件
  const onSubmit = async () => {
    await getAllStudentsSpace()
  }

  // 获取学生空间数据
  const getAllStudentsSpace = async () => {
    const searchParams = {
      pageNum: currentPage.value,
      pageSize: pageSize,
      studentAccount: searchType.value === 'studentAccount' ? searchInfo.value : '',
      studentName: searchType.value === 'studentName' ? searchInfo.value : '',
    }
    try {
      const response = await getAllStudentsSpaceAPI(
        searchParams.pageNum,
        searchParams.pageSize,
        searchParams.studentAccount,
        searchParams.studentName,
      )
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
      await getStudentFiles() // 获取文件列表
      isDialogVisible.value = true
    } catch (error) {
      return
    }
  }

  // 获取学生文件数据
  // 获取文件列表的函数，加入文件名和时间区间搜索
  const getStudentFiles = async () => {
    try {
      let startDateParam
      let endDateParam

      if (dateRange.value != null && dateRange.value[0] != null && dateRange.value[1] != null) {
        startDateParam = new Date(dateRange.value[0]).getTime() // 开始时间转换为时间戳
        endDateParam = new Date(dateRange.value[1]).getTime() // 结束时间转换为时间戳
      }
      const response = await viewStudentFilesAPI(
        currentStudentAccount.value,
        currentFilePage.value,
        filePageSize,
        searchFileName.value !== undefined ? searchFileName.value : null,
        startDateParam !== undefined ? Math.floor(startDateParam / 1000) + '' : '',
        endDateParam !== undefined ? Math.floor(endDateParam / 1000) + '' : '',
        fileSizeFlag.value,
      )

      currentFiles.value = response.array // 获取学生文件列表
      totalFiles.value = response.total // 总文件数
    } catch (error) {}
  }

  const onSearchFiles = async () => {
    currentFilePage.value = 1
    await getStudentFiles() // 按条件搜索文件
  }

  // 下载文件
  const downloadFile = async (file) => {
    const response = await getFileAPI(file.upLoadId)
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', file.fileName) // 替换为实际的文件名
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // 删除文件
  const deleteFile = async (file) => {
    try {
      let res = await deleteStudentFilesAPI(currentStudentAccount.value, file.upLoadId)
      await getStudentFiles() // 重新获取文件列表
      if (res.data.code == 200) {
        ElMessage.success(`文件 ${file.fileName} 删除成功`)
      }
      await getAllStudentsSpace()
    } catch (error) {
      return
    }
  }

  // 处理分页
  const handlePageChange = async (page) => {
    currentPage.value = page
    await getAllStudentsSpace() // 根据页码获取学生数据
  }

  const handleFilePageChange = async (page) => {
    currentFilePage.value = page
    await getStudentFiles() // 根据页码获取学生文件数据
  }

  const resetSearchInfo = () => {
    searchFileName.value = '' // 清空文件名搜索
    dateRange.value = [null, null] // 清空时间区间
  }

  // 处理关闭弹窗事件
  const handleDialogClose = (done) => {
    resetSearchInfo() // 关闭前重置搜索信息
    done() // 调用done以关闭弹窗
  }

  const checkBoxChange = async () => {
    await getStudentFiles()
  }

  // 组件挂载时获取学生数据
  onMounted(async () => {
    await getAllStudentsSpace()
  })
</script>

<style scoped lang="scss">
  @import './index';
  .app-container {
    padding: 20px;
  }

  .header {
    margin-bottom: 20px;
  }

  .search {
    display: flex;
    .search-input {
      width: 500px;
    }
    .search-type {
      width: 160px;
      margin-right: 20px;
    }
    .search-button {
      margin-left: 20px;
    }
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

  .file-search {
    display: flex;
    .file-search-input {
      width: 400px;
      margin-right: 50px;
    }
    .search-date {
      margin-right: 20px;
    }
  }
</style>
