<template>
  <el-card class="search-card">
    <el-form :model="searchForm" label-width="80px">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="用户名">
            <el-input v-model="searchForm.username" placeholder="输入用户名" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="手机号">
            <el-input v-model="searchForm.phone" placeholder="输入手机号" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="邮箱">
            <el-input v-model="searchForm.email" placeholder="输入邮箱" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="角色">
            <el-select v-model="searchForm.role" placeholder="选择角色" clearable>
              <el-option label="业主" value="owner" />
              <el-option label="管理员" value="admin" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="状态">
            <el-select v-model="searchForm.status" placeholder="选择状态" clearable>
              <el-option label="启用" :value="1" />
              <el-option label="禁用" :value="0" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="18" class="button-group">
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button type="success" @click="handleCreate">新增用户</el-button>
        </el-col>
      </el-row>
    </el-form>
  </el-card>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['search', 'create']);

const searchForm = ref({
  username: '',
  phone: '',
  email: '',
  role: '',
  status: null
});

const handleSearch = () => {
  emit('search', { ...searchForm.value });
};

const handleReset = () => {
  searchForm.value = {
    username: '',
    phone: '',
    email: '',
    role: '',
    status: null
  };
  emit('search', {});
};

const handleCreate = () => {
  emit('create');
};
</script>

<style scoped>
.search-card {
  margin-bottom: 20px;
}
.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>