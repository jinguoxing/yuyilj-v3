import React from 'react';
import { Database, FileText, Bot, Share2, ExternalLink } from 'lucide-react';

export default function RequestDetailContextBar() {
  return (
    <div className="px-6 py-2 border-b border-slate-800 bg-slate-900/40 flex items-center justify-between shrink-0 overflow-x-auto custom-scrollbar">
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1 px-2 py-1 bg-slate-800/50 text-slate-300 rounded text-xs border border-slate-700 whitespace-nowrap">
          <Database size={12} className="text-indigo-400" />
          <span>零售业务域</span>
        </div>
        <div className="flex items-center space-x-1 px-2 py-1 bg-slate-800/50 text-slate-300 rounded text-xs border border-slate-700 whitespace-nowrap">
          <Database size={12} className="text-emerald-400" />
          <span>PostgreSQL 生产库 01</span>
        </div>
        <div className="flex items-center space-x-1 px-2 py-1 bg-slate-800/50 text-slate-300 rounded text-xs border border-slate-700 whitespace-nowrap">
          <FileText size={12} className="text-amber-400" />
          <span>public.orders +3</span>
        </div>

        <div className="h-4 w-px bg-slate-700 mx-2 shrink-0" />

        <div className="flex items-center space-x-1 px-2 py-1 bg-indigo-500/10 text-indigo-300 rounded text-xs border border-indigo-500/20 whitespace-nowrap">
          <Bot size={12} className="mr-1" />
          <span className="font-medium">数据语义理解 (L2)</span>
          <span className="text-[10px] bg-indigo-500/20 px-1 rounded ml-1">v1.2</span>
        </div>

        <div className="flex items-center space-x-2 ml-2">
          <button className="p-1 text-slate-500 hover:text-slate-300">
            <Share2 size={14} />
          </button>
          <span className="text-[10px] text-slate-500">设置默认版本</span>
          <button className="flex items-center space-x-1 text-[10px] text-indigo-400 hover:text-indigo-300">
            <ExternalLink size={12} />
            <span>查看台账</span>
          </button>
        </div>
      </div>
    </div>
  );
}
