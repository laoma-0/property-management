<template>
  <div class="home-container">
    <h1>欢迎回来，{{ userStore.username }}</h1>
    <el-button type="danger" @click="logout">退出登录</el-button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const router = useRouter()
const userStore = useUserStore()

const logout = () => {
  userStore.logout()
}
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #f8f9fa;

  h1 {
    margin-bottom: 20px;
    color: #333;
  }
}
</style>