# 表级分析与对象映射功能替换方案

## 项目分析

### 目标项目 (DataSemanticHub)
**路径**: `/Users/kingnet/workspace/github_workspace/DataSemanticHub`
**说明**: 与 yuyilj-v3 代码库相同，仅分支不同

**技术栈**:
- React 18.3.1
- TypeScript 5.6.2
- Vite 6.0.5
- Tailwind CSS 3.4.17
- React Router 6.28.0
- Zustand (状态管理)
- TanStack Query (数据请求)
- Lucide React 0.469.0

**待替换模块**:
1. **表级分析** (`table-analysis`): 3个组件
   - TableSummaryLeftBar.tsx
   - TableProfileMain.tsx
   - TableDecisionRightBar.tsx

2. **对象映射** (`object-mapping`): 3个组件
   - ObjectCandidateLeftBar.tsx
   - MappingDraftMain.tsx
   - MappingValidationRightBar.tsx

### 源项目 (yuyilj-v3)
**路径**: `/Users/kingnet/workspace/github_workspace/yuyilj-v3`

**技术栈**:
- React 19.0.0
- TypeScript 5.8.2
- Vite 6.2.0
- Tailwind CSS 4.1.14
- React Router 7.13.1
- Motion (Framer) 12.23.24
- Lucide React 0.546.0

**可用模块**:
1. **TableUnderstanding**: 已拆分为11个文件的表理解模块
2. **SemanticObjects**: 已拆分为17个文件的对象生成模块

---

## 替换方案

### 方案概述

将 yuyilj-v3 项目中的 `TableUnderstanding` 和 `SemanticObjects` 模块完整迁移到 DataSemanticHub 项目，替换现有的表级分析和对象映射功能。

### 技术适配点

| 方面 | yuyilj-v3 | DataSemanticHub | 适配方案 |
|------|-----------|----------------|----------|
| React 版本 | 19.0.0 | 18.3.1 | 降级到 18.x (兼容) |
| Tailwind CSS | 4.1.14 | 3.4.17 | 调整样式类名 (v3→v4 差异) |
| 路由 | React Router 7 | React Router 6 | 调整路由 API |
| 状态管理 | Custom Hooks | Zustand | 集成到 Zustand store |
| 数据请求 | Mock API | TanStack Query | 适配真实 API |
| 动画库 | Motion | 无 | 可选集成 Motion |

---

## 详细替换计划

### 阶段一：TableUnderstanding 替换表级分析

#### 1. 目录结构迁移

```
DataSemanticHub/frontend/src/views/datamodeler/pages/workbench-v2/tabs/
├── table-analysis/
│   ├── TableSummaryLeftBar.tsx     # 保留 (可能需要适配)
│   ├── TableProfileMain.tsx         # 替换为 TableUnderstanding 组件
│   └── TableDecisionRightBar.tsx   # 保留 (可能需要适配)
```

**替换为**:
```
DataSemanticHub/frontend/src/views/datamodeler/pages/workbench-v2/tabs/
├── table-understanding/              # 新增
│   ├── index.tsx                     # 主入口
│   ├── types.ts                      # 类型定义
│   ├── constants.ts                  # 常量
│   ├── hooks/
│   │   ├── useTableData.ts          # 适配 TanStack Query
│   │   └── useEditingState.ts       # 保留
│   ├── components/
│   │   ├── TopBar.tsx               # 适配到现有布局
│   │   ├── SummaryCard.tsx          # 直接复用
│   │   ├── StructureCard.tsx        # 直接复用
│   │   ├── CompositionCard.tsx      # 直接复用
│   │   ├── UsageCard.tsx            # 直接复用
│   │   ├── IssuesCard.tsx           # 直接复用
│   │   └── ConfirmationPanel.tsx    # 直接复用
│   └── BottomPanel/
│       ├── index.tsx
│       ├── PreviewTab.tsx
│       └── AuditTab.tsx
```

#### 2. 组件映射

| yuyilj-v3 组件 | DataSemanticHub 替换 | 说明 |
|----------------|---------------------|------|
| TopBar | 保留现有顶部栏，集成操作按钮 | 需要适配 |
| SummaryCard | 替换 TableProfileMain 的核心展示区 | 直接复用 |
| StructureCard | 替换 TableProfileMain 的键值展示区 | 直接复用 |
| CompositionCard | 新增字段分布卡片 | 直接复用 |
| UsageCard | 新增使用影响卡片 | 直接复用 |
| IssuesCard | 替换 TableIssuesPanel | 直接复用 |
| ConfirmationPanel | 替换 TableDecisionRightBar | 直接复用 |
| BottomPanel | 新增底部预览面板 | 直接复用 |

