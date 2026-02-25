// Mock data and API service for Semantic Governance

export interface Task {
  taskId: string;
  lvId: string;
  lvName: string;
  phase: 'field' | 'object' | 'mapping' | 'publish';
  severity: 'MUST' | 'REVIEW' | 'INFO';
  status: 'OPEN' | 'DONE' | 'IGNORED';
  taskType: 'CONFLICT' | 'ANOMALY' | 'DRIFT' | 'HIGH_IMPACT';
  scope: {
    type: 'FIELD' | 'OBJECT' | 'MAPPING';
    id: string;
    name: string;
  };
  title: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  impact: {
    downstreams: number;
    objects: number;
    sensitiveFields: number;
  };
  updatedAt: string;
}

export interface Release {
  releaseId: string;
  lvId: string;
  lvName: string;
  snapshotVersion: string;
  status: 'PREVIEWED' | 'PUBLISHED' | 'ROLLED_BACK';
  gateSnapshot: {
    must: number;
    coverage: number;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  };
  createdAt: string;
  createdBy: string;
}

// Mock Data Store
const tasks: Task[] = [
  {
    taskId: 'task_001',
    lvId: 'lv_005',
    lvName: 't_hr_employee',
    phase: 'field',
    severity: 'MUST',
    status: 'OPEN',
    taskType: 'CONFLICT',
    scope: { type: 'FIELD', id: 'f_001', name: 'employee_id' },
    title: '字段语义冲突: IDENTIFIER vs TEXT',
    riskLevel: 'HIGH',
    impact: { downstreams: 16, objects: 1, sensitiveFields: 0 },
    updatedAt: new Date().toISOString(),
  },
  {
    taskId: 'task_002',
    lvId: 'lv_006',
    lvName: 't_sales_order',
    phase: 'mapping',
    severity: 'REVIEW',
    status: 'OPEN',
    taskType: 'ANOMALY',
    scope: { type: 'MAPPING', id: 'm_002', name: 'amount -> total_amt' },
    title: '检测到映射逻辑漂移',
    riskLevel: 'MEDIUM',
    impact: { downstreams: 5, objects: 2, sensitiveFields: 1 },
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    taskId: 'task_003',
    lvId: 'lv_007',
    lvName: 't_cust_profile',
    phase: 'object',
    severity: 'INFO',
    status: 'OPEN',
    taskType: 'DRIFT',
    scope: { type: 'OBJECT', id: 'o_003', name: 'customer_profile' },
    title: '检测到新的上游字段',
    riskLevel: 'LOW',
    impact: { downstreams: 2, objects: 1, sensitiveFields: 0 },
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
  },
];

const releases: Release[] = [
  {
    releaseId: 'pv_001',
    lvId: 'lv_005',
    lvName: 't_hr_employee',
    snapshotVersion: 'semver_20260224_001',
    status: 'PREVIEWED',
    gateSnapshot: { must: 0, coverage: 0.84, riskLevel: 'MEDIUM' },
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    createdBy: 'user_01',
  },
  {
    releaseId: 'pub_002',
    lvId: 'lv_004',
    lvName: 't_dim_date',
    snapshotVersion: 'v1.0.2',
    status: 'PUBLISHED',
    gateSnapshot: { must: 0, coverage: 1.0, riskLevel: 'LOW' },
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    createdBy: 'system',
  },
];

