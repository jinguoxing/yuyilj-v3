import { TableContext, TableStrategy } from './types';

export const MOCK_CONTEXT: TableContext = {
  lvId: 'lv_005',
  tableName: 't_hr_employee',
  qualifiedName: 'dw.hr.t_hr_employee',
  status: 'DRAFT',
  gateMetrics: { must: 2, coverage: 0.85, risk: 'HIGH' }
};

export const MOCK_STRATEGY: TableStrategy = {
  summary: {
    tableType: { top1: 'DIMENSION', top2: 'MASTER', confidence: 0.92 },
    grain: '每个员工（Employee）一行',
    description: '存储企业正式员工的核心基础信息，包含身份、组织归属与基础薪资等级。',
    tags: ['HR', 'Core', 'PII'],
    explain: '该表包含大量描述性属性（如姓名、部门、职级），且被多个事实表（如考勤、发薪）作为外键引用，符合典型维度表特征。'
  },
  structure: {
    pkCandidates: [
      { fields: ['employee_id'], confidence: 0.99, evidence: '100% Unique, Non-Null, PK Constraint', validator: 'PASS' },
      { fields: ['ssn_number'], confidence: 0.85, evidence: '99.9% Unique, Has Nulls', validator: 'WARN', reason: '存在空值，不建议作为物理主键' }
    ],
    fkCandidates: [
      { field: 'department_id', target: 'dim_department', matchScore: 0.95, evidence: 'Join frequency high, name match' },
      { field: 'manager_id', target: 't_hr_employee', matchScore: 0.88, evidence: 'Self-referencing hierarchy' }
    ]
  },
  composition: {
    semanticTypes: [
      { type: 'ID', count: 3 },
      { type: 'NAME', count: 5 },
      { type: 'TIME', count: 4 },
      { type: 'STATUS', count: 2 },
      { type: 'MONEY', count: 1 }
    ],
    roles: [
      { role: 'PK', count: 1 },
      { role: 'FK', count: 2 },
      { role: 'DIMENSION', count: 10 },
      { role: 'MEASURE', count: 1 },
      { role: 'AUDIT', count: 2 }
    ],
    keyFields: ['employee_id', 'department_id', 'status', 'hire_date'],
    anomalies: ['annual_salary 缺乏血缘引用', 'ssn_number 采样率不足 10%']
  },
  usage: {
    downstreams: 24,
    usageSummary: ['常用于按 department_id 分组聚合', '常与 fact_payroll 进行 JOIN'],
    sensitiveFields: 3,
    impactNodes: 12,
    explain: '作为核心维度表，其主键和部门外键的变更将直接影响下游 12 个核心报表的数据准确性。'
  },
  issues: {
    must: [
      { id: 'm1', title: '主键 employee_id 存在重复值风险', action: '去处理' },
      { id: 'm2', title: '敏感字段 ssn_number 未配置脱敏规则', action: '去配置' }
    ],
    review: [
      { id: 'r1', title: '建议将 annual_salary 拆分至独立子表', action: '查看建议' }
    ]
  }
};

export const RISK_TAGS = ['PII', 'Core', 'HR', 'Financial'];
