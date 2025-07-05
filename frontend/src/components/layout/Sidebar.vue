<template>
  <el-aside width="200px">
    <el-menu
        :default-active="activeMenu"
        class="el-menu-vertical"
        router
    >
      <!-- 公告管理 -->
      <el-menu-item index="home" @click="navigateTo({ name: 'home' })">
        <el-icon><HomeFilled /></el-icon>
        <span>公告管理</span>
      </el-menu-item>

      <!-- 用户管理 -->
      <el-menu-item index="user-management" @click="navigateTo({ name: 'UserManagement' })">
        <el-icon><User /></el-icon>
        <span>用户管理</span>
      </el-menu-item>

      <!-- 物业管理 -->
      <el-menu-item index="property-management" @click="navigateTo({ name: 'PropertyManagement' })">
        <el-icon><OfficeBuilding /></el-icon>
        <span>物业管理</span>
      </el-menu-item>

      <!-- 报修管理 -->
      <el-menu-item index="repair-management" @click="navigateTo({ name: 'RepairManagement' })">
        <el-icon><Tools /></el-icon>
        <span>报修管理</span>
      </el-menu-item>

      <!-- 缴费管理 -->
      <el-menu-item index="payment-management" @click="navigateTo({ name: 'PaymentManagement' })">
        <el-icon><Money /></el-icon>
        <span>缴费管理</span>
      </el-menu-item>

      <!-- 系统设置 -->
      <el-menu-item index="settings" @click="navigateTo({ name: 'settings' })">
        <el-icon><Setting /></el-icon>
        <span>系统设置</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script setup>
import { useRouter } from 'vue-router'
import {
  HomeFilled,
  User,
  OfficeBuilding,
  Tools,
  Money,
  Setting
} from '@element-plus/icons-vue'

defineProps({
  activeMenu: String
})

const router = useRouter()

const navigateTo = (route) => {
  router.push(route)
}
</script>

<style scoped>
.el-aside {
  background-color: #eef1f6;
  height: 100vh;
  overflow: hidden;
}

.el-menu {
  border-right: none;
  height: 100%;
}

.el-menu-item {
  display: flex;
  align-items: center;
}

.el-icon {
  margin-right: 8px;
}
</style>