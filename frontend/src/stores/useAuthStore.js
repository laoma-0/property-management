import { defineStore } from 'pinia';
import { login } from '@/services/authService';
import router from '@/router';

export const useAuthStore = defineStore('user', {
    state: () => ({
        token: localStorage.getItem('token') || '',
        userInfo: JSON.parse(localStorage.getItem('userInfo') || 'null')
    }),
    actions: {
        async login(credentials) {
            try {
                const response = await login(credentials);
                console.log('登录服务返回:', response);

                if (!response.token || !response.user) {
                    throw new Error('登录响应缺少必要字段');
                }

                this.token = response.token;
                this.userInfo = response.user;

                localStorage.setItem('token', response.token);
                localStorage.setItem('userInfo', JSON.stringify(response.user));

                console.log('Token存储:', localStorage.getItem('token'));
                console.log('用户信息存储:', localStorage.getItem('userInfo'));

                await router.push('/home');
                return Promise.resolve(response);
            } catch (error) {
                console.error('登录失败详情:', {
                    message: error.message,
                    credentials,
                    time: new Date().toISOString()
                });
                this.logout();
                return Promise.reject(error);
            }
        },
        logout() {
            this.token = '';
            this.userInfo = null;
            localStorage.removeItem('token');
            localStorage.removeItem('userInfo');
            router.push('/login');
        },
        async fetchCurrentUser() {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // 这里应该是调用API获取用户信息的逻辑
                    // 例如: this.userInfo = await getUserProfile()
                    this.token = token;

                    // 临时模拟数据 - 实际项目中应调用API
                    this.userInfo = {
                        id: 1,
                        username: 'admin',
                        role: 'admin'
                    };
                } catch (error) {
                    console.error('获取用户信息失败:', error);
                    this.logout();
                    throw error;
                }
            }
        }
    },
    getters: {
        isAuthenticated: (state) => !!state.token,
        username: (state) => state.userInfo?.username || ''
    }
});