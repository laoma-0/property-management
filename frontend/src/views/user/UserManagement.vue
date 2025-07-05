<template>
  <div class="user-management-container">


    <!-- 搜索区 -->
    <UserSearch
        @search="handleSearch"
        @create="showCreateDialog = true"
    />

    <!-- 用户列表 -->
    <el-card>
      <el-table :data="userList" v-loading="loading" stripe style="width: 100%">
        <el-table-column prop="userId" label="用户ID" width="100" />
        <el-table-column prop="username" label="用户名" width="150" />
        <el-table-column prop="phone" label="手机号" width="150" />
        <el-table-column prop="email" label="邮箱" width="200" />
        <el-table-column label="角色" width="100">
          <template #default="{ row }">
            <el-tag :type="row.role === 'admin' ? 'danger' : 'primary'">
              {{ row.role === 'admin' ? '管理员' : '业主' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status ? 'success' : 'danger'">
              {{ row.status ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" fixed="right" width="220">
          <template #default="scope">
            <el-button
                size="small"
                type="primary"
                @click="handleEdit(scope.row)"
            >
              编辑
            </el-button>
            <el-button
                size="small"
                :type="scope.row.status ? 'danger' : 'success'"
                @click="toggleUserStatus(scope.row)"
            >
              {{ scope.row.status ? '禁用' : '启用' }}
            </el-button>
            <el-button
                size="small"
                type="danger"
                @click="handleDelete(scope.row.userId)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
          class="pagination"
          v-model:current-page="pagination.current"
          v-model:page-size="pagination.size"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="fetchUsers"
          @current-change="fetchUsers"
      />
    </el-card>

    <!-- 创建/编辑用户对话框 -->
    <el-dialog
        v-model="showEditDialog"
        :title="isEditing ? '编辑用户' : '创建用户'"
        width="500px"
    >
      <el-form
          :model="currentUser"
          label-width="80px"
          ref="userForm"
          :rules="userRules"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="currentUser.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!isEditing">
          <el-input v-model="currentUser.password" type="password" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="currentUser.phone" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="currentUser.email" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="currentUser.role" placeholder="选择角色">
            <el-option label="业主" value="owner" />
            <el-option label="管理员" value="admin" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
              v-model="currentUser.status"
              :active-value="1"
              :inactive-value="0"
              active-text="启用"
              inactive-text="禁用"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEditDialog = false">取消</el-button>
        <el-button type="primary" @click="submitUserForm">
          {{ isEditing ? '更新' : '创建' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import UserSearch from '@/components/user/UserSearch.vue';
import userService from '@/services/userService';

// 用户数据
const userList = ref([]);
const loading = ref(false);
const currentUser = ref({
  userId: null,
  username: '',
  password: '',
  phone: '',
  email: '',
  role: 'owner',
  status: 1
});

// 分页配置
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
});

// 对话框状态
const showEditDialog = ref(false);
const isEditing = ref(false);
const userForm = ref(null);

// 表单验证规则
const userRules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ]
});

// 搜索参数
let searchParams = {};

// 生命周期钩子
onMounted(() => {
  fetchUsers();
});

// 获取用户列表
const fetchUsers = async () => {
  try {
    loading.value = true;
    const params = {
      page: pagination.current,
      pageSize: pagination.size,
      ...searchParams
    };

    const response = await userService.getUsers(params);
    userList.value = response.data;
    pagination.total = response.total;
  } catch (error) {
    ElMessage.error('获取用户列表失败');
  } finally {
    loading.value = false;
  }
};

// 处理搜索
const handleSearch = (params) => {
  searchParams = params;
  pagination.current = 1; // 重置到第一页
  fetchUsers();
};

// 编辑用户
const handleEdit = (user) => {
  currentUser.value = { ...user };
  isEditing.value = true;
  showEditDialog.value = true;
};

// 切换用户状态
const toggleUserStatus = async (user) => {
  try {
    if (user.status) {
      await userService.disableUser(user.userId);
      ElMessage.success('用户已禁用');
    } else {
      await userService.enableUser(user.userId);
      ElMessage.success('用户已启用');
    }
    fetchUsers(); // 刷新列表
  } catch (error) {
    ElMessage.error('操作失败');
  }
};

// 删除用户
const handleDelete = (userId) => {
  ElMessageBox.confirm('确定要删除该用户吗？此操作不可恢复！', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await userService.deleteUser(userId);
      ElMessage.success('用户已删除');
      fetchUsers(); // 刷新列表
    } catch (error) {
      ElMessage.error('删除用户失败');
    }
  }).catch(() => {});
};

// 提交用户表单
const submitUserForm = async () => {
  try {
    // 验证表单
    await userForm.value.validate();

    if (isEditing.value) {
      // 更新用户
      await userService.updateUser(currentUser.value.userId, currentUser.value);
      ElMessage.success('用户信息已更新');
    } else {
      // 创建用户
      await userService.createUser(currentUser.value);
      ElMessage.success('用户创建成功');
    }

    showEditDialog.value = false;
    fetchUsers(); // 刷新列表
  } catch (error) {
    if (!error.response) {
      // 验证错误不显示消息
      console.log('表单验证失败');
    } else {
      ElMessage.error(error.response.data.message || '操作失败');
    }
  }
};

// 重置当前用户表单
const resetCurrentUser = () => {
  currentUser.value = {
    userId: null,
    username: '',
    password: '',
    phone: '',
    email: '',
    role: 'owner',
    status: 1
  };
  isEditing.value = false;
};
</script>

<style scoped>
.user-management-container {
  padding: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>