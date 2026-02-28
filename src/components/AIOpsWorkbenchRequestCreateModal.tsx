import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Database, Search, Bot, CheckCircle2, AlertTriangle, 
  PlayCircle, FileText, Settings, ChevronDown, CheckSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIOpsWorkbenchRequestCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (start: boolean) => void;
}

export default function AIOpsWorkbenchRequestCreateModal({ isOpen, onClose, onCreate }: AIOpsWorkbenchRequestCreateModalProps) {
  const [domain, setDomain] = useState('HR');
  const [datasource, setDatasource] = useState('hr_core_db');
  const [asset, setAsset] = useState('');
  const [useCurrentContext, setUseCurrentContext] = useState(true);
  const [requestText, setRequestText] = useState('');
  const [isEmployeeResolved, setIsEmployeeResolved] = useState(true);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="h-16 border-b border-slate-800 flex items-center justify-between px-6 shrink-0 bg-slate-900">
            <h2 className="text-lg font-bold text-slate-100 flex items-center">
              <PlayCircle className="mr-2 text-indigo-400" size={20} />
              新建 AI 运营需求
            </h2>
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
            
            {/* Section A: Context */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-200 flex items-center">
                  <Database size={16} className="mr-2 text-slate-400" />
                  上下文
                </h3>
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-5 h-5 rounded hover:bg-slate-800 transition-colors">
                    <input 
                      type="checkbox" 
                      className="peer sr-only" 
                      checked={useCurrentContext}
                      onChange={(e) => setUseCurrentContext(e.target.checked)}
                    />
                    <div className="w-4 h-4 rounded border border-slate-500 peer-checked:bg-indigo-500 peer-checked:border-indigo-500 flex items-center justify-center transition-colors">
                      <CheckSquare size={12} className="text-white opacity-0 peer-checked:opacity-100" />
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors select-none">从当前页面带入</span>
                </label>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400">业务域</label>
                  <div className="relative">
                    <select 
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-3 pr-8 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 appearance-none"
                    >
                      <option value="HR">HR</option>
                      <option value="Sales">Sales</option>
                      <option value="Finance">Finance</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400">数据源</label>
                  <div className="relative">
                    <select 
                      value={datasource}
                      onChange={(e) => setDatasource(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-3 pr-8 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 appearance-none"
                    >
                      <option value="hr_core_db">hr_core_db</option>
                      <option value="sales_db">sales_db</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400">数据资产 (可选)</label>
                  <div className="relative">
                    <input 
                      type="text"
                      placeholder="例如: schema.table"
                      value={asset}
                      onChange={(e) => setAsset(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 placeholder:text-slate-600"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Section B: Request */}
            <section className="space-y-4">
              <h3 className="text-sm font-bold text-slate-200 flex items-center">
                <FileText size={16} className="mr-2 text-slate-400" />
                需求描述
              </h3>
              
              <div className="space-y-3">
                <textarea 
                  value={requestText}
                  onChange={(e) => setRequestText(e.target.value)}
                  placeholder="描述你要 AI 完成什么..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 min-h-[120px] resize-none"
                />
                <div className="flex flex-wrap gap-2">
                  {[
                    '一键运行全流程（L2）',
                    '只跑扫描',
                    '只跑语义理解',
                    '生成候选对象',
                    '生成质量规则草案'
                  ].map(shortcut => (
                    <button 
                      key={shortcut}
                      onClick={() => setRequestText(shortcut)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition-colors border border-slate-700"
                    >
                      {shortcut}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Section C: Employee Resolve */}
            <section className="space-y-4">
              <h3 className="text-sm font-bold text-slate-200 flex items-center">
                <Bot size={16} className="mr-2 text-slate-400" />
                AI员工分配
              </h3>
              
              <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
                
                <div className="flex items-start justify-between relative z-10">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-900/20 shrink-0">
                      <Bot size={20} className="text-white" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-base font-bold text-slate-200">数据语义理解专家</h4>
                        <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] font-bold rounded">L2</span>
                      </div>
                      <p className="text-sm text-slate-400 mb-3">基于您的需求描述，系统推荐使用此员工来执行任务。</p>
                      
                      <div className="flex items-center space-x-4 text-xs">
                        <div className="flex items-center text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                          <CheckCircle2 size={12} className="mr-1.5" />
                          <span>范围匹配: 命中</span>
                        </div>
                        <div className="flex items-center text-slate-400">
                          <Settings size={12} className="mr-1.5" />
                          <span>能力匹配度: 95%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2 shrink-0 ml-4">
                    <button 
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-colors border",
                        isEmployeeResolved 
                          ? "bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-500" 
                          : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                      )}
                      onClick={() => setIsEmployeeResolved(true)}
                    >
                      使用推荐
                    </button>
                    <button className="px-4 py-2 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-lg text-sm font-medium transition-colors">
                      更换员工
                    </button>
                  </div>
                </div>
              </div>
            </section>

          </div>

          {/* Footer Actions */}
          <div className="h-16 border-t border-slate-800 bg-slate-900/50 flex items-center justify-end px-6 space-x-3 shrink-0">
            <button 
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors"
            >
              取消
            </button>
            <button 
              onClick={() => onCreate(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium transition-colors border border-slate-700"
            >
              仅创建
            </button>
            <button 
              onClick={() => onCreate(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-indigo-900/20 flex items-center"
            >
              <PlayCircle size={16} className="mr-2" />
              创建并运行
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
