import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PlayCircle, AlertTriangle, FileText, Activity, PanelRightClose, RotateCcw, XCircle, CheckCircle2, Clock, ExternalLink, Download, Box, Play, ShieldCheck, Settings, ArrowUpCircle, Database, ChevronRight, Search, Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Stage, STAGES, RightTab } from '../types';

interface RightRailProps {
  isOpen: boolean;
  onClose: () => void;
  rightTab: RightTab;
  onRightTabChange: (tab: RightTab) => void;
  onOpenStage: (id: string) => void;
  onResume: () => void;
  onSetFieldAndOpenDrawer: (field: string) => void;
  selectedField?: string;
  isFieldDrawerOpen: boolean;
  onSetFieldDrawerOpen: (open: boolean) => void;
}

export default function RightRail({
  isOpen,
  onClose,
  rightTab,
  onRightTabChange,
  onOpenStage,
  onResume,
  onSetFieldAndOpenDrawer,
  selectedField,
  isFieldDrawerOpen,
  onSetFieldDrawerOpen
}: RightRailProps) {
  const TABS = [
    { id: 'runs' as const, label: '运行进度', icon: PlayCircle },
    { id: 'actions' as const, label: '待处理', icon: AlertTriangle },
    { id: 'deliverables' as const, label: '交付物', icon: FileText },
    { id: 'replay' as const, label: '执行回放', icon: Activity },
  ];

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 400, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          className="border-l border-slate-800 bg-slate-900/30 flex flex-col shrink-0 z-10 overflow-hidden"
        >
          <div className="flex items-center border-b border-slate-800 shrink-0 bg-slate-900/80 backdrop-blur-sm">
            <div className="flex-1 flex items-center pr-10">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onRightTabChange(tab.id)}
                  className={cn(
                    "flex-1 flex items-center justify-center space-x-2 py-4 text-xs font-medium border-b-2 transition-colors",
                    rightTab === tab.id
                      ? "border-indigo-500 text-indigo-400 bg-indigo-500/5"
                      : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  )}
                >
                  <tab.icon size={14} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
            <div className="absolute right-2">
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
                title="收起控制台"
              >
                <PanelRightClose size={16} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {rightTab === 'runs' && <RunsTab onOpenStage={onOpenStage} onResume={onResume} stages={STAGES} />}
            {rightTab === 'actions' && (
              <ActionsTab onOpenStage={onOpenStage} onSetFieldAndOpenDrawer={onSetFieldAndOpenDrawer} />
            )}
            {rightTab === 'deliverables' && <DeliverablesTab />}
            {rightTab === 'replay' && <ReplayTab />}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Runs Tab Component
