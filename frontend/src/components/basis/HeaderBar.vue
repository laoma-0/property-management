<template>
  <el-header>
    <div class="header-container">
      <div class="logo">物业管理系统</div>
      <!-- 同时检查 isAuthenticated 和 user 对象是否存在 -->
      <div class="user-info" v-if="authStore.isAuthenticated && authStore.user">
        <span>{{ authStore.user.username || '未知用户' }}</span>
        <el-button size="mini" @click="logout">退出</el-button>
      </div>
    </div>
  </el-header>
</template>

<script setup>
import { useAuthStore } from '@/stores/useAuthStore.js';
import { ElMessage } from 'element-plus';

const authStore = useAuthStore();

const logout = () => {
  authStore.logout();
  ElMessage.info('已退出登录');
};
</script>

<style scoped>
.el-header {
  background-color: #242f42;
  color: #fff;
  line-height: 60px;
  padding: 0;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.logo {
  font-size: 20px;
  font-weight: bold;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>