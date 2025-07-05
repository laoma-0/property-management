import apiClient from './apiClient';

const userService = {
    /**
     * 获取用户列表
     * @param {Object} params - 查询参数
     * @param {number} params.page - 页码
     * @param {number} params.pageSize - 每页数量
     * @param {string} [params.username] - 用户名
     * @param {string} [params.phone] - 手机号
     * @param {string} [params.email] - 邮箱
     * @param {'owner'|'admin'} [params.role] - 角色
     * @param {0|1} [params.status] - 用户状态 (0-禁用, 1-启用)
     * @returns {Promise<{data: Array, total: number}>}
     */
    async getUsers(params = {}) {
        try {
            const response = await apiClient.get('/users', { params });

            // 根据实际 API 响应格式调整
            if (Array.isArray(response.data) && typeof response.total === 'number') {
                return response;
            } else if (Array.isArray(response)) {
                // 如果后端直接返回数组
                return {
                    data: response,
                    total: response.length
                };
            }

            throw new Error('无效的用户列表响应格式');
        } catch (error) {
            console.error('获取用户列表失败:', error);
            throw error;
        }
    },

    /**
     * 获取单个用户详情
     * @param {number} userId - 用户ID
     * @returns {Promise<Object>}
     */
    async getUserById(userId) {
        try {
            const response = await apiClient.get(`/users/${userId}`);

            // 根据实际 API 响应格式调整
            if (response.userId) {
                return response;
            }

            throw new Error('无效的用户详情响应格式');
        } catch (error) {
            console.error(`获取用户详情失败 (ID: ${userId}):`, error);
            throw error;
        }
    },

    /**
     * 创建用户
     * @param {Object} userData - 用户数据
     * @param {string} userData.username - 用户名
     * @param {string} userData.password - 密码
     * @param {string} userData.phone - 手机号
     * @param {string} [userData.email] - 邮箱
     * @param {'owner'|'admin'} [userData.role] - 角色 (默认 'owner')
     * @param {0|1} [userData.status] - 状态 (默认 1)
     * @returns {Promise<Object>}
     */
    async createUser(userData) {
        try {
            // 根据实际 API 要求调整参数结构
            const payload = {
                ...userData,
                // 如果有必要，添加后端需要的额外字段
            };

            const response = await apiClient.post('/users', payload);

            if (response.userId) {
                return response;
            }

            throw new Error('无效的用户创建响应格式');
        } catch (error) {
            console.error('创建用户失败:', error);
            throw error;
        }
    },

    /**
     * 更新用户信息
     * @param {number} userId - 用户ID
     * @param {Object} updateData - 更新数据
     * @param {string} [updateData.username] - 用户名
     * @param {string} [updateData.phone] - 手机号
     * @param {string} [updateData.email] - 邮箱
     * @param {'owner'|'admin'} [updateData.role] - 角色
     * @param {0|1} [updateData.status] - 状态
     * @returns {Promise<Object>}
     */
    async updateUser(userId, updateData) {
        try {
            const response = await apiClient.put(`/users/update/${userId}`, updateData);

            if (response.userId) {
                return response;
            }

            throw new Error('无效的用户更新响应格式');
        } catch (error) {
            console.error(`更新用户失败 (ID: ${userId}):`, error);
            throw error;
        }
    },

    /**
     * 禁用用户
     * @param {number} userId - 用户ID
     * @returns {Promise<Object>}
     */
    async disableUser(userId) {
        try {
            const response = await apiClient.put(`/users/disable/${userId}`);

            // 根据实际 API 响应格式调整
            if (response.success || response.userId) {
                return response;
            }

            throw new Error('无效的禁用用户响应格式');
        } catch (error) {
            console.error(`禁用用户失败 (ID: ${userId}):`, error);
            throw error;
        }
    },

    /**
     * 启用用户
     * @param {number} userId - 用户ID
     * @returns {Promise<Object>}
     */
    async enableUser(userId) {
        try {
            const response = await apiClient.put(`/users/enable/${userId}`);

            // 根据实际 API 响应格式调整
            if (response.success || response.userId) {
                return response;
            }

            throw new Error('无效的启用用户响应格式');
        } catch (error) {
            console.error(`启用用户失败 (ID: ${userId}):`, error);
            throw error;
        }
    },

    /**
     * 删除用户
     * @param {number} userId - 用户ID
     * @returns {Promise<Object>}
     */
    async deleteUser(userId) {
        try {
            const response = await apiClient.delete(`/users/${userId}`);

            // 根据实际 API 响应格式调整
            if (response.success || response.deleted) {
                return response;
            }

            throw new Error('无效的删除用户响应格式');
        } catch (error) {
            console.error(`删除用户失败 (ID: ${userId}):`, error);
            throw error;
        }
    },

    /**
     * 用户登录
     * @param {Object} credentials - 登录凭证
     * @param {string} credentials.username - 用户名
     * @param {string} credentials.password - 密码
     * @returns {Promise<{token: string, user: Object}>}
     */
    async login(credentials) {
        try {
            const response = await apiClient.post('/auth/login', credentials);

            if (response.token && response.username) {
                return {
                    token: response.token,
                    user: {
                        userId: response.userId || null,
                        username: response.username,
                        role: response.role || 'owner',
                        // 其他可能的用户字段
                    }
                };
            }

            throw new Error('无效的登录响应格式');
        } catch (error) {
            console.error('登录失败:', error);
            throw error;
        }
    },

    /**
     * 用户注册
     * @param {Object} userData - 用户数据
     * @param {string} userData.username - 用户名
     * @param {string} userData.password - 密码
     * @param {string} userData.phone - 手机号
     * @param {string} [userData.email] - 邮箱
     * @returns {Promise<Object>}
     */
    async register(userData) {
        try {
            const response = await apiClient.post('/auth/register', userData);

            if (response.userId) {
                return response;
            }

            throw new Error('无效的注册响应格式');
        } catch (error) {
            console.error('注册失败:', error);
            throw error;
        }
    }
};

export default userService;