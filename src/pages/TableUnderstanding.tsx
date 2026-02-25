import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ChevronRight, AlertCircle, CheckCircle2, AlertTriangle, 
  Activity, ShieldCheck, Key, Link as LinkIcon, 
  BarChart3, Settings, RefreshCw, Save, History,
  MessageSquare, Eye, UploadCloud, Sparkles,
  ChevronUp, ChevronDown, GitCommit, ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const MOCK_CONTEXT = {
  lvId: 'lv_005',
  tableName: 't_hr_employee',
  qualifiedName: 'dw.hr.t_hr_employee',
  status: 'DRAFT',
  gateMetrics: { must: 2, coverage: 0.85, risk: 'HIGH' }
};

const MOCK_STRATEGY = {
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

export default function TableUnderstanding() {
  const { lvId } = useParams();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [isBottomPanelOpen, setIsBottomPanelOpen] = useState(false);
  const [activeBottomTab, setActiveBottomTab] = useState<'preview' | 'audit'>('preview');

  const handleConfirm = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      // Mock success
      alert('策略已确认保存');
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-200 font-sans">
      {/* TopBar */}
      <header className="h-14 border-b border-slate-800 bg-slate-900 flex items-center justify-between px-6 shrink-0 z-10">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <Link to="/semantic/workbench" className="hover:text-slate-200">语义治理</Link>
            <ChevronRight size={12} />
            <span>表理解</span>
            <ChevronRight size={12} />
            <span className="text-slate-200 font-medium">{MOCK_CONTEXT.tableName}</span>
          </div>
          <div className="h-4 w-px bg-slate-800" />
          <div className="flex items-center space-x-2">
            <span className="text-sm font-bold text-slate-100">{MOCK_CONTEXT.tableName}</span>
            <span className="text-[10px] text-slate-500 font-mono">{MOCK_CONTEXT.qualifiedName}</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
              {MOCK_CONTEXT.status}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-1.5 cursor-pointer hover:text-red-400 transition-colors">
              <AlertCircle size={14} className="text-red-500" />
              <span className="text-slate-400">MUST:</span>
              <span className="font-bold text-red-400">{MOCK_CONTEXT.gateMetrics.must}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 size={14} className="text-green-500" />
              <span className="text-slate-400">Coverage:</span>
              <span className="font-bold text-green-400">{MOCK_CONTEXT.gateMetrics.coverage * 100}%</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Activity size={14} className="text-yellow-500" />
              <span className="text-slate-400">Risk:</span>
              <span className="font-bold text-yellow-500">{MOCK_CONTEXT.gateMetrics.risk}</span>
            </div>
          </div>

          <div className="h-4 w-px bg-slate-800" />

          <div className="flex items-center space-x-2">
            <button className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded transition-colors" title="重新分析">
              <RefreshCw size={16} />
            </button>
            <button className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded transition-colors" title="智能助手">
              <MessageSquare size={16} />
            </button>
            <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5">
              <Eye size={14} />
              <span>预览发布</span>
            </button>
            <button disabled className="px-3 py-1.5 bg-indigo-600/50 text-white/50 rounded-lg text-xs font-medium cursor-not-allowed flex items-center space-x-1.5">
              <UploadCloud size={14} />
              <span>发布上架</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Canvas */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-950">
          {/* A. AI Table Summary Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
                  <span>员工维度表</span>
                  <button className="text-slate-500 hover:text-indigo-400"><Settings size={14}/></button>
                </h2>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded text-xs font-bold tracking-wider">
                    {MOCK_STRATEGY.summary.tableType.top1}
                  </span>
                  <span className="text-xs text-slate-500">置信度 {(MOCK_STRATEGY.summary.tableType.confidence * 100).toFixed(0)}%</span>
                </div>
              </div>
              <div className="flex gap-2">
                {MOCK_STRATEGY.summary.tags.map(t => (
                  <span key={t} className="px-2 py-1 bg-slate-800 text-slate-300 rounded-md text-[10px] uppercase tracking-wider border border-slate-700">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="text-xs text-slate-500 mb-1 uppercase tracking-wider font-semibold">粒度 (Grain)</div>
                <div className="text-sm text-slate-200 bg-slate-950 p-2 rounded border border-slate-800">{MOCK_STRATEGY.summary.grain}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1 uppercase tracking-wider font-semibold">业务描述</div>
                <div className="text-sm text-slate-300 leading-relaxed">{MOCK_STRATEGY.summary.description}</div>
              </div>
              <div className="bg-indigo-950/30 border border-indigo-500/20 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <Sparkles size={14} className="text-indigo-400" />
                  <span className="text-xs font-bold text-indigo-300">AI 推理过程</span>
                </div>
                <p className="text-xs text-indigo-200/70 leading-relaxed">{MOCK_STRATEGY.summary.explain}</p>
              </div>
            </div>
          </div>

          {/* B. Key Structure Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-100 mb-4 flex items-center space-x-2">
              <Key size={16} className="text-slate-400" />
              <span>结构与联接键</span>
            </h3>
            
            <div className="grid grid-cols-2 gap-6">
              {/* PK */}
              <div className="space-y-3">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">主键候选 (Primary Key)</div>
                {MOCK_STRATEGY.structure.pkCandidates.map((pk, i) => (
                  <div key={i} className={cn("p-3 rounded-lg border", pk.validator === 'PASS' ? "bg-slate-950 border-green-500/30" : "bg-slate-950 border-yellow-500/30")}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-sm text-slate-200">{pk.fields.join(', ')}</span>
                        {pk.validator === 'PASS' ? <ShieldCheck size={14} className="text-green-500" /> : <AlertTriangle size={14} className="text-yellow-500" />}
                      </div>
                      <span className="text-xs font-mono text-slate-400">{(pk.confidence * 100).toFixed(0)}%</span>
                    </div>
                    <div className="text-[11px] text-slate-500">{pk.evidence}</div>
                    {pk.reason && <div className="text-[11px] text-yellow-500/80 mt-1">{pk.reason}</div>}
                  </div>
                ))}
              </div>

              {/* FK */}
              <div className="space-y-3">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">外键候选 (Foreign Keys)</div>
                {MOCK_STRATEGY.structure.fkCandidates.map((fk, i) => (
                  <div key={i} className="p-3 rounded-lg border border-slate-800 bg-slate-950">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-mono text-sm text-slate-200">{fk.field}</span>
                      <LinkIcon size={12} className="text-slate-500" />
                      <span className="font-mono text-sm text-indigo-400">{fk.target}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-[11px] text-slate-500">{fk.evidence}</div>
                      <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">Score: {fk.matchScore}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* C & D in a row */}
          <div className="grid grid-cols-2 gap-6">
            {/* C. Field Composition Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-100 mb-4 flex items-center space-x-2">
                <BarChart3 size={16} className="text-slate-400" />
                <span>字段分布与角色</span>
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="text-xs text-slate-500 mb-2">语义类型分布</div>
                  <div className="flex flex-wrap gap-2">
                    {MOCK_STRATEGY.composition.semanticTypes.map(st => (
                      <div key={st.type} className="flex items-center space-x-1 text-xs bg-slate-950 border border-slate-800 px-2 py-1 rounded">
                        <span className="text-slate-300">{st.type}</span>
                        <span className="text-slate-500 font-mono">{st.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-2">关键字段 (Key Fields)</div>
                  <div className="flex flex-wrap gap-1">
                    {MOCK_STRATEGY.composition.keyFields.map(kf => (
                      <span key={kf} className="text-[11px] font-mono text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
                        {kf}
                      </span>
                    ))}
                  </div>
                </div>
                {MOCK_STRATEGY.composition.anomalies.length > 0 && (
                  <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                    <div className="text-xs font-bold text-orange-400 mb-1">异常/缺失证据</div>
                    <ul className="list-disc list-inside text-[11px] text-orange-300/80 space-y-1">
                      {MOCK_STRATEGY.composition.anomalies.map((a, i) => <li key={i}>{a}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* D. Usage & Impact Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-100 mb-4 flex items-center space-x-2">
                <Activity size={16} className="text-slate-400" />
                <span>使用与影响</span>
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-slate-200">{MOCK_STRATEGY.usage.downstreams}</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">下游引用</div>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-red-400">{MOCK_STRATEGY.usage.sensitiveFields}</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">敏感字段 (PII)</div>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-slate-500 mb-1">常见用法</div>
                  <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                    {MOCK_STRATEGY.usage.usageSummary.map((u, i) => <li key={i}>{u}</li>)}
                  </ul>
                </div>
                <div className="text-[11px] text-slate-400 bg-slate-800/50 p-2 rounded">
                  {MOCK_STRATEGY.usage.explain}
                </div>
              </div>
            </div>
          </div>

            {/* E. Issues & Blockers Panel */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                  <AlertCircle size={16} className="text-slate-400" />
                  <span>阻塞项与建议</span>
                </h3>
                <button className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded border border-slate-700 transition-colors">
                  批量修复
                </button>
              </div>
              <div className="space-y-3">
              {MOCK_STRATEGY.issues.must.map(issue => (
                <div key={issue.id} className="flex items-center justify-between p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="px-1.5 py-0.5 bg-red-500/20 text-red-400 text-[9px] font-bold uppercase rounded border border-red-500/30">MUST</span>
                    <span className="text-sm text-slate-200">{issue.title}</span>
                  </div>
                  <button className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">{issue.action} &rarr;</button>
                </div>
              ))}
              {MOCK_STRATEGY.issues.review.map(issue => (
                <div key={issue.id} className="flex items-center justify-between p-3 bg-orange-500/5 border border-orange-500/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="px-1.5 py-0.5 bg-orange-500/20 text-orange-400 text-[9px] font-bold uppercase rounded border border-orange-500/30">REVIEW</span>
                    <span className="text-sm text-slate-200">{issue.title}</span>
                  </div>
                  <button className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">{issue.action} &rarr;</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Confirmation Panel */}
        <div className="w-[400px] border-l border-slate-800 bg-slate-900/50 flex flex-col shrink-0">
          <div className="h-14 border-b border-slate-800 flex items-center px-6 bg-slate-900 shrink-0">
            <h2 className="text-sm font-bold text-slate-100">确认表策略 (Table Strategy)</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* 1. Table Type */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>1. 表类型确认</span>
                <span className="text-[10px] text-indigo-400 font-normal">AI 推荐: DIMENSION</span>
              </label>
              <select className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500">
                <option value="DIMENSION">维度表 (DIMENSION)</option>
                <option value="FACT">事实表 (FACT)</option>
                <option value="MASTER">主数据 (MASTER)</option>
              </select>
            </div>

            {/* 2. Grain */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">2. 粒度确认 (Grain)</label>
              <textarea 
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 resize-none h-20"
                defaultValue={MOCK_STRATEGY.summary.grain}
              />
            </div>

            {/* 3. PK / FK */}
            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">3. 主键/外键确认</label>
              
              <div className="space-y-2">
                <div className="text-[11px] text-slate-500">主键 (Primary Key)</div>
                <select className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-slate-200 focus:outline-none focus:border-indigo-500">
                  {MOCK_STRATEGY.structure.pkCandidates.map(pk => (
                    <option key={pk.fields.join(',')} value={pk.fields.join(',')}>{pk.fields.join(', ')}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <div className="text-[11px] text-slate-500">外键 (Foreign Keys)</div>
                <div className="space-y-2">
                  {MOCK_STRATEGY.structure.fkCandidates.map(fk => (
                    <label key={fk.field} className="flex items-center space-x-2 p-2 bg-slate-950 border border-slate-800 rounded-lg cursor-pointer hover:border-slate-700">
                      <input type="checkbox" defaultChecked className="rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500/50" />
                      <div className="flex-1 flex items-center justify-between text-xs">
                        <span className="font-mono text-slate-300">{fk.field}</span>
                        <span className="text-slate-500">&rarr;</span>
                        <span className="font-mono text-indigo-400">{fk.target}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. Risk & Compliance */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">4. 风险与合规</label>
              <div className="flex flex-wrap gap-2">
                {['PII', 'Core', 'HR', 'Financial'].map(tag => (
                  <label key={tag} className="flex items-center space-x-1.5 text-xs text-slate-300 cursor-pointer">
                    <input type="checkbox" defaultChecked={MOCK_STRATEGY.summary.tags.includes(tag)} className="rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500/50" />
                    <span>{tag}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Action Area */}
          <div className="p-6 border-t border-slate-800 bg-slate-900 space-y-3 shrink-0">
            <button 
              onClick={() => setIsBottomPanelOpen(true)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-700 flex items-center justify-center space-x-2 mb-2"
            >
              <Eye size={16} />
              <span>查看变更预览</span>
            </button>
            <button 
              onClick={handleConfirm}
              disabled={isSaving}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-indigo-900/20 flex items-center justify-center space-x-2"
            >
              <Save size={16} />
              <span>{isSaving ? '保存中...' : '保存并确认策略'}</span>
            </button>
            <div className="flex space-x-2">
              <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-lg text-xs font-medium transition-colors border border-slate-700">
                保存草稿
              </button>
              <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-lg text-xs font-medium transition-colors border border-slate-700 flex items-center justify-center space-x-1">
                <History size={14} />
                <span>恢复AI建议</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Panel (Change Preview & Audit) */}
      {isBottomPanelOpen && (
        <div className="h-64 border-t border-slate-800 bg-slate-900 flex flex-col shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.2)] z-20 relative">
          <div className="h-10 border-b border-slate-800 flex items-center justify-between px-4 bg-slate-900/80 backdrop-blur-sm">
            <div className="flex space-x-4">
              <button 
                onClick={() => setActiveBottomTab('preview')}
                className={cn("text-xs font-medium px-2 py-1 border-b-2 transition-colors", activeBottomTab === 'preview' ? "border-indigo-500 text-indigo-400" : "border-transparent text-slate-400 hover:text-slate-200")}
              >
                变更预览 (Diff)
              </button>
              <button 
                onClick={() => setActiveBottomTab('audit')}
                className={cn("text-xs font-medium px-2 py-1 border-b-2 transition-colors", activeBottomTab === 'audit' ? "border-indigo-500 text-indigo-400" : "border-transparent text-slate-400 hover:text-slate-200")}
              >
                审计与历史
              </button>
            </div>
            <button onClick={() => setIsBottomPanelOpen(false)} className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded">
              <ChevronDown size={16} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {activeBottomTab === 'preview' ? (
              <div className="flex space-x-6 h-full">
                <div className="flex-1 space-y-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">本次将修改的内容</h4>
                  <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-2 font-mono text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-500 w-24">TableType:</span>
                      <span className="text-red-400 line-through">UNKNOWN</span>
                      <ArrowRight size={12} className="text-slate-600" />
                      <span className="text-green-400">DIMENSION</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-500 w-24">PrimaryKey:</span>
                      <span className="text-red-400 line-through">None</span>
                      <ArrowRight size={12} className="text-slate-600" />
                      <span className="text-green-400">employee_id</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-500 w-24">Grain:</span>
                      <span className="text-green-400">+ 每个员工（Employee）一行</span>
                    </div>
                  </div>
                </div>
                <div className="w-64 space-y-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">预估影响</h4>
                  <div className="space-y-2">
                    <div className="bg-slate-800/50 p-2 rounded border border-slate-700 flex justify-between items-center">
                      <span className="text-xs text-slate-400">MUST 阻塞项</span>
                      <span className="text-xs font-bold text-green-400">-2</span>
                    </div>
                    <div className="bg-slate-800/50 p-2 rounded border border-slate-700 flex justify-between items-center">
                      <span className="text-xs text-slate-400">覆盖率 (Coverage)</span>
                      <span className="text-xs font-bold text-green-400">+15%</span>
                    </div>
                    <div className="bg-slate-800/50 p-2 rounded border border-slate-700 flex justify-between items-center">
                      <span className="text-xs text-slate-400">风险等级 (Risk)</span>
                      <span className="text-xs font-bold text-yellow-500">HIGH &rarr; MED</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="mt-1 bg-slate-800 p-1.5 rounded-full text-slate-400">
                    <GitCommit size={14} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-200">系统自动生成策略 (AI 推断)</div>
                    <div className="text-xs text-slate-500 mt-0.5">2023-10-25 14:30:00 • 关联 Run ID: run_98765</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3 opacity-50">
                  <div className="mt-1 bg-slate-800 p-1.5 rounded-full text-slate-400">
                    <History size={14} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-200">初始状态</div>
                    <div className="text-xs text-slate-500 mt-0.5">2023-10-25 10:00:00</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
