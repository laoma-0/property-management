<!--用户操作组件-->
<template>
  <!-- 根据数据库结构调整表单字段 -->
  <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      label-position="left"
  >
    <el-form-item label="用户名" prop="username">
      <el-input v-model="form.username" placeholder="请输入用户名" />
    </el-form-item>

    <el-form-item label="手机号" prop="phone">
      <el-input v-model="form.phone" placeholder="请输入手机号" />
    </el-form-item>

    <el-form-item label="邮箱" prop="email">
      <el-input v-model="form.email" placeholder="请输入邮箱" />
    </el-form-item>

    <el-form-item label="角色" prop="role">
      <el-select v-model="form.role" placeholder="请选择角色">
        <el-option label="管理员" value="admin" />
        <el-option label="业主" value="owner" />
      </el-select>
    </el-form-item>

    <el-form-item label="状态" prop="status">
      <el-radio-group v-model="form.status">
        <el-radio :label="1">启用</el-radio>
        <el-radio :label="0">禁用</el-radio>
      </el-radio-group>
    </el-form-item>

    <template v-if="!user.user_id">
      <el-form-item label="密码" prop="password">
        <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            show-password
        />
      </el-form-item>

      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input
            v-model="form.confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            show-password
        />
      </el-form-item>
    </template>
  </el-form>
</template>

<script setup>
import {  ref, reactive, watch } from 'vue'

const props = defineProps({
  user: {
    type: Object,
    default: () => ({})
  }
})

const form = reactive({
  username: '',
  phone: '',
  email: '',
  role: 'owner',
  status: 1,
  password: '',
  confirmPassword: ''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== form.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 监听用户数据变化
watch(() => props.user, (user) => {
  if (user && user.user_id) {
    Object.assign(form, {
      username: user.username,
      phone: user.phone,
      email: user.email,
      role: user.role,
      status: user.status
    })
  } else {
    resetForm()
  }
}, { immediate: true, deep: true })

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    username: '',
    phone: '',
    email: '',
    role: 'owner',
    status: 1,
    password: '',
    confirmPassword: ''
  })
}

// 获取表单数据
const getFormData = () => {
  const formData = { ...form }

  // 如果是编辑，不需要密码字段
  if (props.user.user_id) {
    delete formData.password
    delete formData.confirmPassword
  }

  return formData
}

defineExpose({
  getFormData
})
</script>