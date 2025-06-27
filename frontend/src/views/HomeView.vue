<template>
  <div>
    <h1>欢迎回来，{{ userStore.userInfo?.username }}</h1>
    <el-button @click="logout">退出登录</el-button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const router = useRouter()
const userStore = useUserStore()

const logout = () => {
  userStore.logout()
  router.push('/login')
}
</script>