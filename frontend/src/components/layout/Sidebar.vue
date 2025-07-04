<template>
  <el-aside width="200px">
    <el-menu
        :default-active="activeMenu"
        class="el-menu-vertical"
    >
      <el-menu-item
          index="home"
          @click="navigateTo({ name: 'home' })"
      >
        <i class="el-icon-s-home"></i>
        <span>公告管理</span>
      </el-menu-item>
<!--      v-if="authStore.userInfo.role === 'admin'"-->
      <el-menu-item
          index="user-management"
          @click="navigateTo({ name: 'UserManagement' })"
      >
        <i class="el-icon-user"></i>
        <span>用户管理</span>
      </el-menu-item>

      <el-menu-item
          index="settings"
          @click="navigateTo({ name: 'settings' })"
      >
        <i class="el-icon-s-tools"></i>
        <span>物业管理</span>
      </el-menu-item>
      <el-menu-item
          index="settings"
          @click="navigateTo({ name: 'settings' })"
      >
        <i class="el-icon-s-tools"></i>
        <span>保修管理</span>
      </el-menu-item>
      <el-menu-item
          index="settings"
          @click="navigateTo({ name: 'settings' })"
      >
        <i class="el-icon-s-tools"></i>
        <span>缴费管理</span>
      </el-menu-item>
    </el-menu>
    <el-menu-item
        index="settings"
        @click="navigateTo({ name: 'settings' })"
    >
      <i class="el-icon-s-tools"></i>
      <span>系统设置</span>
    </el-menu-item>
  </el-aside>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore.js'

defineProps({
  activeMenu: String
})

const router = useRouter()
const authStore = useAuthStore()

const navigateTo = (route) => {
  router.push(route)
}
</script>