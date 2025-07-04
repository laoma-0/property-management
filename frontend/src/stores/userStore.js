import { defineStore } from 'pinia';
import userService from '@/services/userService.js';

export const useUserStore = defineStore('user', {
    state: () => ({
        currentUser: null,
        token: null,
        users: [],
        filteredUsers: [],
        pagination: {
            currentPage: 1,
            pageSize: 10,
            total: 0
        },
        searchQuery: '',
        roleFilter: 'all',
        loading: false
    }),
    actions: {
        async fetchCurrentUser() {
            // 如果已有当前用户，直接返回
            if (this.currentUser) return;

            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // 这里应该是调用API获取用户信息的逻辑
                    // 例如: this.currentUser = await getUserProfile()
                    this.token = token;

                    // 临时模拟数据 - 实际项目中应调用API
                    this.currentUser = {
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
        },
        logout() {
            this.currentUser = null;
            this.token = null;
            localStorage.removeItem('token');
        },
        async fetchUsers() {
            this.loading = true;
            try {
                const params = {
                    page: this.pagination.currentPage,
                    pageSize: this.pagination.pageSize,
                    search: this.searchQuery,
                    role: this.roleFilter === 'all' ? '' : this.roleFilter
                };
                const response = await userService.getUsers(params);
                this.users = response.data;
                this.pagination.total = response.total;
                this.filteredUsers = this.users;
            } catch (error) {
                console.error('获取用户列表失败:', error);
            } finally {
                this.loading = false;
            }
        },
        async createUser(userData) {
            try {
                await userService.createUser(userData);
            } catch (error) {
                console.error('创建用户失败:', error);
                throw error;
            }
        },
        async updateUser(id, userData) {
            try {
                await userService.updateUser(id, userData);
            } catch (error) {
                console.error('更新用户失败:', error);
                throw error;
            }
        },
        async toggleUserStatus(id) {
            try {
                await userService.toggleUserStatus(id);
            } catch (error) {
                console.error('切换用户状态失败:', error);
                throw error;
            }
        },
        setSearchQuery(query) {
            this.searchQuery = query;
            this.fetchUsers();
        },
        setRoleFilter(filter) {
            this.roleFilter = filter;
            this.fetchUsers();
        },
        setPage(page) {
            this.pagination.currentPage = page;
            this.fetchUsers();
        }
    }
});