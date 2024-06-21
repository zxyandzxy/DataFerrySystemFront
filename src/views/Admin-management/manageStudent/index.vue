<template>
  <div class="app-container">
    <div class="app-container-inner">
      <div class="header">
        <div class="title">学生列表</div>
      </div>
      <div class="middle">
        <!-- 搜索 -->
        <div class="search">
          <el-input v-model="searchInfo" class="search-input" placeholder="按照学号查找" />
          <el-button type="primary" @click="onSubmit" :icon="Search" class="search-button"
            >查询</el-button
          >
        </div>
        <!-- 添加学生，批量添加，批量删除部分 -->
        <div class="edit">
          <el-button type="primary" @click="openAddStudentDialog">添加学生</el-button>
          <el-button type="primary" @click="openBatchAddDialog">批量添加</el-button>
          <el-button type="danger" @click="batchDeleteStudents" :disabled="selection.length === 0"
            >批量删除</el-button
          >
        </div>
      </div>
      <!-- 表格部分 -->
      <div class="table">
        <el-table
          :data="studentStore.students"
          border
          style="width: 100%"
          :row-selection="selection"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column prop="id" label="学号" width="180" />
          <el-table-column prop="name" label="姓名" width="180" />
          <el-table-column prop="phone" label="电话" />
          <el-table-column prop="wechat" label="微信号" />
          <el-table-column label="操作">
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
          layout="prev, pager, next"
          :total="studentStore.students.length"
          :page-size="pageSize"
          @size-change="handlePageSizeChange"
        />
      </div>
    </div>
    <!-- 添加学生弹窗 -->
    <add-student-dialog
      :show="showAddStudentDialog"
      title="添加学生"
      field1-name="学号"
      field2-name="姓名"
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
  import { ref } from 'vue'
  import { useStudentStore } from '@/store/modules/admin-studentTable'
  import { ElMessageBox, ElMessage } from 'element-plus'
  import PasswordDialog from '@/admin-components/PasswordDialog.vue'
  import AddStudentDialog from '@/admin-components/AddStudentDialog.vue'
  import BatchAddDialog from '@/admin-components/BatchAddDialog.vue'

  const searchInfo = ref('')
  const studentStore = useStudentStore()

  const onSubmit = () => {
    // 查询逻辑
  }

  const resetPassword = async (row) => {
    try {
      const confirm = await ElMessageBox.confirm(
        `确认重置学号为 ${row.id} 的学生的密码吗？`,
        '重置密码',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        },
      )
      if (confirm === 'confirm') {
        // 这里模拟生成新密码的逻辑
        newPassword.value = Math.random().toString(36).slice(-8)
        selectedStudent.value = row // 将选中的学生信息存储在 selectedStudent 中
        showPasswordDialog.value = true
      }
    } catch (error) {
      console.log('重置密码取消')
    }
  }

  const deleteStudent = async (row) => {
    try {
      const confirm = await ElMessageBox.confirm(
        `确认删除学号为 ${row.id} 的学生的账户吗？`,
        '删除账户',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        },
      )
      if (confirm === 'confirm') {
        // 这里是删除账户的逻辑
        showPasswordDialog.value = true
      }
    } catch (error) {
      console.log('删除账户取消')
    }
  }

  const batchDeleteStudents = async () => {
    try {
      const confirm = await ElMessageBox.confirm(`确认删除所选学生的账户吗？`, '批量删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
      if (confirm === 'confirm') {
        // 删除选中的学生账户的逻辑
        const selectedIds = selection.value.map((row) => row.id)
        console.log('选中的学生id：', selectedIds)
        ElMessage.success('批量删除成功')
      }
    } catch (error) {
      console.log('批量删除取消')
    }
  }

  const tableData = studentStore.students

  // 表格复选框选择逻辑
  const selection = ref([])

  // 新密码弹窗相关逻辑
  const showPasswordDialog = ref(false)
  const newPassword = ref('')
  const selectedStudent = ref(null) // 用于存储选中的学生信息

  // 添加学生逻辑
  const showAddStudentDialog = ref(false)
  const showAddPasswordDialog = ref(false)
  const addPassword = ref('')

  const openAddStudentDialog = () => {
    showAddStudentDialog.value = true
  }
  const closeAddStudentDialog = () => {
    showAddStudentDialog.value = false
  }
  const handleAddStudent = (form) => {
    console.log('添加学生表单数据:', form)
    // 处理添加学生的逻辑
    addPassword.value = Math.random().toString(36).slice(-8)
    showAddPasswordDialog.value = true
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

  // 分页相关逻辑
  const pageSize = ref(20) // 默认每页显示条数
  const handlePageSizeChange = (newSize) => {
    pageSize.value = newSize
    // 可以在这里添加请求数据的逻辑，根据新的 pageSize 请求对应的数据
  }

  // 处理复选框选择事件
  const handleSelectionChange = (selectedRows) => {
    selection.value = selectedRows
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
        width: 700px;
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
  }
  .pagination {
    display: flex;
    justify-content: flex-end; /* 将内容靠右对齐 */
    align-items: center; /* 垂直居中 */
  }
</style>