function RunsTab({ onOpenStage, onResume, stages }: { onOpenStage: (id: string) => void; onResume: () => void; stages: Stage[] }) {
  return (
    <div className="flex flex-col h-full">
      {/* RunHeader */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/50 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-mono font-bold text-slate-200">RUN-8924</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 uppercase tracking-wider">
              软阻塞
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <button onClick={onResume} className="p-1.5 text-emerald-400 hover:bg-emerald-500/10 rounded transition-colors" title="恢复执行">
              <PlayCircle size={14} />
            </button>
            <button className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors" title="重试阶段">
              <RotateCcw size={14} />
            </button>
            <button className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors" title="取消">
              <XCircle size={14} />
            </button>
            <button className="p-1.5 text-indigo-400 hover:bg-indigo-500/10 rounded transition-colors" title="打开回放">
              <Activity size={14} />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex flex-col space-y-1">
            <span className="text-slate-500">开始时间</span>
            <span className="text-slate-300 font-mono">2026-02-28 00:15:00</span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-slate-500">耗时</span>
            <span className="text-slate-300 font-mono">10m 24s</span>
          </div>
          <div className="flex flex-col space-y-1 col-span-2 mt-1">
            <span className="text-slate-500">消耗</span>
            <span className="text-slate-300 font-mono">12.4k tokens / 8 tool calls</span>
          </div>
        </div>
      </div>

      {/* StageStepper & StageCards */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 relative">
        {/* Vertical Line for Stepper */}
        <div className="absolute left-8 top-8 bottom-8 w-px bg-slate-800 z-0" />

        {[...stages].reverse().map((stage) => (
          <div key={stage.id} className="relative z-10 flex items-start space-x-4">
            {/* Stepper Node */}
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 mt-2 bg-slate-950",
                stage.status === 'COMPLETED'
                  ? "border-emerald-500 text-emerald-400"
                  : stage.status === 'IN_PROGRESS'
                  ? "border-blue-500 text-blue-400"
                  : stage.status === 'SOFT_BLOCKED'
                  ? "border-yellow-500 text-yellow-500"
                  : stage.status === 'HARD_BLOCKED'
                  ? "border-red-500 text-red-400"
                  : "border-slate-700 text-slate-500"
              )}
            >
              {stage.status === 'COMPLETED' ? (
                <CheckCircle2 size={14} />
              ) : stage.status === 'SOFT_BLOCKED' ? (
                <AlertTriangle size={14} />
              ) : (
                <span className="text-xs font-bold">{stage.id}</span>
              )}
            </div>

            {/* Stage Card */}
            <div className="flex-1 bg-slate-900 border rounded-xl overflow-hidden transition-all hover:border-slate-700">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <stage.icon size={14} className="text-slate-400" />
                    <h3 className="text-sm font-bold text-slate-200">阶段 {stage.id}: {stage.name}</h3>
                  </div>
                  <span
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-wider",
                      stage.status === 'COMPLETED'
                        ? "text-emerald-500"
                        : stage.status === 'IN_PROGRESS'
                        ? "text-blue-400"
                        : stage.status === 'SOFT_BLOCKED'
                        ? "text-yellow-500"
                        : stage.status === 'HARD_BLOCKED'
                        ? "text-red-400"
                        : "text-slate-500"
                    )}
                  >
                    {stage.status === 'COMPLETED'
                      ? '已完成'
                      : stage.status === 'IN_PROGRESS'
                      ? '运行中'
                      : stage.status === 'SOFT_BLOCKED'
                      ? '软阻塞'
                      : stage.status === 'HARD_BLOCKED'
                      ? '硬阻塞'
                      : '未开始'}
                  </span>
                </div>

                <p className="text-xs text-slate-400 mb-3">{stage.summary}</p>

                {/* Metrics */}
                {stage.metrics && stage.metrics.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {stage.metrics.map((metric, i) => (
                      <div key={i} className="flex items-center space-x-1 bg-slate-950 border border-slate-800 px-2 py-1 rounded text-[10px]">
                        <span className="text-slate-500">{metric.label}:</span>
                        <span
                          className={cn(
                            "font-mono font-medium",
                            metric.status === 'success'
                              ? "text-emerald-400"
                              : metric.status === 'warning'
                              ? "text-yellow-400"
                              : metric.status === 'error'
                              ? "text-red-400"
                              : "text-slate-300"
                          )}
                        >
                          {metric.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-slate-800/50">
                  <span className="text-xs text-slate-500 flex items-center">
                    <Clock size={12} className="mr-1" /> {stage.time}
                  </span>
                  <button onClick={() => onOpenStage(stage.id)} className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                    查看详情
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Actions Tab Component
function ActionsTab({ onOpenStage, onSetFieldAndOpenDrawer }: { onOpenStage: (id: string) => void; onSetFieldAndOpenDrawer: (field: string) => void }) {
  return (
    <div className="p-4 space-y-6">
      {/* Hard Blocks */}
      <div>
        <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center">
          <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
          硬阻塞 (Hard-block)
          <span className="ml-2 px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px]">1</span>
        </h3>
        <div className="space-y-3">
          <div className="bg-slate-900 border border-red-500/30 hover:border-red-500/50 rounded-xl p-4 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border bg-red-500/10 text-red-400 border-red-500/20">
                  CREDENTIAL_REQUIRED
                </span>
                <span className="text-xs font-mono text-slate-500">阶段 A</span>
                <span className="text-xs font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">hr_core_db</span>
              </div>
              <span className="text-xs font-mono text-slate-500 shrink-0 ml-2">TSK-001</span>
            </div>

            <p className="text-sm mb-4 text-slate-200">数据源连接失败，需检查凭证</p>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800/50">
              <div className="flex items-center space-x-2">
                <button onClick={() => onOpenStage('A')} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded transition-colors">
                  立即处理
                </button>
                <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded transition-colors border border-slate-700">
                  重试
                </button>
              </div>
              <span className="text-xs text-slate-500">10分钟前</span>
            </div>
          </div>
        </div>
      </div>

      {/* Soft Tasks */}
      <div>
        <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center">
          <span className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></span>
          软任务 (Soft-task)
          <span className="ml-2 px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px]">2</span>
        </h3>
        <div className="space-y-3">
          <div className="bg-slate-900 border border-yellow-500/30 hover:border-yellow-500/50 rounded-xl p-4 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                  SEMANTIC_CONFLICT
                </span>
                <span className="text-xs font-mono text-slate-500">阶段 D</span>
                <span className="text-xs font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">employees.salary</span>
              </div>
              <span className="text-xs font-mono text-slate-500 shrink-0 ml-2">TSK-002</span>
            </div>

            <p className="text-sm mb-4 text-slate-200">发现语义冲突：salary 字段可能包含敏感信息，建议添加脱敏规则</p>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800/50">
              <div className="flex items-center space-x-2">
                <button onClick={() => onOpenStage('D')} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded transition-colors">
                  立即处理
                </button>
                <button onClick={() => onSetFieldAndOpenDrawer('salary')} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded transition-colors border border-slate-700">
                  标记已解决
                </button>
                <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded transition-colors border border-slate-700">
                  重试
                </button>
              </div>
              <span className="text-xs text-slate-500">刚刚</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-colors opacity-60">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border bg-slate-800 text-slate-400 border-slate-700">
                  MISSING_DESCRIPTION
                </span>
                <span className="text-xs font-mono text-slate-500">阶段 B</span>
                <span className="text-xs font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">employees.department_id</span>
              </div>
              <span className="text-xs font-mono text-slate-500 shrink-0 ml-2">TSK-003</span>
            </div>

            <p className="text-sm mb-4 text-slate-400 line-through">字段 department_id 缺少业务描述，建议补充</p>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800/50">
              <span className="text-emerald-400 flex items-center text-xs">
                <CheckCircle2 size={14} className="mr-1" />
                已解决
              </span>
              <span className="text-xs text-slate-500">1小时前</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Deliverables Tab Component
function DeliverablesTab() {
  return (
    <div className="p-4 space-y-4 overflow-y-auto custom-scrollbar h-full pb-20">
      {/* SemanticResultsCard */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center">
            <Database size={16} className="mr-2 text-indigo-400" />
            语义结果 (Semantic Results)
          </h3>
          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded border border-emerald-500/20">READY</span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-slate-950 rounded-lg p-3 border border-slate-800/50">
            <div className="text-xs text-slate-500 mb-1">自动确认字段</div>
            <div className="text-lg font-bold text-slate-200">142</div>
          </div>
          <div className="bg-slate-950 rounded-lg p-3 border border-slate-800/50">
            <div className="text-xs text-slate-500 mb-1">草案字段</div>
            <div className="text-lg font-bold text-slate-200">28</div>
          </div>
          <div className="bg-slate-950 rounded-lg p-3 border border-slate-800/50">
            <div className="text-xs text-slate-500 mb-1">未知占比</div>
            <div className="text-lg font-bold text-yellow-500">5.2%</div>
          </div>
          <div className="bg-slate-950 rounded-lg p-3 border border-slate-800/50">
            <div className="text-xs text-slate-500 mb-1">Route 分布</div>
            <div className="text-xs font-medium text-slate-300">
              <div className="flex justify-between mb-1">
                <span>DIM:</span>
                <span>60%</span>
              </div>
              <div className="flex justify-between">
                <span>FACT:</span>
                <span>40%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button className="flex-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition-colors flex items-center justify-center">
            <ExternalLink size={14} className="mr-1.5" />
            打开语义工作台
          </button>
          <button className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg transition-colors border border-slate-700 flex items-center justify-center">
            <Download size={14} className="mr-1.5" />
            导出 JSON
          </button>
        </div>
      </div>

      {/* QualityDraftCard */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center">
            <ShieldCheck size={16} className="mr-2 text-indigo-400" />
            质量规则草案 (Quality Drafts)
          </h3>
          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded border border-emerald-500/20">READY</span>
        </div>

        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1 bg-slate-950 rounded-lg p-3 border border-slate-800/50">
            <div className="text-xs text-slate-500 mb-1">规则总数</div>
            <div className="text-lg font-bold text-slate-200">45</div>
          </div>
          <div className="flex-1 bg-slate-950 rounded-lg p-3 border border-slate-800/50">
            <div className="text-xs text-slate-500 mb-1">P1 / P2</div>
            <div className="text-lg font-bold text-slate-200">
              12 <span className="text-slate-500 text-sm">/ 33</span>
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="text-xs font-medium text-slate-500 mb-2">Top Violations (预测)</div>
          <div className="flex items-center justify-between bg-slate-950 p-2 rounded border border-slate-800/50">
            <span className="text-xs text-slate-300 truncate pr-2">NULL_CHECK on salary</span>
            <span className="text-xs font-mono text-red-400">High</span>
          </div>
          <div className="flex items-center justify-between bg-slate-950 p-2 rounded border border-slate-800/50">
            <span className="text-xs text-slate-300 truncate pr-2">FORMAT_CHECK on email</span>
            <span className="text-xs font-mono text-yellow-500">Med</span>
          </div>
        </div>

        <button className="w-full px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg transition-colors border border-slate-700 flex items-center justify-center">
          <ExternalLink size={14} className="mr-1.5" />
          打开质量草案
        </button>
      </div>

      {/* ObjectCandidatesCard */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center">
            <Box size={16} className="mr-2 text-indigo-400" />
            候选对象 (Object Candidates)
          </h3>
          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded border border-emerald-500/20">READY</span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-slate-400">发现对象总数</span>
          <span className="text-lg font-bold text-slate-200">12</span>
        </div>

        <div className="space-y-2 mb-4">
          <div className="text-xs font-medium text-slate-500 mb-2">Top 5 Objects</div>
          {['Employee', 'Department', 'Salary', 'Attendance', 'Performance'].map((obj, i) => (
            <div key={obj} className="flex items-center justify-between bg-slate-950 p-2 rounded border border-slate-800/50">
              <span className="text-xs text-slate-300">{obj}</span>
              <span className="text-xs font-mono text-indigo-400">{(0.98 - i * 0.05).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <button className="w-full px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg transition-colors border border-slate-700 flex items-center justify-center">
          <ExternalLink size={14} className="mr-1.5" />
          查看候选对象
        </button>
      </div>
    </div>
  );
}

// Replay Tab Component
function ReplayTab() {
  return (
    <div className="p-4 space-y-4 overflow-y-auto custom-scrollbar h-full pb-20">
      {/* Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Run ID</label>
          <select className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500">
            <option>RUN-20231024-001</option>
            <option>RUN-20231023-042</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Version A (Baseline)</label>
            <select className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500">
              <option>v1.0.0</option>
              <option>v0.9.5</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Version B (Compare)</label>
            <select className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500">
              <option>v1.1.0-draft</option>
              <option>v1.0.1</option>
            </select>
          </div>
        </div>
        <button className="w-full px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition-colors flex items-center justify-center mt-2">
          <Play size={14} className="mr-1.5" />
          运行对比
        </button>
      </div>

      {/* DiffSummaryCard */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <h3 className="text-sm font-bold text-slate-200 mb-4">对比摘要 (Diff Summary)</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-950 rounded-lg p-3 border border-slate-800/50">
            <div className="text-xs text-slate-500 mb-1">Route Diff</div>
            <div className="text-lg font-bold text-yellow-500">12</div>
          </div>
          <div className="bg-slate-950 rounded-lg p-3 border border-slate-800/50">
            <div className="text-xs text-slate-500 mb-1">Top Fields</div>
            <div className="text-lg font-bold text-slate-200">5</div>
          </div>
          <div className="bg-slate-950 rounded-lg p-3 border border-slate-800/50">
            <div className="text-xs text-slate-500 mb-1">Evidence</div>
            <div className="text-lg font-bold text-slate-200">34</div>
          </div>
        </div>
      </div>

      {/* DiffTable */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800">
          <h3 className="text-sm font-bold text-slate-200">字段差异详情 (Diff Table)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400">
              <tr>
                <th className="px-4 py-2 font-medium">field_name</th>
                <th className="px-4 py-2 font-medium">A.top1</th>
                <th className="px-4 py-2 font-medium">B.top1</th>
                <th className="px-4 py-2 font-medium">routeA</th>
                <th className="px-4 py-2 font-medium">routeB</th>
                <th className="px-4 py-2 font-medium">reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-slate-300">
              <tr className="hover:bg-slate-800/50">
                <td className="px-4 py-3 font-mono text-indigo-400">emp_id</td>
                <td className="px-4 py-3">EmployeeID</td>
                <td className="px-4 py-3 text-emerald-400">Employee_ID</td>
                <td className="px-4 py-3">DIM</td>
                <td className="px-4 py-3">DIM</td>
                <td className="px-4 py-3 text-slate-500">Naming standard update</td>
              </tr>
              <tr className="hover:bg-slate-800/50">
                <td className="px-4 py-3 font-mono text-indigo-400">dept_code</td>
                <td className="px-4 py-3">Department</td>
                <td className="px-4 py-3 text-emerald-400">DeptCode</td>
                <td className="px-4 py-3">DIM</td>
                <td className="px-4 py-3 text-yellow-500">FACT</td>
                <td className="px-4 py-3 text-slate-500">Route logic changed</td>
              </tr>
              <tr className="hover:bg-slate-800/50">
                <td className="px-4 py-3 font-mono text-indigo-400">base_sal</td>
                <td className="px-4 py-3">Salary</td>
                <td className="px-4 py-3 text-emerald-400">BaseSalary</td>
                <td className="px-4 py-3">FACT</td>
                <td className="px-4 py-3">FACT</td>
                <td className="px-4 py-3 text-slate-500">Better context match</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
