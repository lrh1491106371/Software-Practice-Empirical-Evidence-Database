# Git Commit Message

## 简短版本（单行）

```
feat: 初始化 SPEED 项目 - 实现 Iteration 1 MVP 核心功能
```

## 详细版本（多行）

```
feat: 初始化 SPEED 项目 - 实现 Iteration 1 MVP 核心功能

实现了 Software Practice Empirical Evidence Database (SPEED) 的基础架构和核心功能。

后端 (Nest.js):
- 完整的认证授权系统 (JWT, RBAC)
- 用户管理模块 (CRUD, 角色管理)
- 文章管理模块 (提交, 审核, 状态管理)
- 证据管理模块 (CRUD, 查询)
- 搜索功能模块 (基础搜索, 高级搜索)
- MongoDB 数据库集成 (Mongoose)
- 输入验证和错误处理

前端 (Next.js):
- 用户认证界面 (登录, 注册)
- 文章提交页面
- 基础搜索页面
- 响应式导航栏 (基于角色)
- 认证上下文和状态管理
- Tailwind CSS 样式系统

项目配置:
- TypeScript 配置
- ESLint 和 Prettier 配置
- 环境变量配置
- 项目文档 (README, 架构文档, 迭代计划, 进度报告)

完成度: Iteration 1 (95%), Iteration 2 后端 (100%), 整体项目 (~70%)
```

## 英文版本

```
feat: Initialize SPEED project - Implement Iteration 1 MVP core features

Implemented the foundational architecture and core features for Software Practice 
Empirical Evidence Database (SPEED).

Backend (Nest.js):
- Complete authentication & authorization system (JWT, RBAC)
- User management module (CRUD, role management)
- Article management module (submission, review, status management)
- Evidence management module (CRUD, queries)
- Search functionality module (basic search, advanced search)
- MongoDB database integration (Mongoose)
- Input validation and error handling

Frontend (Next.js):
- User authentication pages (login, register)
- Article submission page
- Basic search page
- Responsive navbar (role-based)
- Authentication context and state management
- Tailwind CSS styling system

Project Configuration:
- TypeScript configuration
- ESLint and Prettier configuration
- Environment variables configuration
- Project documentation (README, architecture docs, iteration plan, progress report)

Completion: Iteration 1 (95%), Iteration 2 Backend (100%), Overall (~70%)
```

## 使用建议

### 选项 1: 使用简短版本
```bash
git commit -m "feat: 初始化 SPEED 项目 - 实现 Iteration 1 MVP 核心功能"
```

### 选项 2: 使用详细版本
```bash
git commit -F COMMIT_MESSAGE.md
# 或者手动复制详细版本的内容
```

### 选项 3: 分多个提交（推荐用于大型项目）

如果需要将这次提交拆分成多个小的提交，可以按模块分组：

1. **项目初始化**
```
chore: 初始化项目结构和配置文件
```

2. **后端核心模块**
```
feat(backend): 实现认证授权系统和用户管理模块
feat(backend): 实现文章管理模块和审核工作流
feat(backend): 实现证据管理模块和搜索功能
```

3. **前端核心页面**
```
feat(frontend): 实现用户认证界面和状态管理
feat(frontend): 实现文章提交和搜索页面
```

4. **文档**
```
docs: 添加项目文档和架构说明
```

