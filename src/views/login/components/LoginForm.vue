<template>
  <el-form
    v-if="systemChoose == '学生端' || systemChoose == '管理员端'"
    ref="ruleFormRef"
    :model="ruleForm"
    :rules="rules"
    label-width="0"
  >
    <el-form-item label="" prop="username">
      <el-input
        placeholder="请输入账号"
        autoComplete="on"
        style="position: relative"
        v-model="ruleForm.username"
        @keyup.enter.native="submitForm(ruleFormRef)"
      >
        <template #prefix>
          <el-icon class="el-input__icon"><UserFilled /></el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="" prop="password">
      <el-input
        placeholder="请输入密码"
        autoComplete="on"
        @keyup.enter.native="submitForm(ruleFormRef)"
        v-model="ruleForm.password"
        :type="passwordType"
      >
        <template #prefix>
          <el-icon class="el-input__icon"><GoodsFilled /></el-icon>
        </template>
        <template #suffix>
          <div class="show-pwd" @click="showPwd"
            ><svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
          /></div>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="" prop="verificationCode">
      <div style="display: flex; justify-content: space-between">
        <el-input
          placeholder="请输入验证码"
          autoComplete="on"
          style="position: relative"
          v-model="ruleForm.verificationCode"
          @keyup.enter.native="submitForm(ruleFormRef)"
        >
          <template #prefix>
            <el-icon class="el-input__icon"><Stamp /></el-icon>
          </template>
        </el-input>
        <img :id="verImgId" :width="130" :height="48" :src="verImgSrc" alt="Verification Image" />
        <el-button @click="fetchVerificationImage">刷新</el-button>
      </div>
    </el-form-item>
    <el-form-item style="width: 100%">
      <el-button class="login-btn" type="primary" @click="submitForm(ruleFormRef)">登录</el-button>
    </el-form-item>
  </el-form>
  <el-form
    v-if="systemChoose == '拷贝机端'"
    ref="ruleFormRef"
    :model="ruleForm"
    :rules="rules"
    label-width="0"
  >
    <el-form-item style="width: 100%">
      <el-button class="login-btn" type="primary" @click="submitForm(ruleFormRef)">登录</el-button>
    </el-form-item>
  </el-form>
</template>
<script lang="ts" setup>
  import { ref, reactive, defineProps, onMounted } from 'vue'
  import type { FormInstance } from 'element-plus'
  import { ElNotification } from 'element-plus'
  import { useRouter } from 'vue-router'
  import { useStuStore } from '@/store/modules/student'
  import { useAdminStore } from '@/store/modules/admin'
  import { useCopyMachineStore } from '@/store/modules/copyMachine'
  import { getTimeState } from '@/utils/index'
  import { stuGetCaptchaAPI } from '@/api/stuAccountManagement'
  import { useAdminStore } from '../../../store/modules/admin'
  const ruleFormRef = ref<FormInstance>()
  const router = useRouter()
  const stuStore = useStuStore()
  const adminStore = useAdminStore()
  const copyMachineStore = useCopyMachineStore()
  const verImgSrc = ref('')
  const verImgId = 'verImg'
  const adminStore = useAdminStore()

  const fetchVerificationImage = async () => {
    // 获取验证码
    let res = await stuGetCaptchaAPI()
    res = res.data
    if (res.code == 200) {
      ruleForm.verKey = res.data.key
      verImgSrc.value = res.data.image
    }
  }

  const passwordType = ref('password')
  // const loading = ref(false)
  const rules = reactive({
    verificationCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  })
  // 表单数据
  const ruleForm = reactive({
    username: '',
    password: '',
    verificationCode: '',
    verKey: '',
  })

  const showPwd = () => {
    if (passwordType.value === 'password') {
      passwordType.value = ''
    } else {
      passwordType.value = 'password'
    }
  }

  const props = defineProps({
    systemChoose: {
      type: String,
      default: '',
    },
  })
  const submitForm = (formEl: FormInstance | undefined) => {
    // loading.value = true
    if (!formEl) return
    formEl.validate((valid) => {
      if (valid) {
        // 登录
        setTimeout(async () => {
          if (props.systemChoose === '学生端') {
            await stuStore.login(ruleForm, props.systemChoose)
          } else if (props.systemChoose === '拷贝机端') {
            await copyMachineStore.login(props.systemChoose)
          } else if (props.systemChoose === '管理员端') {
            await adminStore.login(ruleForm, props.systemChoose)
          }
          console.log('va')

          // 登录成功后跳转
          await router.push({
            path: '/',
          })
          ElNotification({
            title: getTimeState(),
            message: '欢迎登录数据摆渡系统',
            type: 'success',
            duration: 3000,
          })
          // loading.value = false
        }, 1000)
      } else {
        console.log('not va')

        ElNotification({
          message: '账号/密码错误，请重试',
          type: 'error',
          duration: 3000,
        })
        // loading.value = false
        return false
      }
    })
  }
  onMounted(async () => {
    await fetchVerificationImage()
  })
</script>

<style lang="scss" scoped>
  @import '../index.scss';
</style>
