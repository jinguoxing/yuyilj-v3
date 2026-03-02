import React from 'react';
import { Zap, Database, Bot, FileText, Settings, Send, Pause, CheckCircle2, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RequestStatus } from '../types';

interface ComposerProps {
  input: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onRequestStatusChange: (status: RequestStatus) => void;
  requestStatus: RequestStatus;
}

const QUICK_ACTIONS = [
  { label: '一键运行全流程 (L2)', icon: Zap },
  { label: '只跑扫描', icon: Database },
  { label: '只跑语义理解', icon: Bot },
  { label: '生成候选对象', icon: FileText },
  { label: '生成质量规则草案', icon: Settings },
];

export default function Composer({
  input,
  onInputChange,
  onSendMessage,
  onRequestStatusChange,
  requestStatus
}: ComposerProps) {
  return (
    <div className="p-6 border-t border-slate-800 bg-slate-900 shrink-0">
      <div className="max-w-5xl mx-auto flex flex-col space-y-4">
        {/* Quick Actions Chips */}
        <div className="flex items-center space-x-2 overflow-x-auto custom-scrollbar pb-1 no-scrollbar">
          {QUICK_ACTIONS.map((action, idx) => (
            <button
              key={idx}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-[11px] rounded-lg whitespace-nowrap transition-colors border border-slate-700/50"
            >
              <action.icon size={12} />
              <span>{action.label}</span>
            </button>
          ))}
        </div>

        <div className="relative flex flex-col bg-slate-950 border-2 border-slate-800 rounded-2xl overflow-hidden focus-within:border-indigo-500/50 transition-colors shadow-2xl">
          {requestStatus === 'COMPLETED' ? (
            <div className="flex flex-col items-center justify-center py-8 text-slate-500">
              <CheckCircle2 size={24} className="mb-2 text-emerald-500/50" />
              <p className="text-sm">需求已交付，当前会话已结束</p>
            </div>
          ) : requestStatus === 'PAUSED' ? (
            <div className="flex flex-col items-center justify-center py-8 text-slate-500">
              <Pause size={24} className="mb-2 text-amber-500/50" />
              <p className="text-sm">需求已暂停，点击右上角「恢复需求」继续</p>
            </div>
          ) : (
            <>
              <textarea
                value={input}
                onChange={(e) => onInputChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    onSendMessage();
                  }
                }}
                placeholder="输入指令或提问，例如：'生成成本阶段报告'..."
                className="w-full bg-transparent border-none resize-none px-6 py-5 text-sm text-slate-200 focus:outline-none min-h-[100px] max-h-40 custom-scrollbar"
              />

              <div className="flex items-center justify-between px-4 pb-4">
                <div className="flex items-center space-x-3">
                  <button className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-slate-300 transition-colors">
                    <Info size={14} className="text-indigo-400" />
                    <span className="text-xs">上下文</span>
                  </button>
                  <div className="flex items-center space-x-4 text-[10px] text-slate-500">
                    <span className="flex items-center">
                      <kbd className="bg-slate-800 px-1 rounded mr-1">Enter</kbd> 发送
                    </span>
                    <span className="flex items-center">
                      <kbd className="bg-slate-800 px-1 rounded mr-1">Shift + Enter</kbd> 换行
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => onRequestStatusChange('PAUSED')}
                    className="flex items-center space-x-2 px-4 py-2 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 rounded-lg border border-amber-500/30 transition-colors"
                  >
                    <Pause size={14} />
                    <span className="text-xs font-bold">暂停执行</span>
                  </button>

                  <button
                    onClick={onSendMessage}
                    disabled={!input.trim()}
                    className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl transition-all shadow-lg shadow-indigo-500/20"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
