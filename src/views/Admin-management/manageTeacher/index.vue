<template>
  <div class="app-container">
    <div class="app-container-inner">
      <div class="header">
        <h2>管理员列表</h2>
      </div>
      <div class="middle">
        <!-- 搜索 -->
        <div class="search">
          <el-input v-model="searchInfo" class="search-input" placeholder="按照账号查找" />
          <el-button type="primary" @click="onSubmit" :icon="Search" class="search-button"
            >查询</el-button
          >
        </div>
        <!-- 添加管理员部分 -->
        <div class="edit">
          <el-button type="primary" @click="openAddAdminDialog">添加管理员</el-button>
        </div>
      </div>
      <!-- 表格部分 -->
      <div class="table">
        <el-table :data="manageAdminStore.admins" border style="width: 100%">
          <el-table-column prop="adminAccount" label="账号" width="180" />
          <el-table-column prop="adminName" label="姓名" width="180" />
          <el-table-column prop="telephone" label="电话" />
          <el-table-column prop="wechat" label="微信" />
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button type="primary" @click="resetPassword(row)">重置密码</el-button>
              <el-button type="danger" @click="deleteAdmin(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="manageAdminStore.admins.length"
          :page-size="pageSize"
          @size-change="handlePageSizeChange"
        />
      </div>
    </div>
    <!-- 添加管理员弹窗 -->
    <add-student-dialog
      :show="showAddAdminDialog"
      title="添加管理员"
      field1-name="账号"
      field2-name="姓名"
      field1="adminAccount"
      field2="adminName"
      @update:show="showAddAdminDialog = $event"
      @submit="handleAddAdmin"
    />
    <!-- 重置密码弹窗 -->
    <password-dialog
      :show="showPasswordDialog"
      :new-password="newPassword"
      @update:show="showPasswordDialog = $event"
      :account-info="selectedAdmin"
      title="重置密码成功！"
    />
    <!-- 添加管理员密码回显 -->
    <password-dialog
      :show="showAddPasswordDialog"
      :new-password="addPassword"
      @update:show="showAddPasswordDialog = $event"
      title="添加成功！"
    />
  </div>
</template>

<script setup lang="ts">
  import { Search } from '@element-plus/icons-vue'
  import { ref } from 'vue'
  import { useManageAdminStore } from '@/store/modules/admin-teacherTable'
  import { ElMessageBox, ElMessage } from 'element-plus'
  import PasswordDialog from '@/admin-components/PasswordDialog.vue'
  import AddStudentDialog from '@/admin-components/AddStudentDialog.vue'

  const searchInfo = ref('')
  const manageAdminStore = useManageAdminStore()
  const pageSize = ref(20)
  const showAddAdminDialog = ref(false)
  const showPasswordDialog = ref(false)
  const showAddPasswordDialog = ref(false)
  const newPassword = ref('')
  const addPassword = ref('')
  const selectedAdmin = ref(null)

  const onSubmit = () => {
    manageAdminStore.searchAdmins(searchInfo.value)
  }

  const resetPassword = async (row) => {
    try {
      await ElMessageBox.confirm(
        `确认重置账号为 ${row.adminAccount} 的管理员的密码吗？`,
        '重置密码',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        },
      )
      newPassword.value = await manageAdminStore.resetPassword()
      selectedAdmin.value = row
      showPasswordDialog.value = true
    } catch (error) {
      console.log('重置密码取消')
    }
  }

  const deleteAdmin = async (row) => {
    try {
      await ElMessageBox.confirm(
        `确认删除账号为 ${row.adminAccount} 的管理员的账户吗？`,
        '删除账户',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        },
      )
      await manageAdminStore.removeAdminFromList(row.id)
      ElMessage.success('删除成功')
    } catch (error) {
      console.log('删除账户取消')
    }
  }

  const openAddAdminDialog = () => {
    showAddAdminDialog.value = true
  }

  // 处理添加管理员的函数
  const handleAddAdmin = async (form) => {
    try {
      // 调用 addAdminToList 函数，获取返回的密码
      const password = await manageAdminStore.addAdminToList(form.adminAccount, form.adminName)

      // 在这里直接使用返回的密码进行操作，例如显示密码对话框
      addPassword.value = password
      showAddPasswordDialog.value = true
    } catch (err) {
      // 这里可以处理特定的逻辑错误，或者不需要处理具体错误情况
      console.error('添加管理员失败', err)
    }
  }

  const handlePageSizeChange = (newSize) => {
    pageSize.value = newSize
  }
</script>

<style scoped lang="scss">
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
      display: flex;
      gap: 10px;
    }
  }

  .table {
    margin-top: 30px;
    margin-bottom: 20px;
  }

  .pagination {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
</style>
