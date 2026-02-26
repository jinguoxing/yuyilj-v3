# 语义治理平台 - 代码结构文档

## 项目概述

本项目是一个基于 React 19 + TypeScript 的语义治理平台，提供表理解、对象生成、发布管理等功能。

### 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 19.0.0 | 前端框架 |
| TypeScript | 5.8.2 | 类型系统 |
| Vite | 6.2.0 | 构建工具 |
| Tailwind CSS | 4.1.14 | 样式框架 |
| React Router | 7.13.1 | 路由管理 |
| Motion (Framer) | 12.23.24 | 动画库 |
| Lucide React | 0.546.0 | 图标库 |

---

## 模块重构状态对比

### 已重构模块 ✅

以下模块已完成拆分重构，采用模块化组件结构：

| 模块 | 原文件大小 | 拆分后 | 文件数 | 主文件行数 |
|------|-----------|--------|--------|------------|
| **TableUnderstanding** | 654行 | ✅ 已拆分 | 11个文件 | 52行 |
| **SemanticObjects** | 1463行 | ✅ 已拆分 | 17个文件 | 215行 |

### 未重构模块 🔄

以下模块仍为单文件结构，建议后续重构：

| 模块 | 当前大小 | 复杂度 | 建议拆分优先级 |
|------|----------|--------|----------------|
| **SemanticInbox** | 503行 | 中 | 中 |
| **SemanticReleases** | 213行 | 低 | 低 |
| **SemanticWorkbench** | 317行 | 中 | 中 |

### 重构效果对比

```
改进前 (单文件模式):
src/pages/
├── TableUnderstanding.tsx      (654行)
├── SemanticObjects.tsx         (1463行)
├── SemanticInbox.tsx           (503行)
├── SemanticReleases.tsx        (213行)
└── SemanticWorkbench.tsx       (317行)

改进后 (模块化结构):
src/pages/
├── TableUnderstanding/          ✅ 已拆分 (11个文件)
│   ├── index.tsx               (52行)
│   ├── components/             (7个组件)
│   ├── hooks/                  (2个hooks)
│   └── BottomPanel/            (3个文件)
├── SemanticObjects/             ✅ 已拆分 (17个文件)
│   ├── index.tsx               (215行)
│   ├── components/             (6个组件)
│   ├── hooks/                  (3个hooks)
│   └── modals/                 (3个模态框)
├── SemanticInbox.tsx           🔄 待拆分 (503行)
├── SemanticReleases.tsx        🔄 待拆分 (213行)
└── SemanticWorkbench.tsx       🔄 待拆分 (317行)
```

---

## 项目结构

```
src/
├── components/           # 全局共享组件
│   └── copilot/
│       └── GlobalCopilot.tsx
├── layouts/              # 布局组件
│   └── SemanticLayout.tsx
├── lib/                  # 工具函数
│   └── utils.ts
├── pages/                # 页面组件
│   ├── SemanticWorkbench.tsx       # 工作台（单文件）
│   ├── SemanticInbox.tsx           # 收件箱（单文件）
│   ├── SemanticReleases.tsx        # 发布管理（单文件）
│   ├── TableUnderstanding/         # 表理解（已拆分）
│   └── SemanticObjects/            # 对象生成（已拆分）
├── services/             # API 服务
│   └── semanticApi.ts
├── main.tsx              # 应用入口
└── index.css             # 全局样式
```

---

## 表理解模块 (TableUnderstanding)

### 模块概述

表理解模块提供 AI 驱动的表结构分析功能，包括表类型推荐、主外键识别、使用影响分析等。

### 目录结构

