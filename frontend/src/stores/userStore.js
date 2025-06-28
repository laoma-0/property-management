import { defineStore } from 'pinia'
import { login } from '@/services/authService'
import router from '@/router'

export const useUserStore = defineStore('user', {
    state: () => ({
        token: localStorage.getItem('token') || '',
        userInfo: JSON.parse(localStorage.getItem('userInfo') || 'null')
    }),

    actions: {
        async login(credentials) {
            try {
                const response = await login(credentials)

                console.log('登录服务返回:', response)

                // 确保必要字段存在
                if (!response.token || !response.user) {
                    throw new Error('登录响应缺少必要字段')
                }

                // 保存到store
                this.token = response.token
                this.userInfo = response.user

                // 保存到本地存储
                localStorage.setItem('token', response.token)
                localStorage.setItem('userInfo', JSON.stringify(response.user))

                // 打印存储结果验证
                console.log('Token存储:', localStorage.getItem('token'))
                console.log('用户信息存储:', localStorage.getItem('userInfo'))

                // 重定向到首页
                router.push('/home')

                return Promise.resolve(response)
            } catch (error) {
                console.error('登录失败详情:', {
                    message: error.message,
                    credentials,
                    time: new Date().toISOString()
                })

                this.logout()
                return Promise.reject(error)
            }
        },

        logout() {
            this.token = ''
            this.userInfo = null
            localStorage.removeItem('token')
            localStorage.removeItem('userInfo')
            router.push('/login')
        }
    },

    getters: {
        isAuthenticated: (state) => !!state.token,
        username: (state) => state.userInfo?.username || ''
    }
})