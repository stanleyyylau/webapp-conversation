# 项目架构文档

## 项目概述

这是一个基于 Next.js 14 + TypeScript 构建的现代化聊天对话应用，采用了组件化架构设计。项目通过 Dify API 提供 AI 对话能力，支持多媒体文件上传、工作流可视化、多语言国际化等功能。

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **语言**: TypeScript 4.9.5
- **UI框架**: React 18.2.0
- **样式方案**: Tailwind CSS + CSS Modules + SCSS
- **状态管理**: React Hooks + Zustand
- **HTTP客户端**: Axios + dify-client
- **国际化**: i18next + react-i18next
- **代码编辑器**: Monaco Editor
- **构建工具**: Next.js内置构建系统
- **包管理器**: pnpm

## 项目结构

```
webapp-conversation/
├── app/                    # Next.js App Router 应用目录
│   ├── api/               # API 路由层
│   ├── components/        # React 组件库
│   ├── styles/           # 全局样式文件
│   ├── layout.tsx        # 应用布局组件
│   ├── page.tsx          # 首页组件
│   └── global.d.ts       # 全局类型定义
├── config/               # 应用配置文件
├── hooks/                # 自定义 React Hooks
├── i18n/                 # 国际化配置和语言包
├── service/              # API 服务层
├── types/                # TypeScript 类型定义
├── utils/                # 工具函数库
├── public/               # 静态资源文件
├── package.json          # 项目依赖和脚本
├── next.config.js        # Next.js 配置
├── tailwind.config.js    # Tailwind CSS 配置
└── tsconfig.json         # TypeScript 配置
```

## 核心功能模块

### 1. 聊天对话系统 (`app/components/chat/`)

**核心功能**:
- 实时聊天对话界面
- 支持文本、图片、文件等多媒体消息
- 流式响应显示
- 用户反馈系统（点赞/点踩）
- AI 思考过程可视化

**主要文件**:
- `index.tsx` - 聊天主容器组件
- `answer/index.tsx` - AI 回答组件
- `question/index.tsx` - 用户问题组件
- `thought/` - AI 思考过程组件
- `type.ts` - 聊天相关类型定义

**修改指南**:
- 新增消息类型: 修改 `types/app.ts` 中的 `ChatItem` 类型
- 修改UI样式: 编辑 `style.module.css` 文件
- 添加新功能: 在对应组件中扩展功能逻辑

### 2. API 服务层 (`app/api/`)

**架构设计**:
```
app/api/
├── chat-messages/route.ts     # 发送聊天消息
├── conversations/             # 对话管理
│   ├── route.ts              # 获取对话列表
│   └── [conversationId]/name/route.ts  # 重命名对话
├── file-upload/route.ts       # 文件上传
├── messages/                  # 消息管理
│   ├── route.ts              # 获取消息列表
│   └── [messageId]/feedbacks/route.ts  # 消息反馈
├── parameters/route.ts        # 获取应用参数
└── utils/common.ts           # 公共工具函数
```

**核心特性**:
- 统一的用户会话管理（基于 session_id）
- 与 Dify API 的封装集成
- 流式响应支持
- 错误处理和异常管理

**修改指南**:
- 新增 API 接口: 在 `app/api/` 下创建新的 `route.ts` 文件
- 修改请求参数: 更新对应路由文件中的请求处理逻辑
- 添加中间件: 在 `utils/common.ts` 中扩展公共功能

### 3. 组件系统 (`app/components/`)

**分层架构**:
```
components/
├── base/                 # 基础组件库（无业务逻辑）
│   ├── button/          # 按钮组件
│   ├── icons/           # 图标组件系统
│   ├── loading/         # 加载状态组件
│   ├── toast/           # 消息提示组件
│   └── ...
├── chat/                # 聊天业务组件
├── workflow/            # 工作流组件
├── sidebar/             # 侧边栏组件
├── welcome/             # 欢迎页组件
└── index.tsx            # 主应用组件
```

**设计模式**:
- **基础组件**: 纯 UI 组件，高度可复用
- **业务组件**: 包含特定业务逻辑的功能组件
- **容器组件**: 负责数据获取和状态管理

**修改指南**:
- 新增基础组件: 在 `base/` 目录下创建组件文件夹
- 修改现有组件: 直接编辑对应组件文件
- 添加业务功能: 在相应业务组件目录下扩展

### 4. 状态管理系统

**状态管理策略**:
- **全局状态**: 使用 Zustand 管理应用级状态
- **组件状态**: 使用 React Hooks (useState, useReducer)
- **服务端状态**: 使用 SWR 进行数据获取和缓存

**核心 Hooks**:
- `useConversation` - 对话状态管理
- `useBreakpoints` - 响应式断点管理
- `useImageFiles` - 图片文件管理

**修改指南**:
- 新增全局状态: 在 `hooks/` 目录下创建自定义 Hook
- 修改状态逻辑: 编辑对应的 Hook 文件
- 优化性能: 使用 React.memo 和 useMemo 进行优化

### 5. 样式系统

**多层样式架构**:
- **Tailwind CSS**: 原子化 CSS 框架，用于快速开发
- **CSS Modules**: 组件级样式隔离
- **全局样式**: 应用级通用样式和变量定义

