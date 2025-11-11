# SPEED 项目进度报告

## 当前迭代状态

**总体进度：Iteration 1 完成，Iteration 2 基本完成，Iteration 3 正在推进（多项已完成）**

---

## ✅ 已完成功能

### 🔐 认证与授权系统 (100% 完成)

#### 后端

- ✅ JWT 认证机制
- ✅ 用户注册 API (`POST /auth/register`)
- ✅ 用户登录 API (`POST /auth/login`)
- ✅ 用户资料获取 API (`POST /auth/profile`)
- ✅ `JwtAuthGuard` - JWT 令牌验证
- ✅ `RolesGuard` - 基于角色的访问控制
- ✅ `@Roles()` 装饰器 - 声明式权限控制
- ✅ 密码加密（bcrypt）
- ✅ 多角色支持（submitter, moderator, analyst, admin）

#### 前端

- ✅ 登录页面 (`/login`)
- ✅ 注册页面 (`/register`)
- ✅ 认证上下文 (`AuthContext`)
- ✅ 自动 JWT 令牌管理
- ✅ 基于角色的 UI 显示/隐藏

---

### 👥 用户管理模块 (100% 完成 - 仅后端)

#### 后端

- ✅ 用户 CRUD API（管理员专用）
- ✅ 用户角色管理
- ✅ 用户状态管理（激活/禁用）
- ✅ 用户查询（按 ID、按邮箱）

#### 前端

- ⏳ 用户管理界面（待实现）

---

### 📄 文章管理模块 (后端 100%，前端 80%)

#### 后端

- ✅ 文章提交 API (`POST /articles`)
- ✅ 文章列表查询 (`GET /articles`)
- ✅ 文章详情查询 (`GET /articles/:id`)
- ✅ 我的提交查询 (`GET /articles/my-submissions`)
- ✅ 待审核队列 (`GET /articles/pending-review`)
- ✅ 待分析队列 (`GET /articles/pending-analysis`)
- ✅ 文章审核 API (`POST /articles/:id/approve`)
- ✅ 文章拒绝 API (`POST /articles/:id/reject`)
- ✅ 文章更新 API (`PATCH /articles/:id`)
- ✅ 文章删除 API (`DELETE /articles/:id`)
- ✅ 文章状态管理（pending_review, approved, rejected, pending_analysis, analyzed, published）
- ✅ 重复检查（基于 DOI）

#### 前端

- ✅ 文章提交页面 (`/submit`)
  - 完整表单（标题、作者、年份、DOI、期刊等）
  - 表单验证
  - 提交成功反馈
  - ✅ BibTeX 上传解析（预填表单字段）
- ✅ 我的提交列表页面 (`/my-submissions`)
- ✅ 文章详情页面 (`/articles/:id`)
- ✅ 审核员仪表板 (`/moderate`)：待审核列表、批准/拒绝
- ✅ 分析师仪表板 (`/analyze`)：待分析列表、证据录入

---

### 🔍 搜索功能模块 (后端 100%，前端 100%)

#### 后端

- ✅ 基础文章搜索 (`GET /search/articles?q=query`)
- ✅ 按 SE Practice 搜索 (`GET /search/se-practice?practice=name`)
- ✅ 按 Claim 搜索 (`GET /search/claim?claim=text`)
- ✅ 高级搜索 (`GET /search/advanced`) - 支持多条件过滤
  - 关键词搜索
  - SE Practice 过滤
  - Claim 过滤
  - 年份范围过滤
  - 证据结果过滤

#### 前端

- ✅ 基础搜索页面 (`/search`)
  - 标题搜索
  - 结果列表显示
- ✅ 高级搜索界面（已接入后端 /search/advanced）
  - ✅ Claim 过滤
  - ✅ 年份范围过滤
  - ✅ 客户端结果排序（Year/Title/Journal，Asc/Desc）
  - ✅ 结果卡片展示 Journal、DOI、平均评分
  - ✅ 预定义 SE Practice 下拉选择与 Claim 联动
  - ✅ 结果列自定义（Authors/Year/Journal/DOI/Rating）

---

### 📊 证据管理模块 (后端 100%，前端 基本完成)

#### 后端

- ✅ 证据创建 API (`POST /evidence`)
- ✅ 证据列表查询 (`GET /evidence`)
- ✅ 证据详情查询 (`GET /evidence/:id`)
- ✅ 按文章查询证据 (`GET /evidence/article/:articleId`)
- ✅ 按 SE Practice 查询证据 (`GET /evidence?sePractice=name`)
- ✅ 证据更新 API (`PATCH /evidence/:id`)
- ✅ 证据删除 API (`DELETE /evidence/:id`)
- ✅ 证据状态管理（isPublished）

#### 前端

- ✅ 证据输入界面（分析师仪表板弹窗）
- ✅ 证据列表页面 `/evidence`
- ✅ 证据编辑页面 `/evidence/[id]/edit`

---

### ⭐ 评分模块 (新增)

#### 后端

- ✅ 文章评分数据模型（ratings, averageRating）
- ✅ 用户评分接口 `POST /articles/:id/rate`

#### 前端

- ✅ 文章详情页评分交互（星级打分，显示平均分）

---

### 🔐 密码重置（Iteration 3）

#### 后端

