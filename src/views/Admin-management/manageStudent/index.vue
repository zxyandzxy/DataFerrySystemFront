<template>
  <div class="app-container">
    <div class="app-container-inner">
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
          <el-button type="danger" @click="batchDeleteStudents" :disabled="selection.length === 0">
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
          @size-change="handlePageSizeChange"
          @current-change="handlePageChange"
        />
      </div>
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
    <batch-add-dialog
      :show="showBatchAddDialog"
      @update:show="showBatchAddDialog = $event"
      @submit="handleBatchAdd"
    />
  </div>
</template>

<script setup lang="ts">
  import { Search } from '@element-plus/icons-vue'
  import { onMounted, ref } from 'vue'
  import { ElMessageBox, ElMessage } from 'element-plus'
  import PasswordDialog from '@/admin-components/PasswordDialog.vue'
  import AddStudentDialog from '@/admin-components/AddStudentDialog.vue'
  import BatchAddDialog from '@/admin-components/BatchAddDialog.vue'
  import {
    addStudentAPI,
    fetchStudentsAPI,
    removeStudentAPI,
    resetStudentPasswordAPI,
  } from '../../../api/admin-student'

  const searchInfo = ref('')
  const searchType = ref('studentAccount') // 新增搜索类型
  const studentList = ref([])
  const total = ref(0)
  const pageNum = ref(1) // 当前页码
  const pageSize = ref(10) // 默认每页显示条数

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
      console.error('获取学生列表失败', error)
    }
  }

  // 监听分页变更事件
  const handlePageSizeChange = (newSize) => {
    pageSize.value = newSize
    getStudentList()
  }

  const handlePageChange = (newPage) => {
    pageNum.value = newPage
    getStudentList()
  }

  // 查询按钮点击事件
  const onSubmit = () => {
    pageNum.value = 1 // 搜索时从第一页开始
    getStudentList()
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
      console.log('重置密码取消')
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
      getStudentList() // 删除后刷新列表
    } catch (error) {
      console.log('删除账户取消')
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
      console.log('批量删除取消')
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
      console.log(password)

      addPassword.value = password
      showAddPasswordDialog.value = true
    } catch (err) {
      console.error('添加学生失败', err)
    }
  }

  // 批量添加学生逻辑
  const showBatchAddDialog = ref(false)
  const openBatchAddDialog = () => {
    showBatchAddDialog.value = true
  }

  const handleBatchAdd = (files) => {
    console.log('批量添加的文件:', files)
    // 处理批量添加的逻辑
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