```
src/pages/TableUnderstanding/
├── index.tsx                    # 主入口 (52行)
├── types.ts                     # TypeScript 类型定义 (66行)
├── constants.ts                 # Mock 数据和常量 (72行)
├── hooks/
│   ├── useTableData.ts          # 表数据管理 hook (30行)
│   └── useEditingState.ts       # 编辑状态管理 hook (37行)
├── components/
│   ├── TopBar.tsx               # 顶部导航栏 (83行)
│   ├── SummaryCard.tsx          # AI 表摘要卡片 (154行)
│   ├── StructureCard.tsx        # 结构与联接键卡片 (56行)
│   ├── CompositionCard.tsx      # 字段分布与角色卡片 (46行)
│   ├── UsageCard.tsx            # 使用与影响卡片 (46行)
│   ├── IssuesCard.tsx           # 阻塞项与建议卡片 (43行)
│   └── ConfirmationPanel.tsx   # 右侧确认面板 (115行)
└── BottomPanel/
    ├── index.tsx                # 底部面板容器 (56行)
    ├── PreviewTab.tsx           # 变更预览标签 (38行)
    └── AuditTab.tsx             # 审计与历史标签 (31行)
```

### 核心组件说明

#### 1. index.tsx - 主入口
- **职责**: 组合所有子组件，管理页面级状态
- **主要功能**:
  - 使用 `useTableData` hook 管理数据状态
  - 使用 `useEditingState` hook 管理编辑状态
  - 条件渲染底部面板
  - 路由到 `/semantic/table-understanding/:lvId`

#### 2. TopBar 组件
- **职责**: 顶部导航和操作栏
- **功能**:
  - 面包屑导航
  - 表基本信息展示
  - 质量门禁指标（MUST、Coverage、Risk）
  - 快捷操作按钮（重新分析、预览发布）

#### 3. SummaryCard 组件
- **职责**: AI 表摘要卡片
- **功能**:
  - 可编辑表名、粒度、业务描述
  - 表类型推荐展示
  - AI 推理过程展示

#### 4. StructureCard 组件
- **职责**: 结构与联接键展示
- **功能**:
  - 主键候选展示（含置信度和验证状态）
  - 外键候选展示（含匹配分数）

#### 5. ConfirmationPanel 组件
- **职责**: 策略确认面板
- **功能**:
  - 表类型选择
  - 粒度确认
  - 主键/外键选择
  - 风险与合规标签配置

#### 6. BottomPanel 组件
- **职责**: 变更预览和审计历史
- **功能**:
  - 变更 Diff 展示
  - 预估影响分析
  - 审计历史记录

### 数据流

```
用户操作 → index.tsx → useTableData/useEditingState
                ↓
         组件 Props 传递
                ↓
         子组件处理逻辑
                ↓
         更新父组件状态
```

---

## 对象生成模块 (SemanticObjects)

### 模块概述

对象生成模块提供 AI 驱动的业务对象生成功能，支持对象拆分、合并、属性拖拽分配等交互操作。

### 目录结构

```
src/pages/SemanticObjects/
├── index.tsx                          # 主入口 (215行)
├── types.ts                           # TypeScript 类型定义 (35行)
├── hooks/
│   ├── useSemanticData.ts            # 数据管理 hook (45行)
│   ├── useObjectOperations.ts        # 对象操作 hook (193行)
│   └── useDragDrop.ts                # 拖拽逻辑 hook (37行)
├── components/
│   ├── Header.tsx                    # 顶部导航栏 (76行)
│   ├── ViewSwitcher.tsx              # 视图切换器 (44行)
│   ├── AttributeCard.tsx             # 属性卡片 (72行)
│   ├── TableView.tsx                 # 表格视图 (134行)
│   ├── RelationshipDrawer.tsx        # 关系抽屉 (180行)
│   └── StructureView/
│       ├── index.tsx                 # 结构视图主组件 (200行)
│       ├── ObjectCard.tsx            # 对象卡片 (58行)
│       ├── ObjectList.tsx            # 对象列表 (49行)
│       ├── AttributeZone.tsx         # 属性区域 (85行)
│       └── UnassignedPool.tsx        # 未分配字段池 (150行)
└── modals/
    ├── SplitModal.tsx                # 拆分模态框 (153行)
    ├── MergeModal.tsx                # 合并模态框 (84行)
    └── ConfigModal.tsx               # 配置模态框 (139行)
```

### 核心组件说明

