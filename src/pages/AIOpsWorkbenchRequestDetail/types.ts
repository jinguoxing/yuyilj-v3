import {
  Settings,
  Search,
  ShieldCheck,
  BrainCircuit,
  Database,
  LucideIcon
} from 'lucide-react';

export interface Stage {
  id: string;
  name: string;
  icon: LucideIcon;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING' | 'SOFT_BLOCKED' | 'HARD_BLOCKED' | 'DEGRADED';
  time: string;
  summary: string;
  metrics?: StageMetric[];
}

export interface StageMetric {
  label: string;
  value: string;
  status: 'success' | 'warning' | 'error' | 'neutral';
}

export type MessageType = 'user' | 'plan' | 'progress' | 'blocker' | 'result' | 'deliverable';

export interface Message {
  id: string;
  type: MessageType;
  content?: string;
  role?: 'user' | 'ai';
  stages?: Stage[];
  stageId?: string;
  stageName?: string;
  status?: string;
  summary?: string;
  blockerType?: 'hard' | 'soft';
  taskId?: string;
  deliverables?: Deliverable[];
}

export interface Deliverable {
  name: string;
  [key: string]: any;
}

export interface Request {
  id: string;
  title: string;
  status: 'IN_PROGRESS' | 'PENDING' | 'COMPLETED' | 'FAILED';
}

export type RequestStatus = 'IN_PROGRESS' | 'PAUSED' | 'COMPLETED';
export type RightTab = 'runs' | 'actions' | 'deliverables' | 'replay';

export const STAGES: Stage[] = [
  {
    id: 'A',
    name: '数据源配置',
    icon: Settings,
    status: 'COMPLETED',
    time: '2m 15s',
    summary: '已成功连接到 db-prod-hr.internal',
    metrics: [{ label: 'Connection', value: 'OK', status: 'success' }]
  },
  {
    id: 'B',
    name: '扫描与画像',
    icon: Search,
    status: 'COMPLETED',
    time: '5m 30s',
    summary: '完成 128 张表的扫描与画像提取',
    metrics: [{ label: 'Completeness', value: '98%', status: 'success' }]
  },
  {
    id: 'C',
    name: '质量规则与检测',
    icon: ShieldCheck,
    status: 'COMPLETED',
    time: '1m 45s',
    summary: '生成 45 条规则，发现 15 处违规',
    metrics: [
      { label: 'Rules', value: '45', status: 'neutral' },
      { label: 'Violations', value: '15', status: 'warning' }
    ]
  },
  {
    id: 'D',
    name: '语义理解结果',
    icon: BrainCircuit,
    status: 'SOFT_BLOCKED',
    time: 'Running...',
    summary: '发现 3 个语义冲突需要人工确认',
    metrics: [{ label: 'Routes', value: '3 Conflicted', status: 'warning' }]
  },
  {
    id: 'E',
    name: '候选对象',
    icon: Database,
    status: 'PENDING',
    time: '--',
    summary: '等待上游阶段完成',
    metrics: [{ label: 'Candidates', value: '--', status: 'neutral' }]
  },
];

export const MOCK_REQUESTS: Request[] = [
  { id: 'REQ-20260227-001', title: '解析 HR 域表结构与语义', status: 'IN_PROGRESS' },
  { id: 'REQ-20260226-042', title: '梳理 Sales 数据血缘', status: 'PENDING' },
  { id: 'REQ-20260225-089', title: '生成财务指标定义', status: 'COMPLETED' },
  { id: 'REQ-20260225-090', title: '用户行为日志异常检测', status: 'FAILED' },
];
