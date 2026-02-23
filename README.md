# FindFriend 前端

一个基于 Vue 3 + TypeScript 的社交发现平台，用于寻找队友和朋友。

## 技术栈

- **框架**: Vue 3 (Composition API)
- **语言**: TypeScript
- **构建工具**: Vite
- **路由**: Vue Router 4
- **状态管理**: Pinia
- **UI 组件库**: Vant 4
- **HTTP 客户端**: Axios

## 功能模块

- 用户注册 / 登录 / 找回密码
- 个人资料管理
- 团队创建与管理
- 成员系统
- 博客发布与评论
- 实时团队聊天
- 基于位置的用户发现
- 搜索与筛选

## 环境要求

- Node.js 18+
- npm 9+

## 安装部署

### 1. 克隆项目

```bash
git clone https://github.com/your-repo/findFriend-front-vue.git
cd findFriend-front-vue
```

### 2. 安装依赖

```bash
npm install
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:9090

### 4. 构建生产版本

```bash
npm run build
```

构建产物输出到 `dist` 目录

## 项目命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm run type-check` | TypeScript 类型检查 |
| `npm run lint` | ESLint 代码检查 |
| `npm run format` | Prettier 代码格式化 |
| `npm run api` | 从后端获取并生成 API |

## API 生成

项目使用 OpenAPI 规范自动生成 TypeScript API：

```bash
# 获取后端 OpenAPI 文档并生成 API
npm run api
```

后端需运行在 http://localhost:7777

## 相关链接

- [后端项目](https://github.com/your-repo/findFriend-back)
- [Vue 3 文档](https://vuejs.org/)
- [Vant 4 文档](https://vant-ui.github.io/vant/)
