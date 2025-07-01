<!--//更新用户表格组件-->
<template>
  <el-table
      v-loading="loading"
      :data="filteredUsers"
      style="width: 100%"
      @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="55" />

    <el-table-column prop="username" label="用户名" sortable />

    <el-table-column prop="phone" label="手机号" width="150" />

    <el-table-column prop="email" label="邮箱" width="200" />

    <el-table-column prop="role" label="角色" width="120">
      <template #default="{ row }">
        <el-tag :type="row.role === 'admin' ? 'danger' : 'success'">
          {{ row.role === 'admin' ? '管理员' : '业主' }}
        </el-tag>
      </template>
    </el-table-column>

    <el-table-column prop="status" label="状态" width="100">
      <template #default="{ row }">
        <el-tag :type="row.status === 1 ? 'success' : 'danger'">
          {{ row.status === 1 ? '启用' : '禁用' }}
        </el-tag>
      </template>
    </el-table-column>

    <el-table-column prop="create_time" label="创建时间" width="180">
      <template #default="{ row }">
        {{ formatDate(row.create_time) }}
      </template>
    </el-table-column>

    <el-table-column label="操作" width="180" fixed="right">
      <template #default="{ row }">
        <el-button size="small" @click="$emit('edit', row)">编辑</el-button>
        <el-button
            size="small"
            :type="row.status === 1 ? 'danger' : 'success'"
            @click="$emit('toggle-status', row.user_id)"
        >
          {{ row.status === 1 ? '禁用' : '启用' }}
        </el-button>
      </template>
    </el-table-column>
  </el-table>

  <div class="pagination-container">
    <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        background
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore.js'
import { formatDate } from "@/utils/dateUtils"

const userStore = useUserStore()
const emit = defineEmits(['edit', 'toggle-status', 'selection-change'])

const loading = computed(() => userStore.loading)
const filteredUsers = computed(() => userStore.filteredUsers)
const total = computed(() => userStore.pagination.total)
const currentPage = ref(1)
const pageSize = ref(10)

const selectedIds = ref([])

onMounted(() => {
  userStore.fetchUsers()
})

// 处理分页大小变化
const handleSizeChange = (size) => {
  pageSize.value = size
  userStore.pagination.pageSize = size
  userStore.fetchUsers()
}

// 处理页码变化
const handlePageChange = (page) => {
  currentPage.value = page
  userStore.setPage(page)
}

// 处理选择变化
const handleSelectionChange = (selection) => {
  selectedIds.value = selection.map(item => item.user_id)
  emit('selection-change', selectedIds.value)
}
</script>