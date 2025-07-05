<template>
  <el-container class="main-container">
    <!-- 顶部导航栏 -->
    <el-header height="60px">
      <HeaderBar />
    </el-header>

    <el-container>
      <!-- 侧边栏 -->
      <Sidebar :active-menu="activeMenu" />

      <!-- 主内容区 -->
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import HeaderBar from './HeaderBar.vue'
import Sidebar from './Sidebar.vue'

const route = useRoute()
const activeMenu = ref(route.name)

// 监听路由变化更新激活菜单
watch(() => route.name, (newName) => {
  activeMenu.value = newName
})
</script>

<style scoped>
.main-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.el-header {
  padding: 0;
  background-color: #409EFF;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.el-aside {
  background-color: #eef1f6;
  height: calc(100vh - 60px);
  overflow-y: auto;
  border-right: 1px solid #e6e6e6;
}

.el-main {
  padding: 20px;
  height: calc(100vh - 60px);
  overflow-y: auto;
  background-color: #f5f7fa;
}
</style>