import { defineStore } from 'pinia'
import { login } from '@/services/authService'
import router from '@/router'

export const useUserStore = defineStore('user', {
    state: () => ({
        token: localStorage.getItem('token') || '',
        userInfo: JSON.parse(localStorage.getItem('userInfo') || 'null') // 修复这里
    }),

    actions: {
        async login(credentials) {
            try {
                const response = await login(credentials)

                // 保存到store
                this.token = response.token
                this.userInfo = response.user

                // 保存到本地存储
                localStorage.setItem('token', response.token)
                localStorage.setItem('userInfo', JSON.stringify(response.user))

                return Promise.resolve(response)
            } catch (error) {
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
        isAuthenticated: (state) => !!state.token
    }
})