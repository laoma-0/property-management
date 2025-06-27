import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import HomeView from '@/views/HomeView.vue'
import { useUserStore } from '@/stores/userStore'

const routes = [
    {
        path: '/',
        redirect: '/login' // 将根路径重定向到登录页
    },
    {
        path: '/login',
        name: 'login',
        component: LoginView,
        meta: { requiresAuth: false }
    },
    {
        path: '/home',
        name: 'home',
        component: HomeView,
        meta: { requiresAuth: true } // 需要认证
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

// 路由守卫 - 检查认证状态
router.beforeEach((to, from, next) => {
    const userStore = useUserStore()

    // 检查目标路由是否需要认证
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!userStore.isAuthenticated) {
            // 如果未认证，重定向到登录页
            next({ name: 'login' })
        } else {
            // 已认证，允许访问
            next()
        }
    } else {
        // 不需要认证的路由，直接允许访问
        next()
    }
})

export default router