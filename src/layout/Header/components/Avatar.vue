<template>
  <el-dropdown @command="commandAction">
    <span class="el-dropdown-link">
      <el-avatar :size="30" class="avatar" :src="AvatarLogo" />
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item :command="1" divided>
          <el-icon><SwitchButton /></el-icon>退出登录</el-dropdown-item
        >
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts" setup>
  import { useRouter } from 'vue-router'
  import { ElMessage, ElMessageBox } from 'element-plus'

  import AvatarLogo from '@/assets/image/avatar.png'
  import { useStuStore } from '@/store/modules/student'
  import { useCopyMachineStore } from '@/store/modules/copyMachine'
  import { useAdminStore } from '@/store/modules/admin'
  import { useTagsViewStore } from '@/store/modules/tagsView'

  const router = useRouter()
  const stuStore = useStuStore()
  const copyMachineStore = useCopyMachineStore()
  const adminStore = useAdminStore()
  const TagsViewStore = useTagsViewStore()

  const logOut = async () => {
    ElMessageBox.confirm('您是否确认退出登录?', '温馨提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        if (stuStore.systemChoose != '') {
          await stuStore.clearStuInfo()
        } else if (copyMachineStore.systemChoose != '') {
          await copyMachineStore.clearCopyMachineInfo()
        } else if (adminStore.systemChoose != '') {
          await adminStore.clearAdminInfo()
        }
        await router.push({ path: '/login' })
        TagsViewStore.clearVisitedView()
        ElMessage({
          type: 'success',
          message: '退出登录成功！',
        })
      })
      .catch(() => {})
  }
  const commandAction = (key: number) => {
    switch (key) {
      case 1:
        logOut()
        break
    }
  }
</script>

<style lang="scss" scoped>
  .avatar {
    margin-right: 6px;
  }
  .el-dropdown-link {
    cursor: pointer;
    //color: var(--el-color-primary);
    display: flex;
    align-items: center;
  }
</style>
