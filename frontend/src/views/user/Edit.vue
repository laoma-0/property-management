<!-- src/views/user/Edit.vue -->
<template xmlns="">
  <div class="user-edit">
    <div class="page-header flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">{{ isEdit ? '编辑用户' : '添加用户' }}</h1>
      <el-button @click="handleBack">
        <el-icon><ArrowLeft /></el-icon>返回
      </el-button>
    </div>

    <el-card>
      <el-form
          ref="formRef"
          :model="userForm"
          :rules="rules"
          label-width="120px"
          class="user-form"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" placeholder="请输入用户名" />
        </el-form-item>

        <el-form-item label="电话" prop="phone">
          <el-input v-model="userForm.phone" placeholder="请输入手机号" />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" placeholder="请输入邮箱" />
        </el-form-item>

        <el-form-item label="角色" prop="role">
          <el-radio-group v-model="userForm.role">
            <el-radio :label="'owner'">业主</el-radio>
            <el-radio :label="'admin'">管理员</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-switch v-model="userForm.status" active-value="1" inactive-value="0" />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
              v-model="userForm.password"
              type="password"
              placeholder="请输入密码（编辑时可选）"
          />
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
              v-model="userForm.confirmPassword"
              type="password"
              placeholder="请确认密码"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit">提交</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, toRefs, watch } from 'vue';
import { useUserStore } from '@/stores/userStore.js';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox, ElForm } from 'element-plus';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const formRef = ref(null);

// 从路由获取参数
const { id, isEdit } = toRefs(route.params);

// 表单数据
const userForm = reactive({
  user_id: null,
  username: '',
  phone: '',
  email: '',
  role: 'owner',
  status: '1',
  password: '',
  confirmPassword: ''
});

// 表单验证规则
const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ],
  password: [
    { required: !isEdit.value, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: !isEdit.value, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== userForm.password) {
          callback(new Error('两次输入的密码不一致'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ]
});

// 生命周期钩子
onMounted(async () => {
  if (isEdit.value && id.value) {
    try {
      await userStore.fetchUserById(id.value);
      if (userStore.user) {
        // 复制用户数据到表单
        Object.assign(userForm, {
          ...userStore.user,
          // 编辑时清空密码字段，用户可选择是否修改
          password: '',
          confirmPassword: ''
        });
      } else {
        ElMessage.error('用户不存在');
        router.push({ name: 'userList' });
      }
    } catch (error) {
      ElMessage.error('获取用户信息失败');
      router.push({ name: 'userList' });
    }
  }
});

// 监听密码变化，重置确认密码
watch(
    () => userForm.password,
    () => {
      if (userForm.password) {
        userForm.confirmPassword = '';
      }
    }
);

// 事件处理函数
const handleSubmit = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      // 准备提交数据
      const submitData = {
        username: userForm.username,
        phone: userForm.phone,
        email: userForm.email,
        role: userForm.role,
        status: userForm.status
      };

      // 如果输入了密码或创建新用户，则包含密码字段
      if (userForm.password || !isEdit.value) {
        submitData.password = userForm.password;
      }

      let result;
      try {
        if (isEdit.value) {
          // 更新用户
          result = await userStore.updateUserInfo(id.value, submitData);
        } else {
          // 创建用户
          result = await userStore.createNewUser(submitData);
        }

        if (result) {
          ElMessage.success(isEdit.value ? '更新用户成功' : '创建用户成功');
          router.push({ name: 'userList' });
        } else {
          ElMessage.error(isEdit.value ? '更新用户失败' : '创建用户失败');
        }
      } catch (error) {
        ElMessage.error(error.message || '操作失败，请重试');
      }
    } else {
      ElMessage.error('表单验证失败，请检查输入');
      return false;
    }
  });
};

const handleReset = () => {
  formRef.value.resetFields();
  if (isEdit.value && userStore.user) {
    // 重置为原始数据
    Object.assign(userForm, {
      ...userStore.user,
      password: '',
      confirmPassword: ''
    });
  }
};

const handleBack = () => {
  router.push({ name: 'userList' });
};
</script>

<style scoped>
.user-edit {
  padding: 0 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.user-form {
  max-width: 600px;
  margin: 0 auto;
}
</style>