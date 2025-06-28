<template>
  <div class="login-container">
    <el-form :model="form" @submit.prevent="handleLogin">
      <h2>物业管理系统登录</h2>
      <el-form-item label="用户名">
        <el-input
            v-model="form.username"
            placeholder="请输入用户名"
            clearable
        />
      </el-form-item>

      <el-form-item label="密码">
        <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            show-password
            clearable
        />
      </el-form-item>

      <el-button
          type="primary"
          native-type="submit"
          :loading="loading"
          class="login-btn"
      >
        登录
      </el-button>

      <div class="debug-link">
        <router-link to="/debug">调试页面</router-link>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { ElMessage } from 'element-plus'

const form = ref({
  username: 'admin',
  password: '123456'
})
const loading = ref(false)
const router = useRouter()
const userStore = useUserStore()

const handleLogin = async () => {
  loading.value = true
  try {
    await userStore.login(form.value)
    ElMessage.success('登录成功')
  } catch (error) {
    ElMessage.error(error.message || '登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f5f7fa;

  .el-form {
    width: 400px;
    padding: 30px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

    h2 {
      text-align: center;
      margin-bottom: 30px;
      color: #409eff;
    }

    .login-btn {
      width: 100%;
      margin-top: 10px;
    }

    .debug-link {
      margin-top: 15px;
      text-align: center;
      font-size: 14px;
      color: #666;
    }
  }
}
</style>