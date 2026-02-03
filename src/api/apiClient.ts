import { Api } from './api'
import myAxios from '@/plugins/myAxios.js'

/**
 * 自定义 API 客户端类
 * 继承 swagger-typescript-api 生成的 Api 类，并集成项目的 myAxios 实例
 */
class MyApiClient extends Api<unknown> {
  constructor() {
    super({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:7777/api',
    })

    // 使用项目的 axios 实例（已配置拦截器、认证等）
    this.instance = myAxios
  }
}

/**
 * 导出 API 实例（单例模式）
 *
 * 使用方式：
 * ```typescript
 * import { api } from '@/api/apiClient';
 *
 * // 用户相关
 * await api.user.getCurrentUser();
 * await api.user.userLogin({ userAccount: 'test', userPassword: '123' });
 *
 * // 博客相关
 * await api.blog.getBlogList(1);
 * await api.blog.createBlog({ title: 'Test', passage: 'Content' });
 *
 * // 队伍相关
 * await api.team.listTeams();
 * await api.team.addTeam({ teamName: 'MyTeam' });
 * ```
 */
export const api = new MyApiClient()

/**
 * 导出所有类型定义
 *
 * 使用方式：
 * ```typescript
 * import { type User, type BlogVO, type TeamDTO } from '@/api/apiClient';
 *
 * const user = ref<User | null>(null);
 * const blogs = ref<BlogVO[]>([]);
 * ```
 */
export * from './api'
