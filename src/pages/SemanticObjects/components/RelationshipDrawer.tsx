import React from 'react';
import { X, ChevronRight, Box, Network, Layers, Link2, RefreshCw, Share2, GitCommit, ExternalLink } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface Relationship {
  source: string;
  target: string;
  type: string;
  keys: string;
  field: string;
  evidence: string;
  confidence: number;
}

interface RelationshipDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}

const getRelIcon = (type: string) => {
  switch (type) {
    case 'Foreign Key': return <Link2 size={16} className="text-indigo-400" />;
    case 'One-to-Many': return <Network size={16} className="text-blue-400" />;
    case 'Self-Reference': return <RefreshCw size={16} className="text-amber-400" />;
    case 'Association': return <Share2 size={16} className="text-emerald-400" />;
    default: return <GitCommit size={16} className="text-slate-400" />;
  }
};

const getRelColor = (type: string) => {
  switch (type) {
    case 'Foreign Key': return 'border-indigo-500/30 text-indigo-400 bg-indigo-500/5';
    case 'One-to-Many': return 'border-blue-500/30 text-blue-400 bg-blue-500/5';
    case 'Self-Reference': return 'border-amber-500/30 text-amber-400 bg-amber-500/5';
    case 'Association': return 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5';
    default: return 'border-slate-500/30 text-slate-400 bg-slate-500/5';
  }
};

export default function RelationshipDrawer({ isOpen, onClose, data }: RelationshipDrawerProps) {
  const relationships: Relationship[] = data?.relationships || [];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute top-0 right-0 bottom-0 w-[650px] bg-slate-900 border-l border-slate-700 shadow-2xl z-50 flex flex-col"
          >
            <div className="h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center space-x-3">
                <div className="p-1.5 bg-indigo-500/20 rounded-lg">
                  <Network className="text-indigo-400" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100">对象关系可视化</h3>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">检测到 {relationships.length} 条语义关联</div>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 p-8 overflow-y-auto relative bg-slate-950">
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none"></div>

              <div className="relative z-10 space-y-12 flex flex-col items-center">
                {relationships.length > 0 ? (
                  relationships.map((rel: Relationship, idx: number) => {
                    const sourceObj = data.objects?.find((o: any) => o.name === rel.source);
                    const targetObj = data.objects?.find((o: any) => o.name === rel.target);

                    return (
                      <div key={idx} className="w-full flex flex-col items-center">
                        <div className="flex items-center justify-center space-x-0 w-full">
                          {/* Source Node */}
                          <div className="w-64 bg-slate-900 border border-slate-700 rounded-2xl shadow-xl overflow-hidden group hover:border-indigo-500/50 transition-all">
                            <div className="bg-slate-800/50 p-3 border-b border-slate-800">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-2">
                                  <Box size={14} className="text-indigo-400" />
                                  <div className="text-xs font-bold text-white truncate max-w-[140px]">{rel.source}</div>
                                </div>
                                <div className="text-[9px] px-1.5 py-0.5 rounded bg-slate-950 text-slate-500 font-mono">{sourceObj?.type || 'OBJECT'}</div>
                              </div>
                            </div>
                            <div className="p-3 space-y-2">
                              <div className="flex items-center justify-between text-[10px]">
                                <span className="text-slate-500">属性:</span>
                                <span className="text-slate-300">{sourceObj?.fieldCount || 0}</span>
                              </div>
                              <div className="flex items-center justify-between text-[10px]">
                                <span className="text-slate-500">关联字段:</span>
                                <span className="text-indigo-400 font-mono">{rel.field}</span>
                              </div>
                            </div>
                          </div>

                          {/* Edge */}
                          <div className="flex flex-col items-center px-4 relative min-w-[120px]">
                            <div className="h-0.5 w-full bg-gradient-to-r from-indigo-500/50 via-blue-500/50 to-slate-700 relative">
                              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                <div className={cn(
                                  "px-2 py-1 rounded-full border text-[9px] font-bold whitespace-nowrap flex items-center space-x-1 shadow-lg",
                                  getRelColor(rel.type)
                                )}>
                                  {getRelIcon(rel.type)}
                                  <span>{rel.type}</span>
                                </div>
                              </div>
                              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2">
                                <ChevronRight size={14} className="text-slate-600" />
                              </div>
                            </div>
                            <div className="mt-6 text-center">
                              <div className="text-[9px] text-slate-500 font-mono mb-1">{rel.keys}</div>
                              <div className="flex items-center justify-center space-x-1">
                                <span className="text-[8px] text-slate-600">置信度:</span>
                                <span className="text-[9px] text-green-400 font-mono">{(rel.confidence * 100).toFixed(0)}%</span>
                              </div>
                            </div>
                          </div>

                          {/* Target Node */}
                          <div className="w-64 bg-slate-900 border border-slate-700 rounded-2xl shadow-xl overflow-hidden hover:border-blue-500/50 transition-colors">
                            <div className="bg-slate-800/50 p-3 border-b border-slate-800">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-2">
                                  <Layers size={14} className="text-blue-400" />
                                  <div className="text-xs font-bold text-white truncate max-w-[140px]">{rel.target}</div>
                                </div>
                                <div className="text-[9px] px-1.5 py-0.5 rounded bg-slate-950 text-slate-500 font-mono">{targetObj?.type || 'OBJECT'}</div>
                              </div>
                            </div>
                            <div className="p-3 space-y-2">
                              <div className="flex items-center justify-between text-[10px]">
                                <span className="text-slate-500">属性:</span>
                                <span className="text-slate-300">{targetObj?.fieldCount || 0}</span>
                              </div>
                              <div className="flex items-center justify-between text-[10px]">
                                <span className="text-slate-500">关联类型:</span>
                                <span className="text-blue-400">{rel.type === 'Self-Reference' ? '递归' : '引用'}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        {idx < relationships.length - 1 && (
                          <div className="h-8 w-px bg-slate-800 my-2"></div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                    <Network size={48} className="opacity-20 mb-4" />
                    <p className="text-sm">暂无检测到的对象关系</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex justify-between items-center">
              <div className="text-[11px] text-slate-500">
                基于 <span className="text-indigo-400 font-mono">Reasoning LLM</span> 语义关联推断
              </div>
              <div className="flex items-center space-x-3">
                <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors flex items-center space-x-2">
                  <ExternalLink size={14} />
                  <span>导出关系图</span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
