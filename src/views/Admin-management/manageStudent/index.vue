<!-- eslint-disable prettier/prettier -->
<template>
  <div class="app-container">
    <div class="app-container-inner">
      <div v-if="adminStore.systemChoose != ''">
        <div class="header">
          <h2>学生列表</h2>
        </div>
        <div class="middle">
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
          <!-- 添加学生，批量添加，批量删除部分 -->
          <div class="edit">
            <el-button type="primary" @click="openAddStudentDialog">添加学生</el-button>
            <el-button type="primary" @click="openBatchAddDialog">批量添加</el-button>
            <el-button
              type="danger"
              @click="batchDeleteStudents"
              :disabled="selection.length === 0"
            >
              批量删除
            </el-button>
          </div>
        </div>
        <!-- 表格部分 -->
        <div class="table">
          <el-table
            :data="studentList"
            border
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column prop="studentAccount" label="学号" width="180" align="center" />
            <el-table-column prop="studentName" label="姓名" width="180" align="center" />
            <el-table-column prop="telephone" label="电话" align="center" />
            <el-table-column prop="wechat" label="微信号" align="center" />
            <el-table-column label="操作" align="center">
              <template #default="{ row }">
                <el-button type="primary" @click="resetPassword(row)">重置密码</el-button>
                <el-button type="danger" @click="deleteStudent(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pagination">
          <el-pagination
            background
            layout="total, prev, pager, next"
            :total="total"
            :page-size="pageSize"
            v-model:current-page="pageNum"
            @current-change="handlePageChange"
          />
        </div>
      </div>
      <div v-else>
        <Error />
      </div>

      <!-- 添加学生弹窗 -->
      <add-student-dialog
        :show="showAddStudentDialog"
        title="添加学生"
        field1-name="学号"
        field2-name="姓名"
        field1="studentAccount"
        field2="studentName"
        @update:show="showAddStudentDialog = $event"
        @submit="handleAddStudent"
      />

      <!-- 重置密码回显 -->
      <password-dialog
        :show="showPasswordDialog"
        :new-password="newPassword"
        @update:show="showPasswordDialog = $event"
        :account-info="selectedStudent"
        title="重置密码成功！"
      />
      <!-- 添加学生的密码回显 -->
      <password-dialog
        :show="showAddPasswordDialog"
        :new-password="addPassword"
        @update:show="showAddPasswordDialog = $event"
        title="添加成功！"
      />

      <!-- 批量添加学生弹窗 -->
      <el-dialog v-model="showBatchAddDialog" title="批量添加" width="500" @close="closeBatchDialog">
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
            <el-button @click="closeBatchDialog">取消</el-button>
            <el-button type="primary" @click="submitBatchFiles">确定</el-button>
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
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Search } from '@element-plus/icons-vue'
  import { onMounted, ref } from 'vue'
  import { ElMessageBox, ElMessage } from 'element-plus'
  import PasswordDialog from '@/admin-components/PasswordDialog.vue'
  import AddStudentDialog from '@/admin-components/AddStudentDialog.vue'
  import {
    addStudentAPI,
    fetchStudentsAPI,
    removeStudentAPI,
    resetStudentPasswordAPI,
    batchAddStudentAPI,
    downloadBatchFileAPI
  } from '../../../api/admin-student'
  import { useAdminStore } from '../../../store/modules/admin'
  import Error from '@/views/error/404.vue'

  const adminStore = useAdminStore()
  const searchInfo = ref('')
  const searchType = ref('studentAccount') // 新增搜索类型
  const studentList = ref([])
  const total = ref(0)
  const pageNum = ref(1) // 当前页码
  const pageSize = ref(8) // 默认每页显示条数

  // 获取学生列表
  const getStudentList = async () => {
    // 根据选择的类型，生成查询参数
    const searchParams = {
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      studentAccount: searchType.value === 'studentAccount' ? searchInfo.value : undefined,
      studentName: searchType.value === 'studentName' ? searchInfo.value : undefined,
    }

    try {
      // 调用 API
      const response = await fetchStudentsAPI(
        searchParams.pageNum,
        searchParams.pageSize,
        searchParams.studentAccount,
        searchParams.studentName,
      )

      studentList.value = response.studentList
      total.value = response.total
    } catch (error) {
      return
    }
  }

  // 监听分页变更事件
  const handlePageChange = async (newPage) => {
    pageNum.value = newPage
    await getStudentList()
  }

  // 查询按钮点击事件
  const onSubmit = async () => {
    pageNum.value = 1 // 搜索时从第一页开始
    await getStudentList()
  }

  onMounted(async () => {
    await getStudentList()
  })

  const resetPassword = async (row) => {
    try {
      await ElMessageBox.confirm(
        `确认重置学号为 ${row.studentAccount} 的学生的密码吗？`,
        '重置密码',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        },
      )
      newPassword.value = await resetStudentPasswordAPI(row.studentAccount)
      selectedStudent.value = row
      showPasswordDialog.value = true
    } catch (error) {
      return
    }
  }

  const deleteStudent = async (row) => {
    try {
      await ElMessageBox.confirm(
        `确认删除学号为 ${row.studentAccount} 的学生账户吗？`,
        '删除账户',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        },
      )
      const studentArray = [row.studentAccount]
      await removeStudentAPI(studentArray)
      ElMessage.success('删除成功')
      await getStudentList() // 删除后刷新列表
    } catch (error) {
      return
    }
  }

  // 批量删除
  const batchDeleteStudents = async () => {
    try {
      await ElMessageBox.confirm(`确认删除所选学生的账户吗？`, '批量删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
      const selectedAccounts = selection.value.map((row) => row.studentAccount)
      await removeStudentAPI(selectedAccounts)
      ElMessage.success('批量删除成功')
      getStudentList() // 批量删除后刷新列表
    } catch (error) {
      return
    }
  }

  // 表格复选框选择逻辑
  const selection = ref([])

  const handleSelectionChange = (selectedRows) => {
    selection.value = selectedRows
  }

  // 新密码弹窗相关逻辑
  const showPasswordDialog = ref(false)
  const newPassword = ref('')
  const selectedStudent = ref(null)

  // 添加学生逻辑
  const showAddStudentDialog = ref(false)
  const showAddPasswordDialog = ref(false)
  const addPassword = ref('')

  const openAddStudentDialog = () => {
    showAddStudentDialog.value = true
  }

  const handleAddStudent = async (form) => {
    try {
      const password = await addStudentAPI(form.studentAccount, form.studentName)
      getStudentList()
      addPassword.value = password
      showAddPasswordDialog.value = true
    } catch (err) {
      return
    }
  }

  // 批量添加学生逻辑
  const showBatchAddDialog = ref(false)
  const openBatchAddDialog = () => {
    showBatchAddDialog.value = true
  }
  const fileList = ref([])
  const submitBatchFiles = async () => {
    // console.log('批量添加的文件:', files)
    // 处理批量添加的逻辑
    // 封装为FromData对象
    if (fileList.value.length === 0) {
      ElMessage({
          message: "请先上传文件",
          type: 'error',
          plain: true,
        })
      return
    }
    const fromData = new FormData()
    fileList.value.forEach((val) => {
      fromData.append('file', val.raw)
    })
    let res = await batchAddStudentAPI(fromData)
    res = res.data
    if (res.code === 200) {
      ElMessage({
        message: res.msg,
        type: 'success',
        plain: true,
      })
      resultDialogVisible.value = true
      uploadResult.value.password = res.data.password
      uploadResult.value.existStu = res.data.existStu
    } else {
      ElMessage({
        message: res.msg,
        type: 'error',
        plain: true,
      })
    }
  }

  const resultDialogVisible = ref(false)
  const uploadResult = ref<{ password: string, existStu: string[] } | null>(null)

  // 下载模板的逻辑
  const downloadTemplate = async () => {
    try {
      const response = await downloadBatchFileAPI()
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download','批量添加模板.xlsx')// 替换为实际的文件名
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

    } catch (error) {
      console.error('Error downloading the template:', error)
    }
  }

  // 关闭对话框
  const closeBatchDialog = () => {
    showBatchAddDialog.value=false
    resetForm()
  }
  // 重置表单
  const resetForm = () => {
    fileList.value = []
  }
</script>

<style lang="scss">
  @import './index';

  .middle {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;

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

    .edit {
      display: flex; /* 使用 Flex 布局 */
      gap: 10px; /* 按钮之间的间隔 */
    }
  }

  .table {
    margin-top: 30px;
    margin-bottom: 20px;
    .el-table .cell {
      text-align: center; /* 设置单元格内容居中 */
    }
  }
  .pagination {
    display: flex;
    justify-content: flex-end; /* 将内容靠右对齐 */
    align-items: center; /* 垂直居中 */
  }
</style>
