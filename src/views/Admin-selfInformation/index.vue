<template>
  <div class="app-container">
    <div class="app-container-inner">
      <div class="profile-container">
        <div class="section">
          <div class="section-title">账户信息</div>
          <div class="section-content">
            <el-form :model="accountForm" label-width="80px">
              <el-form-item label="账号">
                <el-input v-model="accountForm.account" disabled />
              </el-form-item>
              <el-form-item label="姓名">
                <el-input v-model="accountForm.name" disabled />
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="section">
          <div class="section-title">联系方式</div>
          <div class="section-content">
            <el-form :model="contactForm" label-width="80px">
              <el-form-item label="手机号">
                <el-input v-model="contactForm.phone" :disabled="!editMode" />
              </el-form-item>
              <el-form-item label="微信号">
                <el-input v-model="contactForm.wechat" :disabled="!editMode" />
              </el-form-item>
            </el-form>
            <div class="edit-buttons">
              <el-button type="primary" @click="toggleEditMode">
                {{ editMode ? '保存' : '编辑' }}
              </el-button>
              <el-button v-if="editMode" @click="resetForm">取消</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import { ElForm, ElFormItem, ElInput, ElButton } from 'element-plus'

  // 初始化数据
  const accountForm = reactive({
    account: 'user123',
    name: '张三',
  })

  const contactForm = ref({
    phone: '13812345678',
    wechat: 'wechat123',
  })

  const editMode = ref(false)

  // 切换编辑模式
  const toggleEditMode = () => {
    if (editMode.value) {
      // 这里可以添加保存逻辑
    }
    editMode.value = !editMode.value
  }

  // 重置表单
  const resetForm = () => {
    contactForm.value = {
      phone: '13812345678',
      wechat: 'wechat123',
    }
    editMode.value = false
  }
</script>

<style scoped lang="scss">
  .profile-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }

  .section {
    margin-bottom: 20px;
  }

  .section-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .section-content {
    padding: 20px;
  }

  .edit-buttons {
    margin-top: 10px;
  }
</style>
