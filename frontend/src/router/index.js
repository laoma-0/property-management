import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/LoginView.vue';
import HomeView from '@/views/HomeView.vue';
import DebugView from '@/views/DebugView.vue';
import UserManagement from '@/views/user/List.vue';
import { useAuthStore } from '@/stores/useAuthStore.js';
import {ElMessage} from "element-plus"; // 确保路径正确

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'login',
        component: LoginView,
        meta: {
            requiresAuth: false,
            title: '登录'
        }
    },
    {
        path: '/home',
        name: 'home',
        component: HomeView,
        meta: {
            requiresAuth: true,
            title: '首页'
        }
    },
    {
        path: '/user/list',
        name: 'UserManagement',
        component: UserManagement,
        meta: {
            title: '用户管理',
            requiresAuth: true,
            roles: ['admin'] // 确保与后端角色标识一致
        }
    },
    {
        path: '/debug',
        name: 'debug',
        component: DebugView,
        meta: {
            requiresAuth: false,
            title: '调试页面'
        }
    },
    {
        path: '/date-utils-demo',
        name: 'DateUtilsDemo',
        component: () => import('@/views/DateUtilsDemo.vue'),
        meta: {
            title: '日期工具演示',
            requiresAuth: false
        }
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();
    const title = to.meta.title || '物业管理系统';
    document.title = `${title} - 物业管理系统`;

    // 检查是否需要登录
    if (to.meta.requiresAuth) {
        // 尝试获取当前用户
        try {
            await authStore.fetchCurrentUser();
        } catch (error) {
            console.error('获取用户信息失败:', error);
        }

        // 检查用户是否认证
        if (!authStore.isAuthenticated) {
            next({
                name: 'login',
                query: { redirect: to.fullPath }
            });
            return;
        }

        // 检查角色权限
        if (to.meta.roles) {
            const userRole = authStore.userInfo?.role || '';
            if (!to.meta.roles.includes(userRole)) {
                // 无权限访问，重定向到首页或提示
                ElMessage.warning('您没有权限访问此页面');
                next({ name: 'home' });
                return;
            }
        }
    }

    next();
});

export default router;