#### 1. index.tsx - 主入口
- **职责**: 组合所有子组件，管理页面级状态
- **主要功能**:
  - 集成 3 个自定义 hooks
  - 管理模态框状态
  - 处理拖拽逻辑
  - 路由到 `/semantic/objects/:lvId`

#### 2. Hooks 说明

##### useSemanticData
```typescript
// 数据管理 hook
- data: 语义数据
- objects: 业务对象列表
- unassignedFields: 未分配字段
- selectedObject: 当前选中对象
```

##### useObjectOperations
```typescript
// 对象操作 hook
- handleAssignField: 分配字段到对象
- handleMoveField: 在对象内移动字段
- handleSplitObject: 拆分对象
- handleMergeObject: 合并对象
- handleUnassignField: 取消字段分配
- handleAutoOptimize: AI 自动优化
```

##### useDragDrop
```typescript
// 拖拽逻辑 hook
- draggedField: 当前拖拽字段
- dragOverGroup: 拖拽悬停区域
- isDraggingToPool: 是否拖拽到字段池
```

#### 3. StructureView 组件
- **职责**: 对象结构可视化编辑器
- **功能**:
  - 对象列表（左侧）
  - 对象结构编辑区（中间）
  - 未分配字段池（右侧）
  - AI 建议横幅
  - 拖拽分配属性

#### 4. RelationshipDrawer 组件
- **职责**: 对象关系可视化
- **功能**:
  - 节点-边-节点可视化
  - 关系类型展示
  - 置信度显示
  - 导出功能

#### 5. Modals 说明

##### SplitModal
- 按敏感度/访问频率拆分对象
- 显示字段迁移预览
- AI 推理解释

##### MergeModal
- 选择合并目标对象
- 显示字段重叠度
- 合并影响评估

##### ConfigModal
- 属性名称编辑
- 属性类型选择
- 质量规则配置

### 拖拽交互流程

```
拖拽开始 (onDragStart)
    ↓
拖拽悬停 (onDragOver)
    ↓
放置 (onDrop)
    ↓
处理逻辑 (handleAssignField/handleMoveField)
    ↓
状态更新 (updateObjects/setSelectedObject)
```

---

## 类型系统

### TableUnderstanding 类型

```typescript
// 核心类型
interface TableContext {
  lvId: string;
  tableName: string;
  qualifiedName: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  gateMetrics: GateMetrics;
}

interface TableStrategy {
  summary: Summary;
  structure: Structure;
  composition: Composition;
  usage: Usage;
  issues: Issues;
}
```

### SemanticObjects 类型

```typescript
// 核心类型
type ViewMode = 'object' | 'table';
type AttributeType = 'IDENTIFIER' | 'ATTRIBUTE' | 'MEASURE';
type FieldGroup = 'UNASSIGNED' | 'IGNORED' | 'CONFLICT' | 'TECHNICAL';

interface BusinessObject {
  id: string;
  name: string;
  type: string;
  fieldCount: number;
  attributes: Attribute[];
}
```

---

## API 服务

### SemanticApi

```typescript
// 主要 API 方法
- getInboxSummary(): 获取收件箱摘要
- getInboxTasks(): 获取待办任务
- getTaskDetail(): 获取任务详情
- getReleases(): 获取发布列表
- previewBatch(): 预览批量变更
- commitBatch(): 提交批量变更
- getLogicalView(): 获取逻辑视图
- getBusinessObjects(): 获取业务对象
- copilotInterpret(): AI 助手解释
```

---

## 路由配置

| 路由 | 组件 | 功能 |
|------|------|------|
| `/semantic/workbench` | SemanticWorkbench | 工作台首页 |
| `/semantic/inbox` | SemanticInbox | 收件箱 |
| `/semantic/table-understanding/:lvId` | TableUnderstanding | 表理解 |
| `/semantic/objects/:lvId` | SemanticObjects | 对象生成 |
| `/semantic/releases` | SemanticReleases | 发布管理 |

---

## 状态管理模式

### 策略: 组件级状态 + Custom Hooks

