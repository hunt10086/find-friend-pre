declare module '@/plugins/myAxios.js' {
  import type { AxiosInstance } from 'axios'

  export const BASE_URL: string
  const myAxios: AxiosInstance
  export default myAxios
}