#### 3. 样式适配

**Tailwind CSS v4 → v3 主要差异**:
- v4 使用 `@tailwindcss/vite` 插件
- v3 使用 PostCSS + `tailwindcss.config.js`
- 部分类名语法变化 (如 `bg-slate-950` 在 v3 中可能需要 `bg-slate-900`)

**解决方案**:
1. 保持 Tailwind v3 配置
2. 替换不兼容的颜色类名
3. 使用 `tailwind-merge` 的 `tw` 工具处理类名合并

#### 4. API 适配

**yuyilj-v3 (Mock)**:
```typescript
const MOCK_STRATEGY = { ... };
const MOCK_CONTEXT = { ... };
```

**DataSemanticHub (Real API)**:
```typescript
// 适配 TanStack Query
import { useQuery, useMutation } from '@tanstack/react-query';

export function useTableProfile(lvId: string) {
  return useQuery({
    queryKey: ['table-profile', lvId],
    queryFn: () => api.getTableProfile(lvId)
  });
}
```

---

### 阶段二：SemanticObjects 替换对象映射

#### 1. 目录结构迁移

```
DataSemanticHub/frontend/src/views/datamodeler/pages/workbench-v2/tabs/
├── object-mapping/
│   ├── ObjectCandidateLeftBar.tsx    # 保留
│   ├── MappingDraftMain.tsx          # 替换为 SemanticObjects 组件
│   └── MappingValidationRightBar.tsx # 保留
```

**替换为**:
```
DataSemanticHub/frontend/src/views/datamodeler/pages/workbench-v2/tabs/
├── object-generation/                # 新增
│   ├── index.tsx                     # 主入口
│   ├── types.ts                      # 类型定义
│   ├── hooks/
│   │   ├── useSemanticData.ts       # 适配 TanStack Query
│   │   ├── useObjectOperations.ts   # 适配真实 API
│   │   └── useDragDrop.ts           # 保留
│   ├── components/
│   │   ├── Header.tsx               # 适配到现有布局
│   │   ├── ViewSwitcher.tsx         # 直接复用
│   │   ├── StructureView/
│   │   │   ├── index.tsx            # 主视图
│   │   │   ├── ObjectCard.tsx       # 直接复用
│   │   │   ├── ObjectList.tsx       # 直接复用
│   │   │   ├── AttributeZone.tsx    # 直接复用
│   │   │   └── UnassignedPool.tsx   # 直接复用
│   │   ├── TableView.tsx             # 直接复用
│   │   └── RelationshipDrawer.tsx   # 直接复用
│   └── modals/
│       ├── SplitModal.tsx            # 直接复用
│       ├── MergeModal.tsx            # 直接复用
│       └── ConfigModal.tsx           # 直接复用
```

#### 2. 组件映射

| yuyilj-v3 组件 | DataSemanticHub 替换 | 说明 |
|----------------|---------------------|------|
| Header | 保留现有顶部栏 | 需要适配 |
| ViewSwitcher | 替换视图切换逻辑 | 直接复用 |
| StructureView | 替换 MappingDraftMain 核心区域 | 直接复用 |
| ObjectList | 替换 ObjectCandidateLeftBar | 直接复用 |
| UnassignedPool | 新增未分配字段池 | 直接复用 |
| RelationshipDrawer | 新增关系图抽屉 | 直接复用 |
| TableView | 保留表格视图模式 | 直接复用 |
| SplitModal | 新增拆分模态框 | 直接复用 |
| MergeModal | 新增合并模态框 | 直接复用 |
| ConfigModal | 替换现有配置功能 | 直接复用 |

---

## 更新后的执行方案

### 路径修正
- **源路径**: `/Users/kingnet/workspace/github_workspace/yuyilj-v3`
- **目标路径**: `/Users/kingnet/workspace/github_workspace/DataSemanticHub`

### 策略调整

1. **完全替换模式** - 删除原组件，直接使用新模块
2. **Mock 数据优先** - 使用 yuyilj-v3 的 Mock API 实现
3. **双主题支持** - 深色/浅色主题自动切换
4. **无需数据迁移** - 仅功能替换

---

## 具体执行步骤

### Step 1: 环境准备

1. **备份现有代码**
```bash
cd /Users/kingnet/workspace/github_workspace/DataSemanticHub
git checkout -b feature/table-understanding-migration
git add .
git commit -m "backup: before table understanding migration"
```

