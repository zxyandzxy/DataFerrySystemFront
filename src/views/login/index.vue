<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-left">
        <img src="@/assets/image/login/side-logo.png" />
      </div>
      <div class="login-form">
        <div class="login-title">
          <img class="icon" src="@/assets/logo.png" alt="logo" />
          <h2 class="title">数据摆渡系统</h2>
          <el-select
            v-model="systemChoose"
            placeholder="登录系统"
            style="width: 120px"
            @change="handleChange"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <LoginForm :systemChoose="systemChoose" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useAdminStore } from '../../store/modules/admin'
  import { useCopyMachineStore } from '../../store/modules/copyMachine'
  import { useStuStore } from '../../store/modules/student'
  import LoginForm from './components/LoginForm.vue'
  import { ref } from 'vue'

  const systemChoose = ref('学生端')
  const studentStore = useStuStore()
  const adminStore = useAdminStore()
  const copyStore = useCopyMachineStore()

  const options = [
    {
      value: '学生端',
      label: '学生端',
    },
    {
      value: '拷贝机端',
      label: '拷贝机端',
    },
    {
      value: '管理员端',
      label: '管理员端',
    },
  ]
  const handleChange = () => {
    if (systemChoose.value == '学生端') {
      adminStore.clearAdminInfo()
      copyStore.clearCopyMachineInfo()
    } else if (systemChoose.value == '管理端') {
      studentStore.clearStuInfo()
      copyStore.clearCopyMachineInfo()
    } else {
      adminStore.clearAdminInfo()
      studentStore.clearStuInfo()
    }
  }
</script>
<style lang="scss" scoped>
  @import './index';
</style>
