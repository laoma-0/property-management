<!-- src/views/UserManagement.vue -->
<template>
  <div class="user-management-container">
    <h2>用户管理</h2>
    <!-- 这里是用户管理的具体内容，例如用户列表 -->
    <el-table :data="userList" stripe>
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="small" type="primary">编辑</el-button>
          <el-button size="small" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const userList = ref([
  { id: 1, name: '张三', email: 'zhangsan@example.com' },
  { id: 2, name: '李四', email: 'lisi@example.com' },
  { id: 3, name: '王五', email: 'wangwu@example.com' }
])

// 实际项目中可能会从API获取用户数据
onMounted(() => {
  // fetchUserList()
})
</script>