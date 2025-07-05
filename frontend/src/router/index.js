import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/LoginView.vue';
import HomeView from '@/views/HomeView.vue';
import DebugView from '@/views/util/DebugView.vue';
import UserManagement from '@/views/user/UserManagement.vue';
import { useAuthStore } from '@/stores/useAuthStore.js';
import { ElMessage } from 'element-plus';
import MainLayout from "@/components/layout/MainLayout.vue";

const routes = [
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/login',
        name: 'login',
        component: LoginView,
        meta: {
            requiresAuth: false,
            title: '登录',
            // guest: true // 仅未登录用户可访问
        }
    },
    {
        path: '/',
        component: MainLayout, // 主布局组件
        meta: { requiresAuth: true }, // 所有子路由都需要登录
        children: [
            {
                path: 'home',
                name: 'home',
                component: HomeView,
                meta: {
                    breadcrumb: '控制台',
                    title: '控制台',
                    roles: ['admin', 'owner'] // 所有角色都可访问
                }
            },
            {
                path: 'user-management',
                name: 'UserManagement',
                component: UserManagement,
                meta: {
                    breadcrumb: '用户管理',
                    title: '用户管理',
                    requiresAuth: true,
                    roles: ['admin'] // 仅管理员可访问
                }
            },
            // {
            //     path: 'property-management',
            //     name: 'PropertyManagement',
            //     component: () => import('@/views/property/PropertyManagement.vue'),
            //     meta: {
            //         breadcrumb: '物业管理',
            //         title: '物业管理',
            //         roles: ['admin'] // 仅管理员可访问
            //     }
            // },
            // {
            //     path: 'repair-management',
            //     name: 'RepairManagement',
            //     component: () => import('@/views/repair/RepairManagement.vue'),
            //     meta: {
            //         breadcrumb: '报修管理',
            //         title: '报修管理',
            //         roles: ['admin'] // 仅管理员可访问
            //     }
            // },
            // {
            //     path: 'payment-management',
            //     name: 'PaymentManagement',
            //     component: () => import('@/views/payment/PaymentManagement.vue'),
            //     meta: {
            //         breadcrumb: '缴费管理',
            //         title: '缴费管理',
            //         roles: ['admin'] // 仅管理员可访问
            //     }
            // },
            // {
            //     path: 'my-property',
            //     name: 'MyProperty',
            //     component: () => import('@/views/owner/MyProperty.vue'),
            //     meta: {
            //         breadcrumb: '我的房产',
            //         title: '我的房产',
            //         roles: ['owner'] // 仅业主可访问
            //     }
            // },
            // {
            //     path: 'my-repairs',
            //     name: 'MyRepairs',
            //     component: () => import('@/views/owner/MyRepairs.vue'),
            //     meta: {
            //         breadcrumb: '我的报修',
            //         title: '我的报修',
            //         roles: ['owner'] // 仅业主可访问
            //     }
            // },
            // {
            //     path: 'my-bills',
            //     name: 'MyBills',
            //     component: () => import('@/views/owner/MyBills.vue'),
            //     meta: {
            //         breadcrumb: '我的账单',
            //         title: '我的账单',
            //         roles: ['owner'] // 仅业主可访问
            //     }
            // },
            // {
            //     path: 'profile',
            //     name: 'Profile',
            //     component: () => import('@/views/ProfileView.vue'),
            //     meta: {
            //         breadcrumb: '个人中心',
            //         title: '个人中心',
            //         roles: ['admin', 'owner'] // 所有角色都可访问
            //     }
            // },
            // 其他需要共享布局的路由...
        ]
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
        component: () => import('@/views/util/DateUtilsDemo.vue'),
        meta: {
            title: '日期工具演示',
            requiresAuth: false
        }
    },
    // 404 页面
    // {
    //     path: '/:pathMatch(.*)*',
    //     name: 'NotFound',
    //     component: () => import('@/views/NotFound.vue'),
    //     meta: {
    //         title: '页面未找到',
    //         requiresAuth: false
    //     }
    // }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();

    // 设置页面标题
    const title = to.meta.title || '物业管理系统';
    document.title = `${title} - 物业管理系统`;

    // 尝试获取当前用户信息（如果已登录）
    if (!authStore.userInfo && authStore.token) {
        try {
            await authStore.fetchCurrentUser();
        } catch (error) {
            console.error('获取用户信息失败:', error);
            // 清除无效token
            authStore.logout();
        }
    }

    // 检查是否需要登录
    if (to.meta.requiresAuth) {
        // 检查用户是否认证
        if (!authStore.isAuthenticated) {
            next({
                name: 'login',
                query: { redirect: to.fullPath }
            });
            return;
        }

        // 检查角色权限
        // if (to.meta.roles) {
        //     const userRole = authStore.userInfo?.role || '';
        //
        //     if (!userRole || !to.meta.roles.includes(userRole)) {
        //         // 无权限访问，重定向到首页并提示
        //         ElMessage.warning('您没有权限访问此页面');
        //         next({ name: 'home' });
        //         return;
        //     }
        // }
    }

    // 检查是否仅限未登录用户访问（如登录页）
    if (to.meta.guest && authStore.isAuthenticated) {
        next({ name: 'home' });
        return;
    }

    next();
});

export default router;