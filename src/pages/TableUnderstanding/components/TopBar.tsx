import React from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight, AlertCircle, CheckCircle2, Activity,
  RefreshCw, MessageSquare, Eye, UploadCloud
} from 'lucide-react';
import { TableContext } from '../types';

interface TopBarProps {
  context: TableContext;
  onCopilotOpen: () => void;
}

export default function TopBar({ context, onCopilotOpen }: TopBarProps) {
  return (
    <header className="h-14 border-b border-slate-800 bg-slate-900 flex items-center justify-between px-6 shrink-0 z-10">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <Link to="/semantic/workbench" className="hover:text-slate-200">语义治理</Link>
          <ChevronRight size={12} />
          <span>表理解</span>
          <ChevronRight size={12} />
          <span className="text-slate-200 font-medium">{context.tableName}</span>
        </div>
        <div className="h-4 w-px bg-slate-800" />
        <div className="flex items-center space-x-2">
          <span className="text-sm font-bold text-slate-100">{context.tableName}</span>
          <span className="text-[10px] text-slate-500 font-mono">{context.qualifiedName}</span>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
            {context.status}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-1.5 cursor-pointer hover:text-red-400 transition-colors">
            <AlertCircle size={14} className="text-red-500" />
            <span className="text-slate-400">MUST:</span>
            <span className="font-bold text-red-400">{context.gateMetrics.must}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 size={14} className="text-green-500" />
            <span className="text-slate-400">Coverage:</span>
            <span className="font-bold text-green-400">{context.gateMetrics.coverage * 100}%</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Activity size={14} className="text-yellow-500" />
            <span className="text-slate-400">Risk:</span>
            <span className="font-bold text-yellow-500">{context.gateMetrics.risk}</span>
          </div>
        </div>

        <div className="h-4 w-px bg-slate-800" />

        <div className="flex items-center space-x-2">
          <button className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded transition-colors" title="重新分析">
            <RefreshCw size={16} />
          </button>
          <button
            onClick={onCopilotOpen}
            className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded transition-colors"
            title="智能助手"
          >
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
  );
}
