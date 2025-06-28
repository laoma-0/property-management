import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)
const pinia = createPinia()

// 全局错误处理
app.config.errorHandler = (err) => {
    console.error('全局错误:', err)
    // 确保 ElementPlus 已初始化
    if (app._context.components.ElMessage) {
        app._context.components.ElMessage.error(err.message || '发生未知错误')
    }
}

app.use(router)
app.use(pinia)
app.use(ElementPlus)

app.mount('#app')