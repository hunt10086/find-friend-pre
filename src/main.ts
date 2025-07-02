import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import  Vant  from 'vant'
import 'vant/lib/index.css';
import router from './config/router'
import 'vant/lib/index.css';
const app = createApp(App)

app.use(createPinia())
app.use(Vant)
app.use(router)
app.mount('#app')



// 3. 注册你需要的组件
