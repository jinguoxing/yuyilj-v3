import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, AlertTriangle, Database, ExternalLink, RotateCcw, Settings, ShieldCheck, ArrowUpCircle, Download, Activity, Search, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { STAGES } from '../types';

interface StageDetailDrawerProps {
  stageId: string | undefined;
  onClose: () => void;
  onSetSelectedField: (field: string) => void;
  onSetFieldDrawerOpen: (open: boolean) => void;
}

export default function StageDetailDrawer({ stageId, onClose, onSetSelectedField, onSetFieldDrawerOpen }: StageDetailDrawerProps) {
  const handleFieldClick = (field: string) => {
    onSetSelectedField(field);
    onSetFieldDrawerOpen(true);
  };

  return (
    <AnimatePresence>
      {stageId && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] z-40" />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute top-0 right-0 bottom-0 w-[500px] bg-slate-900 border-l border-slate-800 shadow-2xl z-50 flex flex-col"
          >
            <div className="h-14 border-b border-slate-800 flex items-center justify-between px-6 shrink-0 bg-slate-950/50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  {STAGES.find((s) => s.id === stageId)?.icon && React.createElement(STAGES.find((s) => s.id === stageId)!.icon, { size: 16 })}
                </div>
                <h2 className="text-base font-bold text-slate-100">阶段 {stageId}: {STAGES.find((s) => s.id === stageId)?.name}</h2>
              </div>
              <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {stageId === 'A' && <StageAContent />}
              {stageId === 'B' && <StageBContent />}
              {stageId === 'C' && <StageCContent />}
              {stageId === 'D' && <StageDContent onFieldClick={handleFieldClick} />}
              {stageId === 'E' && <StageEContent />}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Stage A: 数据源配置
function StageAContent() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
        <div>
          <h3 className="text-sm font-bold text-slate-200">Stage A - 数据源配置与启用</h3>
          <p className="text-xs text-slate-500 mt-1">最后更新: 10分钟前</p>
        </div>
        <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded border border-emerald-500/20 flex items-center">
          <CheckCircle2 size={14} className="mr-1.5" />
          COMPLETED
        </span>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-800 bg-slate-950/50">
          <h4 className="text-sm font-bold text-slate-300">连接状态 (Connection Status)</h4>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-slate-500 mb-1">Connected</div>
              <div className="text-sm font-medium text-emerald-400 flex items-center">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div>
                True
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Auth Mode</div>
              <div className="text-sm font-mono text-slate-300 bg-slate-800 px-2 py-0.5 rounded inline-block">vault</div>
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">Last Test Time</div>
            <div className="text-sm text-slate-300">2026-02-28 01:20:00</div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-800 bg-slate-950/50">
          <h4 className="text-sm font-bold text-slate-300">范围与预算 (Scope & Budget)</h4>
        </div>
        <div className="p-4 space-y-5">
          <div>
            <div className="text-xs font-medium text-slate-400 mb-2">Include 规则</div>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded text-xs font-mono">^hr_.*</span>
              <span className="px-2 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded text-xs font-mono">.*_employees$</span>
            </div>
          </div>
          <div>
            <div className="text-xs font-medium text-slate-400 mb-2">Exclude 规则</div>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-slate-800 text-slate-400 border border-slate-700 rounded text-xs font-mono">.*_backup$</span>
              <span className="px-2 py-1 bg-slate-800 text-slate-400 border border-slate-700 rounded text-xs font-mono">temp_.*</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/50">
            <div className="text-xs font-medium text-slate-400 mb-3">Scan Budget</div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-950 rounded p-2 border border-slate-800/50">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">max_rows</div>
                <div className="text-sm font-mono text-slate-300">10,000</div>
              </div>
              <div className="bg-slate-950 rounded p-2 border border-slate-800/50">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">qps</div>
                <div className="text-sm font-mono text-slate-300">50</div>
              </div>
              <div className="bg-slate-950 rounded p-2 border border-slate-800/50">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">concurrency</div>
                <div className="text-sm font-mono text-slate-300">5</div>
              </div>
              <div className="bg-slate-950 rounded p-2 border border-slate-800/50">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">timeout</div>
                <div className="text-sm font-mono text-slate-300">30s</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 flex items-center space-x-3">
        <button className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg transition-colors border border-slate-700 flex items-center justify-center">
          <Database size={16} className="mr-2 text-slate-400" />
          查看数据源设置
        </button>
        <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors border border-slate-700 flex items-center justify-center">
          <RotateCcw size={16} className="mr-2" />
          重试
        </button>
      </div>
    </div>
  );
}

