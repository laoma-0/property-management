<template>
  <div class="home-container">
    <el-header>
      <div class="logo">物业管理系统</div>
      <div class="user-info">
        <span>欢迎回来，{{ authStore.userInfo.username }}</span>
        <el-button type="text" @click="logout">退出登录</el-button>
      </div>
    </el-header>

    <el-container>
      <el-aside width="200px">
        <el-menu
            :default-active="activeMenu"
            class="el-menu-vertical"
            @open="handleOpen"
            @close="handleClose"
        >
          <el-menu-item index="home">
            <i class="el-icon-s-home"></i>
            <span slot="title">首页</span>
          </el-menu-item>

          <!-- 只有管理员能看到用户管理菜单 -->
          <el-menu-item index="user-management" v-if="authStore.userInfo.role === 'admin'" @click="navigateToUserManagement">
            <i class="el-icon-user"></i>
            <span slot="title">用户管理</span>
          </el-menu-item>

          <el-menu-item index="settings">
            <i class="el-icon-s-tools"></i>
            <span slot="title">系统设置</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/useAuthStore.js';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const activeMenu = ref('home');

const logout = () => {
  authStore.logout();
  router.push('/login');
};

const handleOpen = (key, keyPath) => {
  console.log(key, keyPath);
};

const handleClose = (key, keyPath) => {
  console.log(key, keyPath);
};

const navigateToUserManagement = () => {
  router.push({ name: 'UserManagement' });
};

// 根据当前路由设置激活的菜单
onMounted(() => {
  if (route.name === 'UserManagement') {
    activeMenu.value = 'user-management';
  } else {
    activeMenu.value = route.name || 'home';
  }
});
</script>

<style scoped>
.home-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

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

.el-aside {
  background-color: #1f2d3d;
  color: #fff;
}

.el-main {
  background-color: #f5f7fa;
}
</style>