<!--侧边导航栏-->
<template>
  <el-aside width="200px">
    <el-menu :default-active="activeMenu" class="el-menu-vertical-demo" router>
      <el-menu-item index="/">
        <i class="el-icon-s-home"></i>
        <span>首页</span>
      </el-menu-item>
      <el-menu-item index="/user-list">
        <i class="el-icon-user"></i>
        <span>用户管理</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  activeMenu: {
    type: String,
    default: '/'
  }
});
</script>

<style scoped>
.el-aside {
  color: #333;
  background-color: #f0f2f5;
}

.el-menu-vertical-demo {
  border-right: none;
}
</style>