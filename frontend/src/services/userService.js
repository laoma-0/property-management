import api from './apiClient'

const userService = {
    // 用户登录
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials)
        return response.data
    },

    // 用户注册
    register: async (userData) => {
        const response = await api.post('/auth/register', userData)
        return response.data
    },

    // 添加用户 (与组件中使用的方法名一致)
    createUser: async (userData) => {
        return this.register(userData);
    },

    // 获取所有用户
    getUsers: async (params) => {
        const response = await api.get('/users', { params })
        return response.data
    },

    // 获取用户列表 (与组件中使用的方法名一致)
    fetchUserList: async (params) => {
        return this.getUsers(params);
    },

    // 获取单个用户
    getUser: async (id) => {
        const response = await api.get(`/users/${id}`)
        return response.data
    },

    // 更新用户
    updateUser: async (userData) => {
        const response = await api.put(`/users/update`, userData)
        return response.data
    },

    // 切换用户状态 (禁用/启用)
    toggleUserStatus: async (id) => {
        const response = await api.put(`/users/disable/${id}`)
        return response.data
    },

    // 删除用户 (与组件中使用的方法名一致)
    deleteUser: async (id) => {
        const response = await api.delete(`/users/${id}`)
        return response.data
    }
}

export default userService