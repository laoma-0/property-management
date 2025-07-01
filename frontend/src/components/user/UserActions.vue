<!--搜索用户表单组件-->
<template>
  <div class="user-actions">
    <el-button type="primary" @click="$emit('add')">
      <el-icon><Plus /></el-icon> 添加用户
    </el-button>

    <el-input
        v-model="searchQuery"
        placeholder="搜索用户..."
        class="search-input"
        clearable
    >
      <template #prefix>
        <el-icon><Search /></el-icon>
      </template>
    </el-input>

    <el-select v-model="roleFilter" placeholder="角色筛选" class="filter-select">
      <el-option label="全部" value="all" />
      <el-option label="管理员" value="admin" />
      <el-option label="业主" value="owner" />
    </el-select>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useUserStore } from '@/stores/userStore.js'

const userStore = useUserStore()

const searchQuery = ref('')
const roleFilter = ref('all')

// 监听搜索查询变化
watch(searchQuery, (val) => {
  userStore.setSearchQuery(val)
})

// 监听角色过滤变化
watch(roleFilter, (val) => {
  userStore.setRoleFilter(val)
})
</script>