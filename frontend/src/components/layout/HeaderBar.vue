<template>
  <el-header>
    <div class="logo">物业管理系统</div>
    <div class="user-info">
      <span>欢迎回来，{{ authStore.userInfo.username }}</span>
      <el-button type="text" @click="logout">退出登录</el-button>
    </div>
  </el-header>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore.js'

const router = useRouter()
const authStore = useAuthStore()

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.el-header {
  background-color: #304156;
  color: #fff;
  line-height: 60px;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
}

.logo {
  font-size: 20px;
  font-weight: bold;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-info span {
  margin-right: 20px;
}
</style>