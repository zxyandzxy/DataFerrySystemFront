<template>
  <template v-if="!item.hidden">
    <template v-if="!item.alwaysShow && hasOneShowingChild(item.children, item)">
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)">
          <el-icon :size="20">
            <!-- {{ onlyOneChild?.meta.icon }} -->
            <component :is="onlyOneChild?.meta.icon"></component>
          </el-icon>
          <template #title>{{ onlyOneChild.meta && onlyOneChild.meta.title }}</template>
        </el-menu-item>
      </app-link>
    </template>
    <el-sub-menu :index="resolvePath(item.path)" v-else popper-append-to-body>
      <template #title>
        <el-icon :size="20"> <component :is="item.meta?.icon"></component></el-icon>
        <span>{{ item.meta && item.meta.title }}</span>
      </template>
      <sub-item
        v-for="child in item.children"
        :key="child.path"
        :item="child"
        :base-path="resolvePath(child.path)"
      />
    </el-sub-menu>
  </template>
</template>

<script lang="ts" setup>
  import { isExternal } from '@/utils/validate.js'
  import AppLink from './Link.vue'
  import path from 'path-browserify'
  import { ref, computed, onMounted } from 'vue'
  import { useAdminStore } from '@/store/modules/admin'

  const adminStore = useAdminStore()

  const props = defineProps({
    item: {
      type: Object,
      required: true,
    },
    basePath: {
      type: String,
      default: '',
    },
  })

  // 获取当前用户的账号信息
  const adminAccount = computed(() => adminStore.adminAccount)

  // 判断是否有权限访问
  const hasAccess = (route) => {
    // 如果路由要求 root 账号并且当前用户不是 root，返回 false
    if (route.meta?.requireRoot && adminAccount.value !== 'root') {
      return false
    }
    return true
  }

  const onlyOneChild = ref(null)
  const hasOneShowingChild = (children = [], parent) => {
    const showingChildren = children.filter((item) => {
      if (item.hidden || !hasAccess(item)) {
        return false
      } else {
        onlyOneChild.value = item
        return true
      }
    })

    if (showingChildren.length === 1) {
      return true
    }

    if (showingChildren.length === 0) {
      onlyOneChild.value = { ...parent, path: '', noShowingChildren: true }
      return true
    }

    return false
  }

  const resolvePath = (routePath) => {
    if (isExternal(routePath)) {
      return routePath
    }
    if (isExternal(props.basePath)) {
      return props.basePath
    }
    return path.resolve(props.basePath, routePath)
  }

  onMounted(() => {})
</script>