// Stage B: 扫描与画像
function StageBContent() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
        <div>
          <h3 className="text-sm font-bold text-slate-200">Stage B - 扫描与画像/血缘/Usage</h3>
          <p className="text-xs text-slate-500 mt-1">最后更新: 5分钟前</p>
        </div>
        <span className="px-2.5 py-1 bg-yellow-500/10 text-yellow-500 text-xs font-bold rounded border border-yellow-500/20 flex items-center">
          <AlertTriangle size={14} className="mr-1.5" />
          DEGRADED
        </span>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
        <div className="flex items-start">
          <AlertTriangle size={16} className="text-yellow-500 mt-0.5 mr-2 shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-yellow-500 mb-1">发生降级 (Degraded)</h4>
            <p className="text-xs text-yellow-500/80 mb-2">
              降级原因: <span className="font-mono bg-yellow-500/20 px-1 rounded">timeout</span> 在扫描大表 `employee_logs` 时发生。
            </p>
            <p className="text-xs text-slate-400">影响: Profile completeness 下降，可能导致 D 阶段 Route 预测准确率降低。</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-500 mb-2">Schema Coverage</div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-200">4,592</span>
            <span className="text-xs text-slate-500">字段</span>
          </div>
          <div className="text-[10px] text-emerald-400 mt-1">PK/FK 识别完成</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-500 mb-2">Profile Completeness</div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-yellow-500">85%</span>
          </div>
          <div className="text-[10px] text-yellow-500/70 mt-1">部分大表超时跳过</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-500 mb-2">Usage Coverage</div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-200">92%</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">基于最近30天查询日志</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-500 mb-2">Lineage Coverage</div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-200">100%</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">解析成功</div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center">
          <h4 className="text-sm font-bold text-slate-300">字段画像 (Fields Profile)</h4>
          <button className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center">
            <ExternalLink size={12} className="mr-1" />
            打开扫描详情页
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400">
              <tr>
                <th className="px-4 py-2 font-medium">field_name</th>
                <th className="px-4 py-2 font-medium">nonNull</th>
                <th className="px-4 py-2 font-medium">unique</th>
                <th className="px-4 py-2 font-medium">distinct</th>
                <th className="px-4 py-2 font-medium">top_values</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-slate-300">
              <tr className="hover:bg-slate-800/50">
                <td className="px-4 py-3 font-mono text-indigo-400">id</td>
                <td className="px-4 py-3">100%</td>
                <td className="px-4 py-3">100%</td>
                <td className="px-4 py-3">10,000</td>
                <td className="px-4 py-3 text-slate-500 truncate max-w-[100px]">-</td>
              </tr>
              <tr className="hover:bg-slate-800/50">
                <td className="px-4 py-3 font-mono text-indigo-400">status</td>
                <td className="px-4 py-3">98%</td>
                <td className="px-4 py-3">0.05%</td>
                <td className="px-4 py-3">5</td>
                <td className="px-4 py-3 text-slate-500 truncate max-w-[100px]">ACTIVE, INACTIVE, PENDING</td>
              </tr>
              <tr className="hover:bg-slate-800/50">
                <td className="px-4 py-3 font-mono text-indigo-400">department_id</td>
                <td className="px-4 py-3">95%</td>
                <td className="px-4 py-3">0.12%</td>
                <td className="px-4 py-3">12</td>
                <td className="px-4 py-3 text-slate-500 truncate max-w-[100px]">D01, D02, D05</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2 border-t border-slate-800 bg-slate-950/50 flex justify-between items-center text-xs text-slate-500">
          <span>显示 1-3，共 4,592 条</span>
          <div className="flex space-x-1">
            <button className="px-2 py-1 hover:bg-slate-800 rounded disabled:opacity-50" disabled>
              &lt;
            </button>
            <button className="px-2 py-1 hover:bg-slate-800 rounded">&gt;</button>
          </div>
        </div>
      </div>

      <div className="pt-4 flex items-center space-x-3">
        <button className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center">
          <RotateCcw size={16} className="mr-2" />
          降低采样率重试
        </button>
        <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors border border-slate-700 flex items-center justify-center">
          <Settings size={16} className="mr-2" />
          调整扫描策略
        </button>
      </div>
    </div>
  );
}

