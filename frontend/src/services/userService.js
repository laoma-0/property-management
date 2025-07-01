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

    // 添加与组件中名称一致的方法
    createUser: async (userData) => {
        return this.register(userData);
    },

    // 获取所有用户
    getUsers: async (params) => {
        const response = await api.get('/users', { params })
        return response.data
    },

    // 添加与组件中名称一致的方法
    fetchUserList: async (params) => {
        return this.getUsers(params);
    },

    // 获取单个用户
    getUser: async (id) => {
        const response = await api.get(`/users/${id}`)
        return response.data
    },

    // 更新用户
    updateUser: async (id, userData) => {
        const response = await api.put(`/users/update`, { id, ...userData })
        return response.data
    },

    // 禁用/启用用户
    toggleUserStatus: async (id) => {
        const response = await api.put(`/users/disable/${id}`)
        return response.data
    },

    // 添加与组件中名称一致的方法
    deleteUser: async (id) => {
        return this.toggleUserStatus(id);
    }
}

export default userService