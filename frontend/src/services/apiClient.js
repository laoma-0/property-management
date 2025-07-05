import axios from 'axios';
import { ElMessage } from 'element-plus';
import router from '@/router';

// 创建 axios 实例
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082/api',
    timeout: 10000, // 请求超时时间
    headers: {
        'Content-Type': 'application/json',
    },
});

// 请求拦截器 - 添加认证令牌
apiClient.interceptors.request.use(
    (config) => {
        // 从本地存储获取 token
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 响应拦截器 - 统一处理错误
apiClient.interceptors.response.use(
    (response) => {
        // 直接返回响应数据
        return response.data;
    },
    (error) => {
        // 处理错误响应
        if (error.response) {
            const { status, data } = error.response;

            // 处理特定状态码
            switch (status) {
                case 401:
                    // 未授权，跳转到登录页
                    ElMessage.error('会话已过期，请重新登录');
                    localStorage.removeItem('authToken');
                    router.push('/login');
                    break;
                case 403:
                    // 禁止访问
                    ElMessage.error('您没有权限执行此操作');
                    break;
                case 404:
                    // 资源不存在
                    ElMessage.error('请求的资源不存在');
                    break;
                case 500:
                    // 服务器错误
                    ElMessage.error('服务器内部错误');
                    break;
                default:
                    // 其他错误
                    if (data && data.message) {
                        ElMessage.error(data.message);
                    } else {
                        ElMessage.error(`请求失败: ${status}`);
                    }
            }
        } else {
            // 请求未发送成功
            ElMessage.error('网络错误，请检查网络连接');
        }

        return Promise.reject(error);
    }
);

export default apiClient;