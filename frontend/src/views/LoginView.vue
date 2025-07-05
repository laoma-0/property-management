<template>
  <div class="login-register-container">
    <div class="container">
      <div class="welcome-section">
        <div class="logo">
          <i class="el-icon-office-building"></i>
        </div>
        <h1>物业管理系统</h1>
        <p>高效、便捷、智能的物业管理解决方案</p>

        <div class="features">
          <div class="feature">
            <i class="el-icon-s-check"></i>
            <span>业主信息管理</span>
          </div>
          <div class="feature">
            <i class="el-icon-money"></i>
            <span>费用账单管理</span>
          </div>
          <div class="feature">
            <i class="el-icon-s-comment"></i>
            <span>报修服务管理</span>
          </div>
          <div class="feature">
            <i class="el-icon-data-analysis"></i>
            <span>数据统计分析</span>
          </div>
        </div>
      </div>

      <div class="form-section">
        <div class="tabs">
          <div class="tab" :class="{active: activeTab === 'login'}" @click="activeTab = 'login'">登录</div>
          <div class="tab" :class="{active: activeTab === 'register'}" @click="activeTab = 'register'">注册</div>
        </div>

        <div class="form-container">
          <h2 class="form-title">{{ activeTab === 'login' ? '欢迎回来' : '创建账户' }}</h2>

          <!-- 登录表单 -->
          <el-form
              v-if="activeTab === 'login'"
              :model="loginForm"
              :rules="loginRules"
              ref="loginFormRef"
              @submit.prevent="handleLogin"
          >
            <el-form-item prop="username">
              <el-input
                  v-model="loginForm.username"
                  placeholder="用户名"
                  prefix-icon="el-icon-user"
                  clearable
              ></el-input>
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                  v-model="loginForm.password"
                  type="password"
                  placeholder="密码"
                  prefix-icon="el-icon-lock"
                  show-password
                  clearable
              ></el-input>
            </el-form-item>

            <el-form-item>
              <el-button
                  type="primary"
                  native-type="submit"
                  class="submit-btn"
                  :loading="loginLoading"
              >
                登录
              </el-button>
            </el-form-item>

            <div class="forgot-link">
              <a href="#" @click.prevent="showForgotPassword">忘记密码？</a>
            </div>
          </el-form>

          <!-- 注册表单 -->
          <el-form
              v-else
              :model="registerForm"
              :rules="registerRules"
              ref="registerFormRef"
              @submit.prevent="handleRegister"
          >
            <el-form-item prop="username">
              <el-input
                  v-model="registerForm.username"
                  placeholder="用户名"
                  prefix-icon="el-icon-user"
                  clearable
              ></el-input>
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                  v-model="registerForm.password"
                  type="password"
                  placeholder="密码"
                  prefix-icon="el-icon-lock"
                  show-password
                  clearable
              ></el-input>
            </el-form-item>

            <el-form-item prop="confirmPassword">
              <el-input
                  v-model="registerForm.confirmPassword"
                  type="password"
                  placeholder="确认密码"
                  prefix-icon="el-icon-lock"
                  show-password
                  clearable
              ></el-input>
            </el-form-item>

            <el-form-item prop="phone">
              <el-input
                  v-model="registerForm.phone"
                  placeholder="手机号码"
                  prefix-icon="el-icon-mobile-phone"
                  clearable
              ></el-input>
            </el-form-item>

            <el-form-item prop="email">
              <el-input
                  v-model="registerForm.email"
                  placeholder="电子邮箱"
                  prefix-icon="el-icon-message"
                  clearable
              ></el-input>
            </el-form-item>

            <el-form-item prop="role">
              <el-select
                  v-model="registerForm.role"
                  placeholder="选择角色"
                  class="w-full"
              >
                <el-option label="管理员" value="admin"></el-option>
                <el-option label="业主" value="owner"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button
                  type="primary"
                  native-type="submit"
                  class="submit-btn"
                  :loading="registerLoading"
              >
                注册
              </el-button>
            </el-form-item>
          </el-form>

          <div v-if="activeTab === 'login'" class="divider">
            或通过以下方式登录
          </div>

          <div v-if="activeTab === 'login'" class="social-login">
            <div class="social-btn" @click="socialLogin('phone')">
              <i class="el-icon-mobile-phone"></i>
            </div>
            <div class="social-btn" @click="socialLogin('wechat')">
              <i class="el-icon-chat-dot-round"></i>
            </div>
            <div class="social-btn" @click="socialLogin('email')">
              <i class="el-icon-s-promotion"></i>
            </div>
          </div>

          <div class="register-text">
            {{ activeTab === 'login' ? '还没有账户？' : '已有账户？' }}
            <a href="#" @click.prevent="activeTab = activeTab === 'login' ? 'register' : 'login'">
              {{ activeTab === 'login' ? '立即注册' : '去登录' }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore.js';
import axios from '@/utils/axios'

const router = useRouter()
const userStore = useAuthStore()

const activeTab = ref('login')
const loginFormRef = ref(null)
const registerFormRef = ref(null)
const loginLoading = ref(false)
const registerLoading = ref(false)

// 登录表单数据
const loginForm = reactive({
  username: 'admin',
  password: '123456'
})

// 注册表单数据
const registerForm = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  phone: '',
  email: '',
  role: 'owner'
})