// Stage C: 质量规则与检测
function StageCContent() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
        <div>
          <h3 className="text-sm font-bold text-slate-200">Stage C - 质量规则草案与检测</h3>
          <p className="text-xs text-slate-500 mt-1">最后更新: 刚刚</p>
        </div>
        <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded border border-emerald-500/20 flex items-center">
          <CheckCircle2 size={14} className="mr-1.5" />
          COMPLETED
        </span>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center">
          <h4 className="text-sm font-bold text-slate-300">规则草案摘要 (Rules Draft Summary)</h4>
          <span className="text-xs font-mono bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded">Total: 45</span>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <div className="text-xs text-slate-500 mb-2">按类型分布 (By Type)</div>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-slate-800 text-slate-300 border border-slate-700 rounded text-xs">
                not_null: <span className="font-mono text-indigo-400">18</span>
              </span>
              <span className="px-2 py-1 bg-slate-800 text-slate-300 border border-slate-700 rounded text-xs">
                unique: <span className="font-mono text-indigo-400">5</span>
              </span>
              <span className="px-2 py-1 bg-slate-800 text-slate-300 border border-slate-700 rounded text-xs">
                range: <span className="font-mono text-indigo-400">8</span>
              </span>
              <span className="px-2 py-1 bg-slate-800 text-slate-300 border border-slate-700 rounded text-xs">
                regex: <span className="font-mono text-indigo-400">10</span>
              </span>
              <span className="px-2 py-1 bg-slate-800 text-slate-300 border border-slate-700 rounded text-xs">
                fk: <span className="font-mono text-indigo-400">3</span>
              </span>
              <span className="px-2 py-1 bg-slate-800 text-slate-300 border border-slate-700 rounded text-xs">
                volatility: <span className="font-mono text-indigo-400">1</span>
              </span>
            </div>
          </div>
          <div className="pt-3 border-t border-slate-800/50">
            <div className="text-xs text-slate-500 mb-2">按级别分布 (By Level)</div>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                <span className="text-sm text-slate-300">
                  P1: <span className="font-mono font-bold">12</span>
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                <span className="text-sm text-slate-300">
                  P2 (默认): <span className="font-mono font-bold">33</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center">
          <h4 className="text-sm font-bold text-slate-300">检测结果发现 (Top Findings)</h4>
          <span className="text-xs font-mono bg-red-500/20 text-red-400 px-2 py-0.5 rounded">Violations: 15</span>
        </div>
        <div className="p-4 space-y-3">
          <div className="text-xs font-medium text-slate-400 mb-2">Top 3 Violated Rules</div>

          <div className="bg-slate-950 border border-slate-800/50 rounded-lg p-3">
            <div className="flex justify-between items-start mb-1">
              <span className="text-sm font-medium text-slate-200">NULL_CHECK</span>
              <span className="text-xs font-mono text-red-400">8 violations</span>
            </div>
            <div className="text-xs text-slate-500 mb-2">Rule: salary must not be null</div>
            <div className="text-[10px] text-slate-400 bg-slate-900 px-2 py-1 rounded inline-block">
              Affected: <span className="font-mono text-indigo-400">hr_core_db.employees.salary</span>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800/50 rounded-lg p-3">
            <div className="flex justify-between items-start mb-1">
              <span className="text-sm font-medium text-slate-200">FORMAT_CHECK</span>
              <span className="text-xs font-mono text-yellow-500">5 violations</span>
            </div>
            <div className="text-xs text-slate-500 mb-2">Rule: email must match regex ^[^@]+@[^@]+\.[^@]+$</div>
            <div className="text-[10px] text-slate-400 bg-slate-900 px-2 py-1 rounded inline-block">
              Affected: <span className="font-mono text-indigo-400">hr_core_db.employees.email</span>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800/50 rounded-lg p-3">
            <div className="flex justify-between items-start mb-1">
              <span className="text-sm font-medium text-slate-200">RANGE_CHECK</span>
              <span className="text-xs font-mono text-yellow-500">2 violations</span>
            </div>
            <div className="text-xs text-slate-500 mb-2">Rule: age between 18 and 65</div>
            <div className="text-[10px] text-slate-400 bg-slate-900 px-2 py-1 rounded inline-block">
              Affected: <span className="font-mono text-indigo-400">hr_core_db.employees.age</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 flex flex-col space-y-3">
        <button className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center">
          <ShieldCheck size={16} className="mr-2" />
          打开质量草案工作台
        </button>
        <div className="flex space-x-3">
          <button className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors border border-slate-700 flex items-center justify-center">
            <ArrowUpCircle size={16} className="mr-2" />
            提升规则级别
          </button>
          <button className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors border border-slate-700 flex items-center justify-center">
            <Download size={16} className="mr-2" />
            导出规则
          </button>
        </div>
      </div>
    </div>
  );
}

