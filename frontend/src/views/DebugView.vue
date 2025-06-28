<template>
  <div class="debug-container">
    <h1>调试信息</h1>
    <el-button type="primary" @click="testLogin">测试登录</el-button>

    <div v-if="result" class="result-container">
      <h2>登录结果</h2>
      <pre>{{ formattedResult }}</pre>

      <h3>解析后的用户信息</h3>
      <div v-if="result.user">
        <p><strong>用户名:</strong> {{ result.user.username }}</p>
        <p><strong>Token:</strong> {{ result.token }}</p>
      </div>
    </div>

    <div class="local-storage-info">
      <h3>本地存储信息</h3>
      <p><strong>Token:</strong> {{ localStorage.token || '无' }}</p>
      <p><strong>User Info:</strong> {{ localStorage.userInfo || '无' }}</p>
      <p v-if="localStorage.userInfo">
        <strong>用户名:</strong> {{ JSON.parse(localStorage.userInfo)?.username }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { login } from '@/services/authService'

const result = ref(null)
const localStorage = ref({
  token: window.localStorage.getItem('token'),
  userInfo: window.localStorage.getItem('userInfo')
})

const formattedResult = computed(() => {
  return JSON.stringify(result.value, null, 2)
})

const testLogin = async () => {
  try {
    const response = await login({
      username: 'admin',
      password: '123456'
    })
    result.value = response

    // 更新本地存储信息
    localStorage.value = {
      token: window.localStorage.getItem('token'),
      userInfo: window.localStorage.getItem('userInfo')
    }
  } catch (error) {
    result.value = {
      error: error.message,
      stack: error.stack
    }
  }
}

onMounted(() => {
  // 初始化时获取本地存储信息
  localStorage.value = {
    token: window.localStorage.getItem('token'),
    userInfo: window.localStorage.getItem('userInfo')
  }
})
</script>

<style scoped>
.debug-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;

  .result-container {
    margin-top: 20px;
    padding: 15px;
    background: #f5f7fa;
    border-radius: 4px;
    border: 1px solid #ebeef5;
    overflow-x: auto;

    pre {
      white-space: pre-wrap;
      word-break: break-all;
    }
  }

  .local-storage-info {
    margin-top: 30px;
    padding: 15px;
    background: #e6f7ff;
    border-radius: 4px;
    border: 1px solid #91d5ff;
  }
}
</style>