export const SemanticApi = {
  getInboxSummary: async () => {
    return {
      open: { must: 7, conflict: 3, anomaly: 2, drift: 5 },
      readyForPreview: 4,
      coverageGapCount: 6,
      highImpactCount: 5,
      asOf: new Date().toISOString(),
    };
  },

  getInboxTasks: async (filters: any) => {
    // Simulate filtering
    let filtered = [...tasks];
    if (filters?.quickFilter === 'MUST') {
      filtered = filtered.filter(t => t.severity === 'MUST');
    }
    return {
      items: filtered,
      page: 1,
      pageSize: 20,
      total: filtered.length,
    };
  },

  getTaskDetail: async (taskId: string) => {
    const task = tasks.find(t => t.taskId === taskId);
    if (!task) throw new Error('Task not found');
    
    return {
      ...task,
      fieldContext: { fieldId: 'f_001', fieldName: 'employee_id', dataType: 'VARCHAR(20)' },
      candidates: [
        { fieldSemanticType: 'IDENTIFIER', fieldRole: 'PRIMARY_KEY', confidence: 0.91, label: 'Recommended', evidenceRefs: ['ev_1', 'ev_2'] },
        { fieldSemanticType: 'TEXT', fieldRole: 'DIMENSION', confidence: 0.55, label: 'Alt', evidenceRefs: ['ev_3'] },
      ],
      evidenceSummary: [
        { type: 'NAMING_PATTERN', title: 'Naming match *_id', weight: 0.92, summary: '+92' },
        { type: 'PROFILE_STATS', title: 'Unique/NotNull Rate', weight: 0.80, summary: 'unique 87.3%' },
      ],
      actions: {
        canPreviewBatch: true,
        suggestedStrategies: ['ACCEPT_RECOMMENDED', 'REUSE_HISTORY', 'OPEN_EXCEPTION'],
      },
    };
  },

  getReleases: async () => {
    return {
      items: releases,
      page: 1,
      pageSize: 20,
      total: releases.length,
    };
  },

  previewBatch: async (strategy: string, taskIds: string[]) => {
    return {
      draftBatchId: 'batch_draft_' + Math.random().toString(36).substr(2, 5),
      strategy,
      changes: taskIds.map(id => ({
        entityType: 'FIELD_DECISION',
        lvId: 'lv_005',
        entityId: 'f_' + id,
        before: { fieldSemanticType: 'UNKNOWN', fieldRole: 'UNKNOWN' },
        after: { fieldSemanticType: 'IDENTIFIER', fieldRole: 'PRIMARY_KEY', keyFlags: { isPK: true } },
        evidenceRefs: ['ev_1'],
      })),
      impactSummary: {
        affectedDownstreams: 16,
        affectedObjects: 1,
        gateDelta: {
          mustOpenCount: { before: 1, after: 0 },
          coverage: { before: 0.78, after: 0.84 },
          riskLevel: { before: 'HIGH', after: 'MEDIUM' },
        },
      },
    };
  },

  commitBatch: async (draftBatchId: string) => {
    return {
      batchId: 'batch_' + Math.random().toString(36).substr(2, 5),
      status: 'COMMITTED',
      updatedGate: { mustOpenCount: 0, coverage: 0.84, riskLevel: 'MEDIUM' },
    };
  },

  getLogicalView: async (lvId: string) => {
    // Mock LV Data
    return {
      lvId,
      name: 't_hr_employee',
      description: 'Employee Master Data with current active status and department info',
      domain: 'HR',
      owner: 'Data Governance Team',
      status: 'DRAFT',
      fields: [
        { id: 'f_001', name: 'employee_id', dataType: 'VARCHAR(20)', semanticType: 'IDENTIFIER', description: 'Unique Employee ID', status: 'VERIFIED' },
        { id: 'f_002', name: 'first_name', dataType: 'VARCHAR(50)', semanticType: 'TEXT', description: 'First Name', status: 'VERIFIED' },
        { id: 'f_003', name: 'last_name', dataType: 'VARCHAR(50)', semanticType: 'TEXT', description: 'Last Name', status: 'VERIFIED' },
        { id: 'f_004', name: 'email', dataType: 'VARCHAR(100)', semanticType: 'CONTACT', description: 'Corporate Email', status: 'VERIFIED' },
        { id: 'f_005', name: 'dept_code', dataType: 'VARCHAR(10)', semanticType: 'FOREIGN_KEY', description: 'Department Code', status: 'WARNING', issue: 'Unresolved Reference' },
        { id: 'f_006', name: 'join_date', dataType: 'DATE', semanticType: 'TIME', description: 'Date of Joining', status: 'VERIFIED' },
        { id: 'f_007', name: 'salary_amt', dataType: 'DECIMAL(18,2)', semanticType: 'AMOUNT', description: 'Annual Salary', status: 'SENSITIVE' },
      ],
      lineage: {
        upstream: ['hr_db.employees', 'hr_db.departments'],
        downstream: ['rpt_headcount_monthly', 'dashboard_hr_overview']
      }
    };
  },

  getBusinessObjects: async (lvId: string) => {
    // Mock Business Object Generation Result
    return {
      lvId,
      metrics: {
        coverage: 0.85,
        unassignedCount: 4,
        conflictCount: 2,
      },
      objects: [
        {
          id: 'bo_001',
          name: 'Employee',
          type: 'PRIMARY',
          description: 'Core employee entity derived from main cluster',
          fieldCount: 12,
          attributes: [
            { id: 'attr_001', name: 'employee_id', type: 'ID', mappedField: 'emp_id', evidence: 'Primary Key Candidate (99%)', status: 'CONFIRMED', qualityRules: ['NOT_NULL', 'UNIQUE'] },
            { id: 'attr_002', name: 'full_name', type: 'ATTRIBUTE', mappedField: 'name_full', evidence: 'Semantic Name Match', status: 'CONFIRMED', qualityRules: ['NOT_NULL'] },
            { id: 'attr_003', name: 'email_address', type: 'ATTRIBUTE', mappedField: 'corp_email', evidence: 'Pattern Match (Email)', status: 'CONFIRMED', qualityRules: ['EMAIL_FORMAT', 'UNIQUE'] },
            { id: 'attr_004', name: 'annual_salary', type: 'MEASURE', mappedField: 'salary_amt', evidence: 'Numeric Currency', status: 'SUGGESTED', qualityRules: ['POSITIVE'] },
            { id: 'attr_005', name: 'hire_date', type: 'DIMENSION', mappedField: 'join_dt', evidence: 'Temporal Field', status: 'CONFIRMED', qualityRules: ['NOT_NULL', 'PAST_DATE'] },
            { id: 'attr_006', name: 'phone_number', type: 'ATTRIBUTE', mappedField: 'mobile_no', evidence: 'Pattern Match (Phone)', status: 'SUGGESTED', qualityRules: ['PHONE_FORMAT'] },
            { id: 'attr_007', name: 'job_title', type: 'DIMENSION', mappedField: 'designation', evidence: 'Categorical', status: 'CONFIRMED', qualityRules: [] },
            { id: 'attr_008', name: 'manager_id', type: 'ATTRIBUTE', mappedField: 'mgr_id', evidence: 'Self Reference', status: 'SUGGESTED', qualityRules: ['REF_INTEGRITY'] },
            { id: 'attr_009', name: 'dept_code', type: 'DIMENSION', mappedField: 'dept_cd', evidence: '外键模式', status: 'CONFIRMED', qualityRules: ['NOT_NULL'] },
            { id: 'attr_010', name: 'is_active', type: 'DIMENSION', mappedField: 'active_flg', evidence: 'Boolean', status: 'CONFIRMED', qualityRules: ['BOOLEAN'] },
          ]
        },
        {
          id: 'bo_002',
          name: 'DepartmentRef',
          type: 'REFERENCE',
          description: 'Inferred reference object from department columns',
          fieldCount: 3,
          attributes: [
            { id: 'attr_011', name: 'department_id', type: 'ID', mappedField: 'dept_code', evidence: 'Foreign Key Pattern', status: 'CONFIRMED' },
            { id: 'attr_012', name: 'department_name', type: 'ATTRIBUTE', mappedField: 'dept_name', evidence: 'Co-occurrence with dept_code', status: 'SUGGESTED' },
          ]
        },
        {
          id: 'bo_003',
          name: 'AuditLog',
          type: 'LOG',
          description: 'System audit fields separated from business logic',
          fieldCount: 2,
          attributes: [
            { id: 'attr_021', name: 'created_at', type: 'DIMENSION', mappedField: 'crt_ts', evidence: 'Audit Pattern', status: 'CONFIRMED' },
            { id: 'attr_022', name: 'created_by', type: 'ATTRIBUTE', mappedField: 'crt_user', evidence: 'Audit Pattern', status: 'CONFIRMED' },
          ]
        }
      ],
      unassignedFields: [
        { id: 'f_901', name: 'temp_flag', dataType: 'CHAR(1)', reason: 'Low utility', group: 'TECHNICAL' },
        { id: 'f_902', name: 'legacy_id', dataType: 'VARCHAR(20)', reason: 'Ambiguous mapping', group: 'UNASSIGNED' },
        { id: 'f_903', name: 'etl_batch_id', dataType: 'VARCHAR(50)', reason: 'Technical field', group: 'TECHNICAL' },
        { id: 'f_904', name: 'unknown_col', dataType: 'VARCHAR(100)', reason: 'No semantic match', group: 'UNASSIGNED' },
        { id: 'f_905', name: 'manager_id', dataType: 'VARCHAR(20)', reason: '既可属于 Employee 又可属于 Manager', group: 'CONFLICT' },
      ],
      tableContext: {
        sourceTable: 't_employee_profile',
        businessDomain: 'HR / 员工中心',
        totalFields: 24,
        objectCoverage: 0.875,
        unassignedCount: 3,
        conflictCount: 1,
      },
      tableView: [
        { field: 'employee_id', attribute: 'employeeId', object: 'Employee' },
        { field: 'name_full', attribute: 'fullName', object: 'Employee' },
        { field: 'corp_email', attribute: 'email', object: 'Employee' },
        { field: 'mgr_id', attribute: 'managerId', object: 'Employee' },
        { field: 'dept_cd', attribute: 'departmentId', object: 'DepartmentRef' },
      ],
      relationships: [
        { 
          source: 'Employee', 
          target: 'DepartmentRef', 
          type: 'Foreign Key', 
          keys: 'dept_code (FK) -> department_id (PK)', 
          field: 'dept_code',
          evidence: 'Reasoning LLM: Semantic & Pattern Match', 
          confidence: 0.99 
        }
      ]
    };
  },

  copilotInterpret: async (text: string) => {
    // Mock interpretation logic
    if (text.toLowerCase().includes('plan') || text.toLowerCase().includes('understand')) {
      return {
        commands: [
          {
            command: 'PLAN.UNDERSTAND',
            intentId: 'it_003',
            payload: { scope: { type: 'LV', lvId: 'lv_005' }, steps: ['Analyze Schema', 'Check Downstreams', 'Scan Data Profile'] },
            uiHints: { primaryCTA: 'Run Understanding', openRoute: '/semantic/inbox' },
            explain: "我可以为这个逻辑视图运行一个全面的理解计划。",
          },
        ],
      };
    }
    if (text.includes('MUST') || text.includes('must')) {
      return {
        commands: [
          {
            command: 'BATCH.PREVIEW',
            intentId: 'it_001',
            payload: { strategy: 'AUTO_PASS_FIELDS', scope: { type: 'LV', lvId: 'lv_005' }, constraints: { minConfidence: 0.85 } },
            uiHints: { primaryCTA: 'Preview', openRoute: '/semantic/inbox' },
            explain: "我已经准备好了一个批量预览，可以自动解决高置信度的 MUST 阻断项。",
          },
        ],
      };
    }
    return {
      commands: [
        {
          command: 'TASKS.FILTER',
          intentId: 'it_002',
          payload: { quickFilter: 'CONFLICT' },
          explain: "正在筛选待办箱，仅显示冲突项。",
        },
      ],
    };
  },
};
