import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        currentUser: null,
        token: null
    }),
    actions: {
        async fetchCurrentUser() {
            // 如果已有当前用户，直接返回
            if (this.currentUser) return

            const token = localStorage.getItem('token')
            if (token) {
                try {
                    // 这里应该是调用API获取用户信息的逻辑
                    // 例如: this.currentUser = await getUserProfile()
                    this.token = token

                    // 临时模拟数据 - 实际项目中应调用API
                    this.currentUser = {
                        id: 1,
                        username: 'admin',
                        role: 'admin'
                    }
                } catch (error) {
                    console.error('获取用户信息失败:', error)
                    this.logout()
                    throw error
                }
            }
        },
        logout() {
            this.currentUser = null;
            this.token = null;
            localStorage.removeItem('token');
        }
    }
});