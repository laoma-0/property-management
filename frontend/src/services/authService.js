import apiClient from './apiClient'

export const login = async (credentials) => {
    try {
        const response = await apiClient.post('/auth/login', credentials)

        console.log('登录响应:', response)

        // 处理后端实际响应格式: { token: "...", username: "..." }
        if (response.token && response.username) {
            // 创建用户信息对象
            const userInfo = {
                username: response.username,
                // 其他可能的字段可以在这里添加或留空
            }

            return {
                token: response.token,
                user: userInfo
            }
        } else {
            console.error('未知响应格式:', response)
            throw new Error('服务器返回了未知格式的响应')
        }
    } catch (error) {
        console.error('登录请求错误:', error)
        throw new Error(error.message || '登录失败')
    }
}