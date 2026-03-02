import React from 'react';
import { User, Bot, Activity, CheckCircle2, ChevronRight, AlertTriangle, FileText, Clock, PlayCircle, ShieldCheck, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Message, Stage } from '../types';

interface ConversationPanelProps {
  messages: Message[];
  onApprovePlan: () => void;
  onModifyConfig: () => void;
  onOpenStage: (id: string) => void;
  onIgnoreBlocker: (taskId: string) => void;
  onSetRightTab: (tab: string) => void;
  chatEndRef: React.RefObject<HTMLDivElement>;
}

export default function ConversationPanel({
  messages,
  onApprovePlan,
  onModifyConfig,
  onOpenStage,
  onIgnoreBlocker,
  onSetRightTab,
  chatEndRef
}: ConversationPanelProps) {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-950/50">
      {messages.map((msg) => {
        if (msg.type === 'user') {
          return (
            <div key={msg.id} className="flex space-x-3 max-w-[85%] ml-auto flex-row-reverse space-x-reverse">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-1 bg-slate-700 text-slate-300">
                <User size={18} />
              </div>
              <div className="p-4 rounded-2xl text-sm leading-relaxed shadow-sm bg-indigo-600 text-white rounded-tr-sm">
                {msg.content}
              </div>
            </div>
          );
        }

        return (
          <div key={msg.id} className="flex space-x-3 max-w-[85%]">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-1 bg-indigo-600 text-white shadow-lg shadow-indigo-900/20">
              <Bot size={18} />
            </div>
            <div className="flex-1 space-y-2 min-w-0">
              {msg.type === 'plan' && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-sm p-5 shadow-sm max-w-md">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-bold text-slate-200 flex items-center">
                      <Activity size={16} className="mr-2 text-indigo-400" />
                      执行计划
                    </h4>
                    <div className="flex items-center space-x-1 text-[10px] text-slate-500">
                      <Clock size={12} />
                      <span>预计 15M</span>
                    </div>
                  </div>
                  <div className="space-y-3 mb-4">
                    {msg.stages?.map((stage, idx) => (
                      <div
                        key={stage.id}
                        className="flex items-center space-x-3 group cursor-pointer"
                        onClick={() => onOpenStage(stage.id)}
                      >
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center border text-xs shrink-0 transition-colors",
                            stage.status === 'COMPLETED'
                              ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                              : stage.status === 'IN_PROGRESS'
                              ? "bg-blue-500/20 border-blue-500 text-blue-400"
                              : "bg-slate-800 border-slate-700 text-slate-500 group-hover:border-slate-500"
                          )}
                        >
                          {stage.status === 'COMPLETED' ? <CheckCircle2 size={14} /> : idx + 1}
                        </div>
                        <div className="flex-1 flex items-center justify-between bg-slate-950/50 border border-slate-800/50 rounded-xl px-4 py-3 hover:bg-slate-900 transition-colors">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-slate-300">{stage.name}</span>
                            {idx === 0 && <span className="text-[10px] text-slate-500">扫描所选 4 张表的结构与元数据</span>}
                            {idx === 1 && <span className="text-[10px] text-slate-500">分析字段分布、空值率与唯一性</span>}
                          </div>
                          <ChevronRight size={14} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center space-x-3 pt-3 border-t border-slate-800/50">
                    <button
                      onClick={onApprovePlan}
                      className="flex-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded transition-colors flex items-center justify-center"
                    >
                      <CheckCircle2 size={14} className="mr-1.5" />
                      批准计划
                    </button>
                    <button
                      onClick={onModifyConfig}
                      className="flex-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded transition-colors border border-slate-700 flex items-center justify-center"
                    >
                      <Settings size={14} className="mr-1.5" />
                      修改配置
                    </button>
                  </div>
                </div>
              )}

              {msg.type === 'progress' && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-sm p-4 shadow-sm flex items-start space-x-3">
                  <div
                    className={cn(
                      "p-2 rounded-lg shrink-0",
                      msg.status === 'COMPLETED' ? "bg-emerald-500/10 text-emerald-400" : "bg-blue-500/10 text-blue-400"
                    )}
                  >
                    {msg.status === 'COMPLETED' ? <CheckCircle2 size={16} /> : <Activity size={16} className="animate-pulse" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-xs font-bold text-slate-400">阶段 {msg.stageId}: {msg.stageName}</div>
                      {msg.status === 'COMPLETED' && (
                        <button
                          onClick={() => {
                            if (msg.stageId) onOpenStage(msg.stageId);
                          }}
                          className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center"
                        >
                          查看详情 <ChevronRight size={12} className="ml-0.5" />
                        </button>
                      )}
                    </div>
                    <div className="text-sm text-slate-200">{msg.summary}</div>
                  </div>
                </div>
              )}

              {msg.type === 'blocker' && (
                <div
                  className={cn(
                    "border rounded-2xl rounded-tl-sm p-4 shadow-sm flex items-start space-x-3",
                    msg.blockerType === 'hard' ? "bg-red-500/5 border-red-500/20" : "bg-yellow-500/5 border-yellow-500/20"
                  )}
                >
                  <div
                    className={cn(
                      "p-2 rounded-lg shrink-0",
                      msg.blockerType === 'hard' ? "bg-red-500/10 text-red-400" : "bg-yellow-500/10 text-yellow-500"
                    )}
                  >
                    <AlertTriangle size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div
                        className={cn(
                          "text-xs font-bold",
                          msg.blockerType === 'hard' ? "text-red-400" : "text-yellow-500"
                        )}
                      >
                        {msg.blockerType === 'hard' ? '硬阻塞' : '软任务'}
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">{msg.taskId}</span>
                    </div>
                    <div className="text-sm text-slate-200 mb-3">{msg.summary}</div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          onSetRightTab('actions');
                        }}
                        className={cn(
                          "text-xs px-3 py-1.5 rounded-lg font-medium transition-colors",
                          msg.blockerType === 'hard'
                            ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                            : "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30"
                        )}
                      >
                        去处理 (Resolve)
                      </button>
                      <button
                        onClick={() => onIgnoreBlocker(msg.taskId || '')}
                        className="text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-300 rounded-lg font-medium transition-colors border border-slate-700"
                      >
                        忽略
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {msg.type === 'result' && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-sm p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs font-bold text-slate-400">阶段 {msg.stageId} 结果摘要</div>
                    <button
                      onClick={() => {
                        if (msg.stageId) onOpenStage(msg.stageId);
                      }}
                      className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center"
                    >
                      查看详情 <ChevronRight size={12} className="ml-0.5" />
                    </button>
                  </div>
                  <div className="text-sm text-slate-200">{msg.summary}</div>
                </div>
              )}

              {msg.type === 'deliverable' && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-sm p-4 shadow-sm">
                  <div className="flex items-center space-x-2 mb-3">
                    <FileText size={16} className="text-indigo-400" />
                    <span className="text-sm font-bold text-slate-200">交付物已生成</span>
                  </div>
                  <div className="space-y-2">
                    {msg.deliverables?.map((d, i) => (
                      <div key={i} className="flex items-center justify-between bg-slate-950 border border-slate-800 p-2 rounded-lg">
                        <span className="text-xs text-slate-300">{d.name}</span>
                        <button
                          onClick={() => {
                            onSetRightTab('deliverables');
                          }}
                          className="text-[10px] text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-2 py-1 rounded"
                        >
                          查看
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
      <div ref={chatEndRef} />
    </div>
  );
}
