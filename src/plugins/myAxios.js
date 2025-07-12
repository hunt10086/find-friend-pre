import axios from 'axios'
import router from '@/config/router.js'

// 创建实例时配置默认值
const myAxios = axios.create({
  baseURL: 'http://localhost:8080/api',
})

myAxios.defaults.withCredentials = true // 请求携带 cookie

// 添加请求拦截器
myAxios.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    console.log('我要发请求')
    // router.push('/user/login');
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  },
)

// 添加响应拦截器
myAxios.interceptors.response.use(
  function (response) {
    if (response?.data?.code === 40100) {
      window.location.href = '/user/login'
    }
    console.log('Received response:', response)
    return response
  },
  function (error) {
    console.error('Request failed:', error.message, error.config, error.response)
    return Promise.reject(error)
  },
)

export default myAxios