2. **复制模块文件**
```bash
# 复制 TableUnderstanding
cp -r /Users/kingnet/workspace/github_workspace/yuyilj-v3/src/pages/TableUnderstanding \
   /Users/kingnet/workspace/github_workspace/DataSemanticHub/frontend/src/views/datamodeler/pages/workbench-v2/tabs/

# 复制 SemanticObjects
cp -r /Users/kingnet/workspace/github_workspace/yuyilj-v3/src/pages/SemanticObjects \
   /Users/kingnet/workspace/github_workspace/DataSemanticHub/frontend/src/views/datamodeler/pages/workbench-v2/tabs/

# 复制共享 Mock API
cp /Users/kingnet/workspace/github_workspace/yuyilj-v3/src/services/semanticApi.ts \
   /Users/kingnet/workspace/github_workspace/DataSemanticHub/frontend/src/services/
```

3. **删除原组件**
```bash
# 删除表级分析原组件
rm /Users/kingnet/workspace/github_workspace/DataSemanticHub/frontend/src/views/datamodeler/pages/workbench-v2/tabs/TableAnalysisTab.tsx
rm -rf /Users/kingnet/workspace/github_workspace/DataSemanticHub/frontend/src/views/datamodeler/pages/workbench-v2/tabs/table-analysis/

# 删除对象映射原组件
rm /Users/kingnet/workspace/github_workspace/DataSemanticHub/frontend/src/views/datamodeler/pages/workbench-v2/tabs/ObjectMappingTab.tsx
rm -rf /Users/kingnet/workspace/github_workspace/DataSemanticHub/frontend/src/views/datamodeler/pages/workbench-v2/tabs/object-mapping/
```

### Step 2: 样式适配

1. **添加浅色主题支持**
```typescript
// 创建主题工具
// utils/theme-utils.ts
export const getThemeClass = (darkClass: string, lightClass: string) => {
  // 根据当前主题返回对应类名
  return document.documentElement.classList.contains('dark')
    ? darkClass
    : lightClass;
};
```

2. **双主题样式适配**
```typescript
// 在组件中使用
<div className={getThemeClass(
  'bg-slate-950 text-slate-200',  // 深色主题
  'bg-white text-slate-900'        // 浅色主题
)}>
```

3. **创建全局样式变量**
```css
/* styles/theme.css */
:root {
  --bg-primary: theme('colors.white');
  --bg-secondary: theme('colors.slate.50');
  --text-primary: theme('colors.slate.900');
  --text-secondary: theme('colors.slate.600');
  --border-color: theme('colors.slate.200');
}

.dark {
  --bg-primary: theme('colors.slate.950');
  --bg-secondary: theme('colors.slate.900');
  --text-primary: theme('colors.slate.200');
  --text-secondary: theme('colors.slate.400');
  --border-color: theme('colors.slate.800');
}
```

### Step 3: API 适配

1. **使用 Mock 数据**
```typescript
// 直接复用 yuyilj-v3 的 Mock API
// services/semanticApi.ts (已复制)

// 在组件中直接使用
import { MOCK_CONTEXT, MOCK_STRATEGY } from './constants';
import { SemanticApi } from '@/services/semanticApi';
```

2. **保持现有 API 结构不变**
```typescript
// 后续对接真实 API 时，只需替换此文件
// services/api.ts (保留现有实现)
```

3. **可选: TanStack Query 集成准备**
```typescript
// 预留真实 API 对接接口
// hooks/useTableQueries.ts (可选创建)
export function useTableProfile(lvId: string) {
  // 现阶段使用 Mock 数据
  // 后续切换到真实 API
  return useQuery({
    queryKey: ['table-profile', lvId],
    queryFn: () => SemanticApi.getLogicalView(lvId),
    // 暂时使用 Mock 数据
    staleTime: Infinity,
  });
}
```

### Step 4: 路由集成

1. **更新路由配置**
```typescript
// 在 DataSemanticHub 的路由配置中
import TableUnderstanding from './tabs/table-understanding';
import ObjectGeneration from './tabs/object-generation';

// 替换原来的 table-analysis 和 object-mapping
{
  path: 'workbench/:lvId',
  element: <WorkbenchLayout />,
  children: [
    { index: true, element: <Navigate to="table-understanding" /> },
    { path: 'table-understanding', element: <TableUnderstanding /> },
    { path: 'object-generation', element: <ObjectGeneration /> },
    // 保留其他 tabs
  ]
}
```

