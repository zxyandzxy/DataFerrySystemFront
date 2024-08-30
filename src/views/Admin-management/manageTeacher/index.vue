<template>
  <div class="app-container">
    <div class="app-container-inner">
      <div class="header">
        <div class="title">管理员列表</div>
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
        <el-table :data="adminStore.admins" border style="width: 100%">
          <el-table-column prop="id" label="账号" width="180" />
          <el-table-column prop="name" label="姓名" width="180" />
          <el-table-column prop="phone" label="电话" />
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
          :total="adminStore.admins.length"
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
  import { useAdminStore } from '@/store/modules/admin-teacherTable'
  import { ElMessageBox, ElMessage } from 'element-plus'
  import PasswordDialog from '@/admin-components/PasswordDialog.vue'
  import AddStudentDialog from '@/admin-components/AddStudentDialog.vue'

  const searchInfo = ref('')
  const adminStore = useAdminStore()
  const pageSize = ref(20)
  const showAddAdminDialog = ref(false)
  const showPasswordDialog = ref(false)
  const showAddPasswordDialog = ref(false)
  const newPassword = ref('')
  const addPassword = ref('')
  const selectedAdmin = ref(null)

  const onSubmit = () => {
    adminStore.searchAdmins(searchInfo.value)
  }

  const resetPassword = async (row) => {
    try {
      await ElMessageBox.confirm(`确认重置账号为 ${row.id} 的管理员的密码吗？`, '重置密码', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
      newPassword.value = Math.random().toString(36).slice(-8)
      selectedAdmin.value = row
      showPasswordDialog.value = true
    } catch (error) {
      console.log('重置密码取消')
    }
  }

  const deleteAdmin = async (row) => {
    try {
      await ElMessageBox.confirm(`确认删除账号为 ${row.id} 的管理员的账户吗？`, '删除账户', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
      await adminStore.removeAdminFromList(row.id)
      ElMessage.success('删除成功')
    } catch (error) {
      console.log('删除账户取消')
    }
  }

  const openAddAdminDialog = () => {
    showAddAdminDialog.value = true
  }

  const handleAddAdmin = (form) => {
    adminStore.addAdminToList(form)
    addPassword.value = Math.random().toString(36).slice(-8)
    showAddPasswordDialog.value = true
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
