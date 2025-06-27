// src/services/authService.js
import axios from 'axios'

const apiClient = axios.create({
    baseURL: 'http://localhost:8082/api',
    headers: {
        'Content-Type': 'application/json'
    }
})

// 使用命名导出而不是默认导出
export const login = async (credentials) => {
    try {
        const response = await apiClient.post('/auth/login', credentials)

        // 假设返回格式: { code: 200, data: { token: 'xxx', user: {...} } }
        if (response.data.code === 200) {
            return response.data.data
        } else {
            throw new Error(response.data.message || '登录失败')
        }
    } catch (error) {
        throw new Error(error.response?.data?.message || '登录请求失败')
    }
}