### Step 5: 状态管理集成

1. **适配 Zustand Store**
```typescript
// hooks/useWorkbenchStore.ts (现有)
import { create } from 'zustand';

export const useWorkbenchStore = create((set) => ({
  // 现有状态
  lvId: '',
  setLvId: (lvId) => set({ lvId }),

  // 新增 TableUnderstanding 状态
  tableUnderstanding: {
    isSaving: false,
    isBottomPanelOpen: false,
    activeBottomTab: 'preview' as const,
  },
  setTableUnderstandingState: (state) => set({ tableUnderstanding: state }),

  // 新增 ObjectGeneration 状态
  objectGeneration: {
    selectedObject: null,
    isRelationshipOpen: false,
  },
  setObjectGenerationState: (state) => set({ objectGeneration: state }),
}));
```

### Step 6: 测试与验证

1. **功能测试清单**
- [ ] 表理解页面加载
- [ ] 主键/外键展示
- [ ] 属性编辑功能
- [ ] 底部预览面板
- [ ] 对象生成页面加载
- [ ] 拖拽分配功能
- [ ] 拆分/合并模态框
- [ ] 关系图展示

2. **样式测试**
- [ ] 深色模式适配
- [ ] 响应式布局
- [ ] 动画效果

---

## 风险与缓解

### 风险点

1. **主题切换适配**
   - 风险: 双主题样式适配工作量较大
   - 缓解: 使用 CSS 变量 + Tailwind `dark:` 前缀

2. **完全替换风险**
   - 风险: 无回退方案，出现问题需重新开发
   - 缓解: Git 分支管理，出现问题时可快速回滚

3. **Mock 数据限制**
   - 风险: Mock 数据功能可能不完整
   - 缓解: 参考原 TableAnalysis/ObjectMapping 的功能需求

### 回滚方案

```bash
# 如果出现严重问题，快速回滚
cd /Users/kingnet/workspace/github_workspace/DataSemanticHub
git checkout main
git branch -D feature/table-understanding-migration
```

### 质量保证

1. **测试清单**
   - [ ] 深色主题显示正常
   - [ ] 浅色主题显示正常
   - [ ] 主题切换功能正常
   - [ ] 所有交互功能可用
   - [ ] Mock 数据加载正常

2. **兼容性测试**
   - [ ] Chrome/Edge 最新版
   - [ ] Firefox 最新版
   - [ ] Safari 最新版

```bash
# 如果出现严重问题，快速回滚
git checkout main
git branch -D feature/table-understanding-migration
```

---

## 时间估算

| 阶段 | 任务 | 预计时间 |
|------|------|----------|
| 准备 | 环境准备、文件复制、删除原组件 | 0.5天 |
| 适配 | 双主题样式适配、Mock API 集成 | 1.5天 |
| 集成 | 路由更新、Tab 切换适配 | 0.5天 |
| 测试 | 深色/浅色主题测试、功能测试 | 1天 |
| 文档 | 更新文档、迁移说明 | 0.5天 |
| **总计** | | **4天** |

### 关键里程碑

- **Day 1**: 完成 TableUnderstanding 迁移，深色主题可用
- **Day 2**: 完成双主题适配，浅色主题可用
- **Day 3**: 完成 SemanticObjects 迁移
- **Day 4**: 全面测试验证，文档完善

---

## 建议执行顺序

1. **先迁移 TableUnderstanding** (表级分析)
   - 功能相对独立
   - 风险较低
   - 可以先验证方案可行性

2. **后迁移 SemanticObjects** (对象映射)
   - 依赖 TableUnderstanding 的部分类型
   - 复杂度更高
   - 需要更多适配工作

---

## 确认事项

### ✅ 已确认

1. **目标路径修正**: `/Users/kingnet/workspace/DataAI-workspace/DataSemanticHub` → `/Users/kingnet/workspace/github_workspace/DataSemanticHub`

2. **替换策略**: 选项A - **完全替换**
   - 不保留原功能作为回退
   - 直接替换现有组件

3. **API 接口**: **暂使用 Mock 数据**
   - 复用 yuyilj-v3 的 Mock API 实现
   - 后续再对接真实 API

4. **UI 风格**: **适配双主题**
   - 保留深色主题 (与 yuyilj-v3 一致)
   - 新增浅色主题适配
   - 使用主题切换功能

5. **数据迁移**: **暂不迁移**
   - 不涉及现有数据迁移
   - 仅功能替换

---

## 更新后的执行方案