// 登录表单验证规则
const loginRules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ]
})

// 注册表单验证规则
const registerRules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== registerForm.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  phone: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入电子邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的电子邮箱', trigger: ['blur', 'change'] }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ]
})

// 处理登录
const handleLogin = async () => {
  try {
    await loginFormRef.value.validate()
    loginLoading.value = true

    await userStore.login({
      username: loginForm.username,
      password: loginForm.password
    })

    ElMessage.success('登录成功！')
    await router.push('home')// 跳转到主页
  } catch (error) {
    ElMessage.error(error.message || '登录失败，请重试')
  } finally {
    loginLoading.value = false
  }
}

// 处理注册
const handleRegister = async () => {
  try {
    await registerFormRef.value.validate()
    registerLoading.value = true

    // 构造注册数据
    const registerData = {
      username: registerForm.username,
      password: registerForm.password,
      phone: registerForm.phone,
      email: registerForm.email,
      role: registerForm.role
    }

    // 发送注册请求
    const response = await axios.post('/auth/register', registerData)

    if (response) {
      ElMessage.success('注册成功！')
      // 重置表单
      registerFormRef.value.resetFields()
      // 切换到登录页
      activeTab.value = 'login'
    } else {
      ElMessage.error(response.message || '注册失败，请重试')
    }
  } catch (error) {
    console.error('注册失败:', error)
    let errorMessage = '注册失败'

    if (error.response) {
      // 处理后端返回的错误信息
      if (error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message
      } else if (error.response.status === 400) {
        errorMessage = '请求参数错误'
      } else if (error.response.status === 409) {
        errorMessage = '用户名已存在'
      }
    }

    ElMessage.error(errorMessage)
  } finally {
    registerLoading.value = false
  }
}

// 第三方登录
const socialLogin = (type) => {
  ElMessage.info(`暂未开通${type === 'wechat' ? '微信' : type === 'phone' ? '手机' : '邮箱'}登录功能`)
}

// 忘记密码
const showForgotPassword = () => {
  ElMessage.info('忘记密码功能正在开发中')
}
</script>

<style scoped lang="scss">
.login-register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #1e5799, #207cca, #2989d8, #1e5799);
  padding: 20px;
}

.container {
  display: flex;
  width: 100%;
  max-width: 1000px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.welcome-section {
  flex: 1;
  background: linear-gradient(135deg, #4b6cb7, #182848);
  color: white;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.form-section {
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.logo {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;

  i {
    font-size: 40px;
    color: white;
  }
}

.welcome-section h1 {
  font-size: 28px;
  margin-bottom: 15px;
  font-weight: 600;
}

.welcome-section p {
  font-size: 16px;
  line-height: 1.6;
  opacity: 0.9;
}

.features {
  margin-top: 30px;
  text-align: left;
  width: 100%;
}

.feature {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;

  i {
    margin-right: 10px;
    font-size: 20px;
  }
}

.tabs {
  display: flex;
  margin-bottom: 30px;
  border-bottom: 1px solid #eee;
}

.tab {
  flex: 1;
  text-align: center;
  padding: 15px;
  cursor: pointer;
  font-size: 18px;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;

  &.active {
    color: #409eff;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 60%;
      height: 3px;
      background: #409eff;
      border-radius: 3px;
    }
  }
}

.form-container {
  width: 100%;
}

.form-title {
  text-align: center;
  margin-bottom: 30px;
  font-size: 24px;
  color: #333;
  font-weight: 600;
}

.el-form-item {
  margin-bottom: 22px;
}

.submit-btn {
  width: 100%;
  height: 45px;
  font-size: 16px;
  margin-top: 10px;
}

.forgot-link {
  text-align: right;
  margin-top: 10px;

  a {
    color: #409eff;
    text-decoration: none;
    font-size: 14px;
  }
}

.divider {
  text-align: center;
  margin: 20px 0;
  position: relative;
  color: #909399;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 40%;
    height: 1px;
    background: #dcdfe6;
  }

  &::before {
    left: 0;
  }

  &::after {
    right: 0;
  }
}

.social-login {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.social-btn {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  border: 1px solid #dcdfe6;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }

  i {
    font-size: 20px;
  }
}

.register-text {
  text-align: center;
  margin-top: 25px;
  color: #606266;
  font-size: 14px;

  a {
    color: #409eff;
    text-decoration: none;
    font-weight: 500;
    margin-left: 5px;
  }
}

@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }

  .welcome-section {
    padding: 30px 20px;
  }

  .form-section {
    padding: 30px 20px;
  }
}

.w-full {
  width: 100%;
}
</style>