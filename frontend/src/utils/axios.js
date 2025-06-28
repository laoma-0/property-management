// src/utils/axios.js
import axios from 'axios'

const apiClient = axios.create({
    baseURL: 'http://localhost:8082/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

// 请求拦截器
apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
}, error => {
    return Promise.reject(error)
})

// 响应拦截器
apiClient.interceptors.response.use(
    response => {
        // 统一处理成功响应
        return response.data
    },
    error => {
        // 统一处理错误响应
        const errorMessage = error.response?.data?.message ||
            error.message ||
            '网络请求失败'

        console.error('API 错误:', {
            status: error.response?.status,
            message: errorMessage,
            url: error.config?.url,
            method: error.config?.method
        })

        return Promise.reject(new Error(errorMessage))
    }
)

export default apiClient