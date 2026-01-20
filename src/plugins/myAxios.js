import axios from 'axios'
import router from '@/config/router.js'
// 创建实例时配置默认值

export const BASE_URL =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:7777/api'
    : 'http://bc.seestars.top/api'

const myAxios = axios.create({
  baseURL: BASE_URL,
})

myAxios.defaults.withCredentials = true // 请求携带 cookie

// 添加请求拦截器
myAxios.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    // console.log('我要发请求')
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
    return response
  },
  function (error) {
    console.error('Request failed:', error.message, error.config, error.response)
    return Promise.reject(error)
  },
)

export default myAxios
