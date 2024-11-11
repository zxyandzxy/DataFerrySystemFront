<template>
  <div class="app-container">
    <div class="app-container-inner">
      <div v-if="copyMachineStore.systemChoose != ''">
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
          class="upload-demo"
          drag
          style="margin-top: 3%"
          v-model:file-list="fileList"
          action="#"
          :auto-upload="false"
          :limit="1"
          :show-file-list="true"
          list-type="text"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text"> 将文件拖入此处 或者 <em>点击此处上传文件</em> </div>
          <template #tip>
            <div class="el-upload__tip"> 请注意上传的文件大小，过大的上传文件将被管理员删除 </div>
          </template>
        </el-upload>
        <el-button
          style="color: blue; margin-left: 40%"
          size="large"
          :type="success"
          text
          bg
          @click="uploadFile"
        >
          上传(请使用英文命名文件，否则将无法在内网机器中下载)
        </el-button>
      </div>
      <div v-else>
        <Error></Error>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref } from 'vue'
  import { ElMessage } from 'element-plus'
  import { UploadFilled } from '@element-plus/icons-vue'
  import { uploadFileAPI } from '@/api/studentFileProcessing'
  import { useCopyMachineStore } from '@/store/modules/copyMachine'
  import Error from '@/views/error/404.vue'
  const copyMachineStore = useCopyMachineStore()
  const studentForm = ref({
    student_id: '',
    password: '',
  })

  //定义一个响应式数组用来接收文件
  const fileList = ref([])

  // 参考教程：https://blog.csdn.net/2303_79263957/article/details/134972691
  const uploadFile = async () => {
    if (fileList.value.length > 0) {
      // 封装为FromData对象
      const fromData = new FormData()
      fileList.value.forEach((val) => {
        fromData.append('file', val.raw)
      })
      fromData.append('studentId', studentForm.value.student_id)
      fromData.append('password', studentForm.value.password)
      let res = await uploadFileAPI(fromData)
      res = res.data
      if (res.code === 200) {
        ElMessage({
          message: res.msg,
          type: 'success',
          plain: true,
        })
      } else {
        ElMessage({
          message: res.msg,
          type: 'error',
          plain: true,
        })
      }
    }
  }
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