// Stage D: 语义理解结果
function StageDContent({ onFieldClick }: { onFieldClick: (field: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
        <div>
          <h3 className="text-sm font-bold text-slate-200">Stage D - 语义理解结果</h3>
          <p className="text-xs text-slate-500 mt-1">最后更新: 2分钟前</p>
        </div>
        <span className="px-2.5 py-1 bg-yellow-500/10 text-yellow-500 text-xs font-bold rounded border border-yellow-500/20 flex items-center">
          <AlertTriangle size={14} className="mr-1.5" />
          SOFT_BLOCKED
        </span>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-800 bg-slate-950/50">
          <h4 className="text-sm font-bold text-slate-300">表级摘要 (Table Summary)</h4>
        </div>
        <div className="p-4 grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-slate-500 mb-1">Table Type</div>
            <div className="text-sm font-medium text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded inline-block">FACT</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">Grain Suggestion</div>
            <div className="text-sm text-slate-300">employee_id, record_date</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">Primary Entity</div>
            <div className="text-sm text-slate-300">Employee</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">Time Field</div>
            <div className="text-sm text-slate-300">created_at</div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center">
          <h4 className="text-sm font-bold text-slate-300">字段路由分布 (Route Distribution)</h4>
          <div className="flex space-x-3 text-xs">
            <span className="text-slate-400">
              Auto-confirmed: <span className="text-emerald-400 font-mono">85%</span>
            </span>
            <span className="text-slate-400">
              Unknown: <span className="text-slate-300 font-mono">2%</span>
            </span>
          </div>
        </div>
        <div className="p-4">
          <div className="h-4 w-full flex rounded-full overflow-hidden mb-3">
            <div className="bg-emerald-500" style={{ width: '85%' }} title="AUTO_PASS: 85%"></div>
            <div className="bg-yellow-500" style={{ width: '8%' }} title="NEEDS_CONFIRM: 8%"></div>
            <div className="bg-red-500" style={{ width: '3%' }} title="CONFLICT: 3%"></div>
            <div className="bg-orange-500" style={{ width: '2%' }} title="ANOMALY: 2%"></div>
            <div className="bg-slate-500" style={{ width: '2%' }} title="IGNORE_CANDIDATE: 2%"></div>
          </div>
          <div className="flex flex-wrap gap-3 text-[10px]">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></div>
              <span className="text-slate-400">AUTO_PASS (85%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-yellow-500 mr-1.5"></div>
              <span className="text-slate-400">NEEDS_CONFIRM (8%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-red-500 mr-1.5"></div>
              <span className="text-slate-400">CONFLICT (3%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-orange-500 mr-1.5"></div>
              <span className="text-slate-400">ANOMALY (2%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-slate-500 mr-1.5"></div>
              <span className="text-slate-400">IGNORE (2%)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-800 bg-slate-950/50">
          <h4 className="text-sm font-bold text-slate-300">热点关注 (Hotspots)</h4>
        </div>
        <div className="p-4 grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="text-xs font-bold text-red-400 mb-2 flex items-center">
              <AlertTriangle size={12} className="mr-1" /> Top Conflicts
            </div>
            <div className="text-xs text-slate-300 bg-slate-950 px-2 py-1.5 rounded border border-slate-800/50 truncate cursor-pointer hover:bg-slate-800" onClick={() => onFieldClick('department_id')}>
              department_id
            </div>
            <div className="text-xs text-slate-300 bg-slate-950 px-2 py-1.5 rounded border border-slate-800/50 truncate cursor-pointer hover:bg-slate-800" onClick={() => onFieldClick('manager_id')}>
              manager_id
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-xs font-bold text-orange-400 mb-2 flex items-center">
              <AlertTriangle size={12} className="mr-1" /> Top Anomalies
            </div>
            <div className="text-xs text-slate-300 bg-slate-950 px-2 py-1.5 rounded border border-slate-800/50 truncate cursor-pointer hover:bg-slate-800" onClick={() => onFieldClick('salary_band')}>
              salary_band
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-400 mb-2 flex items-center">
              <Info size={12} className="mr-1" /> Ignore Candidates
            </div>
            <div className="text-xs text-slate-300 bg-slate-950 px-2 py-1.5 rounded border border-slate-800/50 truncate cursor-pointer hover:bg-slate-800" onClick={() => onFieldClick('temp_flag')}>
              temp_flag
            </div>
            <div className="text-xs text-slate-300 bg-slate-950 px-2 py-1.5 rounded border border-slate-800/50 truncate cursor-pointer hover:bg-slate-800" onClick={() => onFieldClick('backup_date')}>
              backup_date
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center">
          <h4 className="text-sm font-bold text-slate-300">字段决策表 (Fields Decision)</h4>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1.5 text-slate-500" />
              <input type="text" placeholder="搜索字段..." className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-md pl-8 pr-3 py-1.5 focus:outline-none focus:border-indigo-500" />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400">
              <tr>
                <th className="px-4 py-2 font-medium">field_name</th>
                <th className="px-4 py-2 font-medium">Top1 Type/Role</th>
                <th className="px-4 py-2 font-medium">Scores (Conf/Gap/Comp/Ign)</th>
                <th className="px-4 py-2 font-medium">Route</th>
                <th className="px-4 py-2 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-slate-300">
              <tr className="hover:bg-slate-800/50">
                <td className="px-4 py-3 font-mono text-indigo-400">department_id</td>
                <td className="px-4 py-3">STRING / DIMENSION</td>
                <td className="px-4 py-3 font-mono text-slate-400">0.82 / 0.15 / 0.95 / 0.01</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 bg-red-500/10 text-red-400 text-[10px] font-bold rounded border border-red-500/20">CONFLICT</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => onFieldClick('department_id')} className="text-indigo-400 hover:text-indigo-300 font-medium">
                    处理
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-slate-800/50">
                <td className="px-4 py-3 font-mono text-indigo-400">status</td>
                <td className="px-4 py-3">STRING / DIMENSION</td>
                <td className="px-4 py-3 font-mono text-slate-400">0.95 / 0.40 / 0.98 / 0.00</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded border border-emerald-500/20">AUTO_PASS</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => onFieldClick('status')} className="text-slate-500 hover:text-slate-300 font-medium">
                    查看
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-slate-800/50">
                <td className="px-4 py-3 font-mono text-indigo-400">temp_flag</td>
                <td className="px-4 py-3">BOOLEAN / UNKNOWN</td>
                <td className="px-4 py-3 font-mono text-slate-400">0.40 / 0.05 / 0.20 / 0.85</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 bg-slate-800 text-slate-400 text-[10px] font-bold rounded border border-slate-700">IGNORE_CANDIDATE</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => onFieldClick('temp_flag')} className="text-indigo-400 hover:text-indigo-300 font-medium">
                    处理
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Stage E: 候选对象
function StageEContent() {
  const candidates = [
    { name: 'Customer', score: 0.92, metrics: { identity: 0.95, cohesion: 0.88, separation: 0.9, relationship: 0.94 }, suggestion: null },
    { name: 'Order_Transaction', score: 0.85, metrics: { identity: 0.82, cohesion: 0.85, separation: 0.8, relationship: 0.92 }, suggestion: 'Split' },
    { name: 'Product_Catalog', score: 0.78, metrics: { identity: 0.75, cohesion: 0.8, separation: 0.72, relationship: 0.85 }, suggestion: 'Merge' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-sm text-slate-400 mb-1">候选对象总数</div>
          <div className="text-2xl font-bold text-slate-200">24</div>
          <div className="text-xs text-slate-500 mt-1">基于当前语义生成</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-sm text-slate-400 mb-1">评分分布</div>
          <div className="flex items-end space-x-4 mt-1">
            <div className="flex flex-col items-center">
              <div className="text-lg font-bold text-emerald-400">15</div>
              <div className="text-[10px] text-slate-500 uppercase">高</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-lg font-bold text-yellow-400">7</div>
              <div className="text-[10px] text-slate-500 uppercase">中</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-lg font-bold text-red-400">2</div>
              <div className="text-[10px] text-slate-500 uppercase">低</div>
            </div>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-sm text-slate-400 mb-1">合并/拆分建议</div>
          <div className="text-2xl font-bold text-indigo-400">5</div>
          <div className="text-xs text-slate-500 mt-1">待人工确认</div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-200">Top 候选对象 (Candidates)</h4>
          <span className="text-xs text-slate-500">按综合评分排序</span>
        </div>
        <div className="divide-y divide-slate-800">
          {candidates.map((candidate, idx) => (
            <div key={idx} className="p-4 hover:bg-slate-800/30 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <div className="text-sm font-bold text-slate-200">{candidate.name}</div>
                    {candidate.suggestion && (
                      <span
                        className={cn(
                          "px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border",
                          candidate.suggestion === 'Split'
                            ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                            : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                        )}
                      >
                        {candidate.suggestion} Suggestion
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs text-slate-500">Score</span>
                      <span
                        className={cn(
                          "text-xs font-mono font-bold",
                          candidate.score >= 0.9 ? "text-emerald-400" : candidate.score >= 0.8 ? "text-yellow-400" : "text-red-400"
                        )}
                      >
                        {candidate.score.toFixed(2)}
                      </span>
                    </div>
                    <div className="h-3 w-px bg-slate-700"></div>
                    <div className="flex items-center space-x-3 text-[10px] font-mono text-slate-400">
                      <span title="Identity Strength">ID: {candidate.metrics.identity.toFixed(2)}</span>
                      <span title="Cohesion">COH: {candidate.metrics.cohesion.toFixed(2)}</span>
                      <span title="Separation">SEP: {candidate.metrics.separation.toFixed(2)}</span>
                      <span title="Relationship Support">REL: {candidate.metrics.relationship.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {candidate.suggestion && (
                    <button className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded transition-colors border border-slate-700">
                      Review {candidate.suggestion}
                    </button>
                  )}
                  <button className="px-2.5 py-1 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 text-xs font-medium rounded transition-colors border border-indigo-500/30">
                    Open in Modeler
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
