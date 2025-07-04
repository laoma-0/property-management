<!-- src/layouts/MainLayout.vue -->
<template>
  <div class="app-container">
    <!-- 顶部导航栏 -->
    <HeaderBar />

    <el-container>
      <!-- 侧边栏 -->
      <Sidebar :active-menu="activeMenu" />

      <!-- 主内容区域 -->
      <el-main>
        <!-- 面包屑导航 -->
        <Breadcrumb />

        <!-- 路由内容会在这里渲染 -->
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import HeaderBar from '@/components/layout/HeaderBar.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import Breadcrumb from '@/components/layout/Breadcrumb.vue'

const route = useRoute()

// 根据当前路由名称计算激活的菜单项
const activeMenu = computed(() => {
  return route.name === 'UserManagement' ? 'user-management'
      : route.name === 'settings' ? 'settings'
          : 'home'
})
</script>