```
组件级状态 (useState)
        ↓
Custom Hooks 封装逻辑
        ↓
Props 传递给子组件
        ↓
子组件通过回调更新状态
```

### 优点
- 简单直观，适合中小型应用
- 无需引入复杂状态管理库
- 代码可读性好
- 易于测试

---

## 样式系统

### Tailwind CSS 配置

```javascript
// vite.config.ts
{
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') }
  }
}
```

### 主题颜色

```css
/* 主要颜色 */
slate-900/950: 背景色
slate-800: 边框色
indigo-500/600: 主题色
green-500: 成功状态
red-500: 警告状态
amber-500: 注意状态
```

---

## 开发指南

### 启动项目

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

### 添加新组件

1. 在对应模块的 `components/` 目录下创建组件文件
2. 导出组件: `export default function ComponentName() {}`
3. 在父组件中导入并使用

### 添加新 Hook

1. 在对应模块的 `hooks/` 目录下创建 hook 文件
2. 导出 hook: `export function useHookName() {}`
3. 在组件中导入并使用

### 代码规范

- **文件命名**: PascalCase (组件), camelCase (hooks/utils)
- **组件结构**: Props → State → Effects → Handlers → Render
- **类型定义**: 与组件同目录的 `types.ts` 文件
- **样式**: 使用 Tailwind CSS 类名，避免内联样式

---

## 待重构模块 🔄

以下模块仍为单文件结构，建议参考已重构模块进行拆分：

### 1. SemanticInbox.tsx (503行)
```
建议拆分结构:
src/pages/SemanticInbox/
├── index.tsx                      # 主入口
├── types.ts                       # 类型定义
├── constants.ts                   # 常量
├── hooks/
│   ├── useInboxData.ts           # 数据管理
│   └── useTaskFilters.ts         # 任务筛选
├── components/
│   ├── Header.tsx                # 顶部栏
│   ├── TaskList.tsx              # 任务列表
│   ├── TaskCard.tsx              # 任务卡片
│   ├── FilterBar.tsx             # 筛选栏
│   └── QuickActions.tsx          # 快捷操作
└── modals/
    └── TaskDetailModal.tsx       # 任务详情
```

### 2. SemanticReleases.tsx (213行)
```
建议拆分结构:
src/pages/SemanticReleases/
├── index.tsx                      # 主入口
├── types.ts                       # 类型定义
├── components/
│   ├── ReleaseList.tsx           # 发布列表
│   ├── ReleaseCard.tsx           # 发布卡片
│   └── StatusBadge.tsx           # 状态徽章
```

### 3. SemanticWorkbench.tsx (317行)
```
建议拆分结构:
src/pages/SemanticWorkbench/
├── index.tsx                      # 主入口
├── types.ts                       # 类型定义
├── components/
│   ├── Dashboard.tsx             # 仪表盘
│   ├── MetricCard.tsx            # 指标卡片
│   └── QuickActions.tsx          # 快捷操作
```

---

## 总结

### 重构成果

| 模块 | 重构前 | 重构后 | 文件数 | 改进幅度 |
|------|--------|--------|--------|----------|
| TableUnderstanding | 654行单文件 | 模块化结构 | 11个 | 主文件减少 92% |
| SemanticObjects | 1463行单文件 | 模块化结构 | 17个 | 主文件减少 85% |
| SemanticInbox | 503行单文件 | 待拆分 | - | - |
| SemanticReleases | 213行单文件 | 待拆分 | - | - |
| SemanticWorkbench | 317行单文件 | 待拆分 | - | - |

### 关键指标

- **代码复用性**: hooks 和组件可在其他页面复用
- **可测试性**: 每个组件可独立编写单元测试
- **类型安全**: 完整的 TypeScript 类型覆盖
- **开发体验**: 模块化结构便于多人协作

### 最佳实践

1. **单一职责**: 每个组件/hooks 只做一件事
2. **类型优先**: 先定义类型，再编写代码
3. **逻辑分离**: 业务逻辑放 hooks，UI 逻辑放组件
4. **适度拆分**: 避免过度拆分，保持代码可读性
