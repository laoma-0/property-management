import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:8082/api'
})

// 请求拦截器：添加token
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// 响应拦截器：处理错误
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response.status === 401) {
            // token过期处理
            const userStore = useUserStore()
            userStore.logout()
        }
        return Promise.reject(error)
    }
)

export default api