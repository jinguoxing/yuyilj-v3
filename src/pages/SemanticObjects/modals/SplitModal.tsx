import React from 'react';
import { X, BrainCircuit, AlertTriangle, Network, Sparkles, Check, ArrowRight, Split, Database } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { BusinessObject, SplitStrategy } from '../types';

interface SplitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedObject: BusinessObject | null;
  strategy: SplitStrategy;
  onStrategyChange: (strategy: SplitStrategy) => void;
}

export default function SplitModal({
  isOpen,
  onClose,
  onConfirm,
  selectedObject,
  strategy,
  onStrategyChange
}: SplitModalProps) {
  if (!isOpen || !selectedObject) return null;

  return (
    <AnimatePresence>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-slate-900 border border-slate-700 rounded-xl w-[600px] shadow-2xl"
        >
          <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
            <div className="flex items-center space-x-2">
              <BrainCircuit className="text-indigo-400" size={20} />
              <h3 className="text-lg font-semibold text-slate-200">AI 对象拆分建议</h3>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white">
              <X size={20} />
            </button>
          </div>
          <div className="p-6 space-y-6">
            {/* Strategy Selector */}
            <div className="flex space-x-2 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => onStrategyChange('sensitivity')}
                className={cn(
                  "flex-1 py-1.5 px-3 rounded text-xs font-medium transition-all flex items-center justify-center space-x-2",
                  strategy === 'sensitivity' ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
                )}
              >
                <AlertTriangle size={12} />
                <span>按敏感度拆分 (推荐)</span>
              </button>
              <button
                onClick={() => onStrategyChange('frequency')}
                className={cn(
                  "flex-1 py-1.5 px-3 rounded text-xs font-medium transition-all flex items-center justify-center space-x-2",
                  strategy === 'frequency' ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
                )}
              >
                <Network size={12} />
                <span>按访问频率拆分</span>
              </button>
            </div>

            <div className="bg-indigo-950/30 border border-indigo-500/30 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <Sparkles className="text-yellow-400 mt-1 shrink-0" size={18} />
                <div>
                  <h4 className="text-sm font-medium text-indigo-300">
                    {strategy === 'sensitivity' ? '推理解释：高内聚 / 低耦合' : '推理解释：访问模式分析'}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {strategy === 'sensitivity' ? (
                      <>
                        Reasoning LLM 分析发现该对象包含两组语义簇：
                        <br />1. 核心身份信息 (Core Identity) - 高频访问
                        <br />2. 敏感薪资信息 (Sensitive Compensation) - 低频且需权限控制
                        <br />建议拆分为 <span className="font-mono text-indigo-300">Employee</span> 和 <span className="font-mono text-indigo-300">Employee_Sensitive</span> 以优化安全性和模型清晰度。
                      </>
                    ) : (
                      <>
                        Query Log 分析显示：
                        <br />1. 基础信息 (Name, Dept) 在 90% 的查询中出现。
                        <br />2. 详细档案 (Bio, History) 仅在 5% 的查询中出现。
                        <br />建议拆分为 <span className="font-mono text-indigo-300">Employee_Core</span> 和 <span className="font-mono text-indigo-300">Employee_Detail</span> 以提升查询性能。
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center">
              <div className="border border-slate-700 rounded-lg bg-slate-950/50 p-3 h-48 flex flex-col">
                <div className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">当前对象 (保留)</div>
                <div className="font-medium text-slate-200 mb-2">{selectedObject?.name}</div>
                <div className="flex-1 overflow-y-auto space-y-1 pr-1">
                  <div className="text-xs text-slate-400 flex items-center"><Check size={10} className="mr-1 text-green-500" /> employee_id</div>
                  <div className="text-xs text-slate-400 flex items-center"><Check size={10} className="mr-1 text-green-500" /> full_name</div>
                  <div className="text-xs text-slate-400 flex items-center"><Check size={10} className="mr-1 text-green-500" /> hire_date</div>
                  <div className="text-xs text-slate-400 flex items-center"><Check size={10} className="mr-1 text-green-500" /> dept_code</div>
                  <div className="text-xs text-slate-500 italic pl-4">+ 3 more...</div>
                </div>
              </div>

              <div className="flex flex-col items-center text-slate-500 space-y-2">
                <span className="text-[10px] uppercase tracking-wider">迁移</span>
                <ArrowRight size={20} />
              </div>

              <div className="border border-indigo-500/30 rounded-lg bg-indigo-950/10 p-3 h-48 flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 p-1 bg-indigo-500/20 rounded-bl-lg">
                  <Sparkles size={12} className="text-indigo-400" />
                </div>
                <div className="text-xs font-semibold text-indigo-300 mb-2 uppercase tracking-wider">新对象 (建议)</div>
                <div className="font-medium text-indigo-200 mb-2">
                  {strategy === 'sensitivity' ? `${selectedObject?.name}_Sensitive` : `${selectedObject?.name}_Detail`}
                </div>
                <div className="flex-1 overflow-y-auto space-y-1 pr-1">
                  {strategy === 'sensitivity' ? (
                    <>
                      <div className="text-xs text-indigo-300/80 flex items-center"><Database size={10} className="mr-1" /> annual_salary</div>
                      <div className="text-xs text-indigo-300/80 flex items-center"><Database size={10} className="mr-1" /> ssn_number</div>
                      <div className="text-xs text-indigo-300/80 flex items-center"><Database size={10} className="mr-1" /> bonus_amt</div>
                      <div className="text-xs text-indigo-300/80 flex items-center"><Database size={10} className="mr-1" /> tax_bracket</div>
                    </>
                  ) : (
                    <>
                      <div className="text-xs text-indigo-300/80 flex items-center"><Database size={10} className="mr-1" /> biography_text</div>
                      <div className="text-xs text-indigo-300/80 flex items-center"><Database size={10} className="mr-1" /> previous_employment</div>
                      <div className="text-xs text-indigo-300/80 flex items-center"><Database size={10} className="mr-1" /> education_history</div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="p-5 border-t border-slate-800 flex justify-end space-x-3 bg-slate-900/50">
            <button onClick={onClose} className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">取消</button>
            <button onClick={onConfirm} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium shadow-lg shadow-indigo-900/20 flex items-center space-x-2">
              <Split size={16} />
              <span>确认拆分</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
