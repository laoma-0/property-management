import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/LoginView.vue';
import HomeView from '@/views/HomeView.vue';
import DebugView from '@/views/util/DebugView.vue';
import UserManagement from '@/views/user/UserManagement.vue';
import { useAuthStore } from '@/stores/useAuthStore.js';
import { ElMessage } from 'element-plus';
import MainLayout from "@/components/layout/MainLayout.vue"; // 确保路径正确

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
        path: '/HomeView',
        name: 'HomeView',
        component: HomeView,
        meta: {
            breadcrumb: '控制台'
        }
    },
    {
        path: '/',
        component: MainLayout, // 布局组件
        children: [
            {
                path: 'home',
                name: 'home',
                component: HomeView,
                meta: { breadcrumb: '控制台', requiresAuth: true }
            },
            {
                path: 'user-management',
                name: 'UserManagement',
                component: UserManagement,
                meta: { breadcrumb: '用户管理', requiresAuth: true, requiresAdmin: true }
            },
            // {
            //     path: 'settings',
            //     name: 'settings',
            //     component: () => import('@/views/Settings.vue'),
            //     meta: { breadcrumb: '系统设置', requiresAuth: true }
            // },
            // 其他需要共享布局的路由...
        ]
    },
    // {
    //     path: '/:pathMatch(.*)*',
    //     name: 'NotFound',
    //     component: () => import('@/views/NotFound.vue')
    // },
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
        component: () => import('@/views/util/DateUtilsDemo.vue'),
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
                next({ name: 'HomeView' });
                return;
            }
        }
    }

    next();
});

export default router;