- ✅ 请求重置接口 `POST /auth/request-reset { email }`（测试返回 token）
- ✅ 重置密码接口 `POST /auth/reset-password { token, password }`

#### 前端

- ✅ 重置申请页 `/reset/request`
- ✅ 持 token 重置页 `/reset/[token]`

---

### ✏️ 提交者编辑待审核（Iteration 3）

#### 后端

- ✅ 既有 PATCH `/articles/:id` 校验：仅提交者且 `pending_review` 可改

#### 前端

- ✅ 编辑页 `/submit/[id]/edit`
- ✅ “我的提交”页为 `pending_review` 提供 Edit 入口

---

### 🎨 前端基础设施 (100% 完成)

- ✅ Next.js 14 App Router 配置
- ✅ TypeScript 配置
- ✅ Tailwind CSS 配置
- ✅ 全局布局 (`layout.tsx`)
- ✅ 导航栏组件（基于角色动态显示）
- ✅ API 客户端（Axios，自动 JWT 注入）
- ✅ 错误处理机制
- ✅ 响应式设计

---

## 📋 按迭代计划分类

### Iteration 1: MVP Core - "概念验证与基本用户流" ✅ 95% 完成

#### ✅ 已完成

- ✅ 用户注册和登录（前后端）
- ✅ JWT 认证（前后端）
- ✅ 基础文章提交表单（前后端）
- ✅ 公共搜索页面（前后端）
- ✅ 基础结果展示（前端）
- ✅ 项目基础设施（Git, README, 配置）

#### ⏳ 待完成

- ⏳ 文章详情页面（Iteration 1 的扩展）

---

### Iteration 2: Workflow & Enhancement - "核心流程实现与搜索增强" ✅ ~100% 完成

#### ✅ 后端已完成

- ✅ 增强的 RBAC 系统（RolesGuard）
- ✅ 扩展的文章提交字段
- ✅ 完整的审核工作流 API
- ✅ 完整的分析工作流 API
- ✅ 增强的搜索 API（SE Practice, Claim, 年份过滤）
- ✅ 文章状态管理

#### ⏳ 前端剩余项

- ⏳ 邮件通知（可选）

---

### Iteration 3: Refinement & Administration - "产品就绪与质量提升" 🚧 进行中

#### ⏳ 待实现功能

- ✅ 密码重置功能
- ✅ 提交者编辑待审核文章
- ⏳ 分析草稿保存
- ✅ 用户自定义结果列
- ⏳ 保存和管理自定义查询
- ⏳ **管理员模块** (`/admin`)
  - 用户管理界面
  - 系统配置管理（SE Practices, Claims 等）
  - 文章和证据数据管理
  - 系统健康监控
- ⏳ 全面的错误处理和日志
- ⏳ 数据库性能优化（索引）
- ⏳ UI/UX 改进和可访问性
- ⏳ 单元测试和集成测试

---

## 📊 完成度统计

### 后端 API

- **认证模块**: 100% ✅
- **用户管理**: 100% ✅
- **文章管理**: 100% ✅
- **证据管理**: 100% ✅
- **搜索功能**: 100% ✅

**后端总体完成度: ~100%** ✅

### 前端界面

- **认证页面**: 100% ✅
- **首页**: 100% ✅
- **文章提交**: 100% ✅（含 BibTeX 预填、zod 校验）
- **搜索**: 100% ✅（Claim/年份/排序/评级展示；Practice/Claim 下拉；列自定义）
- **审核员界面**: 100% ✅
  |- **分析师界面**: 100% ✅（含证据录入、列表、编辑）
- **管理员界面**: 50% 🚧（用户管理页已实现）
- **文章详情**: 100% ✅（含评分、元数据）

**前端总体完成度: ~90%** 🚧

### 整体项目

**总体完成度: ~90%** 🚧

---

## 🎯 下一步优先任务

### 高优先级（Iteration 2 核心功能）

1. **审核员仪表板** (`/moderate`)

   - 待审核文章列表
   - 文章详情查看
   - 批准/拒绝操作

2. **分析师仪表板** (`/analyze`)

   - 待分析文章列表
   - 证据输入表单
   - SE Practice 和 Claim 选择

3. **文章详情页面** (`/articles/:id`)
   - 显示完整文章信息
   - 显示关联的证据数据

### 中优先级（Iteration 2 增强功能）

4. 增强的搜索界面

   - SE Practice 下拉选择
   - 年份范围过滤
   - 结果排序

5. 我的提交列表页面
   - 显示用户提交的所有文章
   - 显示文章状态

### 低优先级（Iteration 3）

6. Bibtex 文件上传和解析
7. 用户评分功能
8. 管理员模块

---

## 📝 技术债务

- ⚠️ 缺少前端路由保护（需要实现 ProtectedRoute 组件）
- ⚠️ 缺少错误边界（Error Boundary）
- ⚠️ 缺少加载状态统一管理
- ⚠️ 缺少表单验证库集成（可考虑 react-hook-form + zod）
- ⚠️ 缺少 API 错误统一处理
- ⚠️ 缺少测试代码

---

## 🚀 部署状态

- ⏳ 开发环境：本地开发配置完成
- ⏳ 生产环境：待配置
- ⏳ CI/CD：待配置

---

_最后更新: 2025 年_
