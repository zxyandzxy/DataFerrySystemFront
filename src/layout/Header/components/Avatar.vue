<template>
  <el-dropdown @command="commandAction">
    <span class="el-dropdown-link">
      <el-avatar :size="30" class="avatar" :src="AvatarLogo" />
      {{ userInfo.username }}
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
  import { computed, ref } from 'vue'

  import AvatarLogo from '@/assets/image/avatar.png'
  import { useUserStore } from '@/store/modules/user'
  import { useTagsViewStore } from '@/store/modules/tagsView'

  const router = useRouter()
  const UserStore = useUserStore()
  const TagsViewStore = useTagsViewStore()

  // 用户信息
  const userInfo = computed(() => UserStore.userInfo)

  const logOut = async () => {
    ElMessageBox.confirm('您是否确认退出登录?', '温馨提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        await UserStore.logout()
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