**样式配置**:
```javascript
// tailwind.config.js
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: { /* 自定义颜色 */ },
      screens: { mobile: '100px', tablet: '640px', pc: '769px' }
    }
  }
}
```

**修改指南**:
- 修改主题配色: 编辑 `tailwind.config.js` 中的 colors 配置
- 添加组件样式: 在组件目录下创建 `.module.css` 文件
- 修改全局样式: 编辑 `app/styles/globals.css`

### 6. 国际化系统 (`i18n/`)

**多语言支持**:
- 支持语言: 中文、英文、日文、西班牙文、越南文
- 客户端和服务端渲染支持
- 动态语言切换

**文件结构**:
```
i18n/
├── client.ts             # 客户端 i18n 配置
├── server.ts             # 服务端 i18n 配置
├── index.ts              # 通用配置
└── lang/                 # 语言包文件
    ├── app.en.ts         # 应用相关英文
    ├── app.zh.ts         # 应用相关中文
    ├── common.en.ts      # 通用英文
    └── ...
```

**修改指南**:
- 新增语言: 在 `lang/` 目录下创建对应语言文件
- 添加翻译: 在相应语言文件中添加键值对
- 修改配置: 编辑 `client.ts` 或 `server.ts`

### 7. 工作流可视化 (`app/components/workflow/`)

**功能特性**:
- 节点状态可视化
- 执行过程实时追踪
- 多种节点类型支持
- 代码编辑器集成

**节点类型**:
- Start/End - 开始/结束节点
- LLM - 大语言模型节点
- Code - 代码执行节点
- HTTP - HTTP 请求节点
- 条件判断、变量赋值等

**修改指南**:
- 新增节点类型: 在 `types/app.ts` 中添加 `BlockEnum`
- 修改节点样式: 编辑 `block-icon.tsx`
- 扩展功能: 在 `workflow-process.tsx` 中添加逻辑

## 环境配置

### 环境变量配置

创建 `.env.local` 文件：
```bash
# Dify 应用配置
NEXT_PUBLIC_APP_ID=your_app_id
NEXT_PUBLIC_APP_KEY=your_api_key
NEXT_PUBLIC_API_URL=https://api.dify.ai/v1
```

### 应用配置 (`config/index.ts`)

```typescript
export const APP_INFO: AppInfo = {
  title: 'Chat APP',              // 应用标题
  description: '',                // 应用描述
  copyright: '',                  // 版权信息
  privacy_policy: '',             // 隐私政策
  default_language: 'en',         // 默认语言
}

export const isShowPrompt = false    // 是否显示提示
export const promptTemplate = ''     // 提示模板
```

## 开发指南

### 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 代码检查
pnpm lint

# 构建项目
pnpm build
```

### 添加新功能

1. **新增页面**:
   - 在 `app/` 目录下创建新的页面文件
   - 使用 Next.js App Router 约定

2. **新增组件**:
   - 基础组件: `app/components/base/`
   - 业务组件: `app/components/[feature]/`

3. **新增 API**:
   - 在 `app/api/` 下创建 `route.ts` 文件
   - 遵循 RESTful API 设计规范

4. **添加类型定义**:
   - 在 `types/` 目录下创建或修改类型文件
   - 保持类型定义的一致性

### 代码规范

- **TypeScript**: 严格类型检查
- **ESLint**: 代码质量检查
- **组件命名**: PascalCase
- **文件命名**: kebab-case
- **样式类名**: camelCase (CSS Modules)

### 性能优化

- 使用 `React.memo` 优化组件渲染
- 合理使用 `useMemo` 和 `useCallback`
- 图片和资源懒加载
- 代码分割和动态导入

## 部署指南

### Docker 部署

```bash
# 构建镜像
docker build . -t webapp-conversation:latest

# 运行容器
docker run -p 3000:3000 webapp-conversation:latest
```

### Vercel 部署

1. 连接 GitHub 仓库
2. 配置环境变量
3. 自动部署

**注意**: Vercel Hobby 计划可能会截断长消息

## 故障排除

### 常见问题

1. **应用无法启动**:
   - 检查环境变量是否正确配置
   - 确认 Dify API 连接正常

2. **国际化不生效**:
   - 检查语言包文件是否正确
   - 确认 i18n 配置是否正确

3. **样式问题**:
   - 检查 Tailwind CSS 配置
   - 确认 CSS Modules 导入正确

### 调试技巧

- 使用浏览器开发者工具
- 检查网络请求和响应
- 查看控制台错误信息
- 使用 React Developer Tools

## 扩展建议

### 功能扩展

1. **用户认证系统**
2. **聊天记录搜索**
3. **主题切换功能**
4. **移动端 PWA 支持**
5. **语音输入/输出**

### 技术改进

1. **单元测试覆盖**
2. **E2E 测试**
3. **性能监控**
4. **错误追踪**
5. **CI/CD 流水线**

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交代码变更
4. 发起 Pull Request
5. 代码审查通过后合并

## 技术支持

- 项目文档: 本文档
- 问题反馈: GitHub Issues
- 技术讨论: GitHub Discussions

---

**最后更新**: 2025-01-01
**文档版本**: v1.0.0