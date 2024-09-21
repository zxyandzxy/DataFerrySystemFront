<template>
  <div>
    <div class="app-container">
      <div class="app-container-inner">
        <h2>审批模式</h2>
        <el-card :shadow="false" class="card-content">
          <div class="card-inner">
            <p
              >当前审批模式:
              {{ systemConfigStore.currentConfig?.auditType == 0 ? '即时审批' : '定期审批' }}</p
            >
            <p
              >超前审批状态:
              {{ systemConfigStore.currentConfig?.advanceApproval == 0 ? '未开启' : '已开启' }}</p
            >
            <p v-if="systemConfigStore.currentConfig?.advanceApproval == 1" class="salt">
              盐值
              <el-tooltip content="盐值是用于加密的字符串">
                <el-icon style="margin-left: 5px; margin-right: 5px"><QuestionFilled /></el-icon>
              </el-tooltip>
              : {{ systemConfigStore.currentConfig?.saltValue }}
            </p>
            <el-button type="primary" @click="editMode">编辑</el-button>
          </div>
        </el-card>

        <!-- 审批模式编辑窗口 -->
        <el-dialog
          title="编辑审批模式"
          v-model="showModal"
          width="30%"
          :close-on-click-modal="false"
          :before-close="handleChangeClose"
        >
          <el-form :model="form" label-width="140px">
            <el-form-item label="当前审批状态">
              {{ systemConfigStore.currentConfig?.auditType == 0 ? '即时审批' : '定期审批' }}
            </el-form-item>
            <el-form-item label="切换审批模式">
              <el-select placeholder="请选择" v-model="form.auditType" style="width: 200px">
                <el-option
                  label="定期审批"
                  value="1"
                  v-if="systemConfigStore.currentConfig.auditType != 1"
                ></el-option>
                <el-option
                  label="即时审批"
                  value="0"
                  v-if="systemConfigStore.currentConfig.auditType != 0"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="form.auditType == 1" label="是否开启超前审批">
              <el-radio-group v-model="form.advancedApproval">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="form.advancedApproval == 1" label="盐值">
              <el-input v-model="form.saltValue" style="width: 200px">
                <template #suffix>
                  <el-tooltip content="盐值是用于加密的随机字符串">
                    <el-icon><QuestionFilled /></el-icon>
                  </el-tooltip>
                </template>
              </el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" style="text-align: right">
            <el-button @click="showModal = false">取消</el-button>
            <el-button type="primary" @click="saveChanges">确定</el-button>
          </div>
        </el-dialog>

        <!-- 身份验证窗口 -->
        <el-dialog
          title="身份验证"
          v-model="authDialogVisible"
          width="30%"
          :before-close="handleAuthClose"
        >
          <el-form :model="authForm" ref="authFormRef" :rules="authRules" label-width="80px">
            <el-form-item prop="password" label="密码">
              <el-input type="password" v-model="authForm.password"></el-input>
            </el-form-item>
            <el-form-item prop="confirmPassword" label="重复密码">
              <el-input type="password" v-model="authForm.confirmPassword"></el-input>
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="authDialogVisible = false">取消</el-button>
              <el-button type="primary" @click="submitAuth">确认</el-button>
            </span>
          </template>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import { ElMessage } from 'element-plus'
  import { useSystemConfigStore } from '../../store/modules/admin-systemConfig'
  import { switchAuditMode } from '../../api/admin-systemConfig'

  const systemConfigStore = useSystemConfigStore()

  const form = ref({
    auditType: '',
    advancedApproval: 0,
    saltValue: '',
  })

  // 身份校验
  const authDialogVisible = ref(false)
  const authFormRef = ref()
  const authForm = ref({
    password: '',
    confirmPassword: '',
  })

  const showModal = ref(false)

  const editMode = () => {
    showModal.value = true
  }

  const saveChanges = async () => {
    try {
      authDialogVisible.value = true
    } catch (error) {
      ElMessage.error(`保存配置失败: ${error.message}`)
    }
  }

  const validatePassword = (rule, value, callback) => {
    if (value === authForm.value.password) {
      callback()
    } else {
      callback(new Error('两次输入的密码不一致'))
    }
  }

  const authRules = {
    password: [{ required: true, message: '此处不能为空', trigger: 'blur' }],
    confirmPassword: [
      { required: true, message: '此处不能为空', trigger: 'blur' },
      { validator: validatePassword, trigger: 'blur' },
    ],
  }

  const handleChangeClose = (done) => {
    form.value = {
      auditType: '',
      advancedApproval: 0,
      saltValue: '',
    }
    authForm.value = {
      password: '',
      confirmPassword: '',
    }
    done()
  }
  const handleAuthClose = (done) => {
    // 可以在这里提示用户未完成验证或直接关闭
    ElMessage.warning('请完成身份验证')
    authForm.value = {
      password: '',
      confirmPassword: '',
    }
    done()
  }

  const submitAuth = async () => {
    authFormRef.value.validate(async (valid) => {
      if (valid) {
        // 调用切换审批模式的API
        await switchAuditMode(
          Number(form.value.auditType),
          form.value.advancedApproval,
          form.value.saltValue,
          authForm.value.password,
        )
        await systemConfigStore.fetchSystemConfig()
        ElMessage.success('修改成功')
        // 验证成功后执行保存操作或关闭身份验证对话框
        await saveChanges()
        form.value = {
          auditType: '',
          advancedApproval: 0,
          saltValue: '',
        }
        authForm.value = {
          password: '',
          confirmPassword: '',
        }
        authDialogVisible.value = false
        showModal.value = false
      } else {
        return false
      }
    })
  }
</script>

<style scoped lang="scss">
  .card-content {
    border: none;
    text-align: center;
  }

  .card-inner {
    text-align: left;
  }
  .salt {
    display: flex;
    align-items: center;
  }
  .el-form-item__content {
    text-align: left;
  }
</style>
