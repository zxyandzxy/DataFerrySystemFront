<template>
  <div class="app-container">
    <div class="app-container-inner">
      <h1>外网文件上传</h1>
      <div class="account-div">
        <el-form :model="studentForm" label-width="auto" style="margin-left: 20%">
          <el-form-item label="学号">
            <el-input
              v-model="studentForm.student_id"
              style="width: 500px"
              placeholder="请输入学号"
              clearable
            />
          </el-form-item>
          <el-form-item label="登录密码">
            <el-input
              v-model="studentForm.password"
              type="password"
              placeholder="请输入登录密码"
              clearable
            />
          </el-form-item>
        </el-form>
      </div>
      <el-upload
        style="margin-top: 3%"
        drag
        action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
        multiple
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text"> 将文件拖入此处 或者 <em>点击此处上传文件</em> </div>
        <template #tip>
          <div class="el-upload__tip"> 请注意自己的可用空间大小 </div>
        </template>
      </el-upload>
      <el-button style="color: blue; margin-left: 40%" size="large" :type="primary" text bg>
        上传（可联系管理员扩容）
      </el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref } from 'vue'
  import { UploadFilled } from '@element-plus/icons-vue'
  const studentForm = ref({
    student_id: '',
    password: '',
  })
</script>

<style scoped lang="scss">
  @import './index';
  .account-div {
    display: flex;
    justify-content: flex-start; /* 默认就是靠左，但为了明确可以写上 */
    align-items: center; /* 垂直居中 */
    margin-top: 2%;
  }
</style>
