<template>
  <div class="header-container">
    <!-- 左侧：系统名称和面包屑 -->
    <div class="header-left">
      <div class="system-name">物业管理系统</div>
      <Breadcrumb />
    </div>

    <!-- 右侧：用户信息和操作 -->
    <div class="header-right">
      <!-- 通知图标 -->
      <el-badge :value="5" class="header-icon">
        <el-icon :size="20">
          <Bell />
        </el-icon>
      </el-badge>

      <!-- 用户信息 -->
      <el-dropdown trigger="click">
        <div class="user-info">
          <el-avatar :size="36" :src="userAvatar" />
          <span class="username">{{ authStore.userInfo?.username || '管理员' }}</span>
          <el-icon><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="navigateToProfile">
              <el-icon><User /></el-icon> 个人中心
            </el-dropdown-item>
            <el-dropdown-item @click="handleLogout">
              <el-icon><SwitchButton /></el-icon> 退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { Bell, User, ArrowDown, SwitchButton } from '@element-plus/icons-vue'
import Breadcrumb from './Breadcrumb.vue'

const router = useRouter()
const authStore = useAuthStore()

// 用户头像 - 可以使用真实数据或默认头像
const userAvatar = authStore.userInfo?.avatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'

// 导航到个人中心
const navigateToProfile = () => {
  router.push({ name: 'profile' })
}

// 退出登录
const handleLogout = () => {
  authStore.logout()
  router.push({ name: 'login' })
}
</script>

<style scoped>
.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 20px;
  background-color: #409EFF;
  color: white;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.system-name {
  font-size: 20px;
  font-weight: bold;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-icon {
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    color: #e6f7ff;
  }
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.3s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
}

.username {
  font-size: 14px;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>