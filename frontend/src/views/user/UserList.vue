<template>
  <div class="user-management-container">
    <el-card class="box-card">
      <template #header>
        <div class="clearfix">
          <span>用户管理</span>
          <el-button style="float: right; padding: 3px 0" type="primary" @click="handleCreate">
            新增用户
          </el-button>
        </div>
      </template>

      <!-- 搜索和筛选区域 -->
      <el-row class="mb-4">
        <el-col :span="8">
          <el-input v-model="searchKeyword" placeholder="搜索用户名" @keyup.enter="fetchUsers">
            <template #append>
              <el-button @click="fetchUsers">搜索</el-button>
            </template>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-select v-model="roleFilter" placeholder="选择角色" @change="fetchUsers">
            <el-option label="全部" value=""></el-option>
            <el-option label="管理员" value="admin"></el-option>
            <el-option label="普通用户" value="user"></el-option>
          </el-select>
        </el-col>
      </el-row>

      <!-- 用户列表 -->
      <el-table :data="userList" stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="role" label="角色">
          <template #default="scope">
            <el-tag :type="scope.row.role === 'admin' ? 'danger' : 'success'">
              {{ scope.row.role === 'admin' ? '管理员' : '普通用户' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页控件 -->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </el-card>

    <!-- 新增/编辑用户对话框 -->
    <el-dialog :visible.sync="dialogVisible" title="用户信息">
      <el-form :model="formData" ref="formRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="formData.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-radio-group v-model="formData.role">
            <el-radio label="admin">管理员</el-radio>
            <el-radio label="user">普通用户</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveUser">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 删除确认对话框 -->
    <el-dialog
        title="提示"
        :visible.sync="deleteDialogVisible"
        width="30%">
      <template #content>
        <p>确定要删除用户 {{ deleteUserId }} 吗？</p>
      </template>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deleteDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmDelete">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import userService from '@/services/userService.js';
import { ElMessage } from 'element-plus';

// 数据状态
const userList = ref([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
const searchKeyword = ref('');
const roleFilter = ref('');

// 对话框状态
const dialogVisible = ref(false);
const deleteDialogVisible = ref(false);
const formData = reactive({
  id: null,
  username: '',
  password: '',
  email: '',
  role: 'user'
});
const formRef = ref(null);
const deleteUserId = ref('');

// 获取用户列表
const fetchUsers = async () => {
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchKeyword.value,
      role: roleFilter.value
    };

    const response = await userService.getUsers(params);
    userList.value = response.data.records || [];
    total.value = response.data.total || 0;
  } catch (error) {
    console.error('获取用户列表失败:', error);
    ElMessage.error('获取用户列表失败');
  }
};

// 处理分页
const handleSizeChange = (newSize) => {
  pageSize.value = newSize;
  fetchUsers();
};

const handleCurrentChange = (newPage) => {
  currentPage.value = newPage;
  fetchUsers();
};

// 新增用户
const handleCreate = () => {
  // 重置表单数据
  formData.id = null;
  formData.username = '';
  formData.password = '';
  formData.email = '';
  formData.role = 'user';

  dialogVisible.value = true;
};

// 编辑用户
const handleEdit = (row) => {
  // 填充表单数据
  formData.id = row.id;
  formData.username = row.username;
  formData.email = row.email;
  formData.role = row.role;

  dialogVisible.value = true;
};

// 保存用户（新增或编辑）
const saveUser = async () => {
  try {
    // 表单验证
    await formRef.value.validate();

    if (formData.id) {
      // 更新用户
      await userService.updateUser(formData.id, formData);
      ElMessage.success('用户更新成功');
    } else {
      // 创建用户
      await userService.createUser(formData);
      ElMessage.success('用户创建成功');
    }

    dialogVisible.value = false;
    await fetchUsers(); // 刷新列表
  } catch (error) {
    console.error('保存用户失败:', error);
    ElMessage.error('保存用户失败');
  }
};

// 删除用户
const handleDelete = (row) => {
  deleteUserId.value = row.username;
  formData.id = row.id;
  deleteDialogVisible.value = true;
};

const confirmDelete = async () => {
  try {
    await userService.deleteUser(formData.id);
    ElMessage.success('用户删除成功');
    deleteDialogVisible.value = false;
    await fetchUsers(); // 刷新列表
  } catch (error) {
    console.error('删除用户失败:', error);
    ElMessage.error('删除用户失败');
  }
};

// 生命周期钩子
onMounted(() => {
  // 加载用户列表
  fetchUsers();
});
</script>

<style scoped>
.user-management-container {
  padding: 20px;
}

.box-card {
  margin-bottom: 20px;
}
</style>