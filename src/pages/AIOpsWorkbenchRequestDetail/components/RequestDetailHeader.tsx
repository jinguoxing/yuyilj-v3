import React from 'react';
import { PanelLeftOpen, PlayCircle, CheckCircle2, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RequestStatus } from '../types';

interface RequestDetailHeaderProps {
  isLeftRailOpen: boolean;
  onOpenLeftRail: () => void;
  requestStatus: RequestStatus;
  onRequestStatusChange: (status: RequestStatus) => void;
}

export default function RequestDetailHeader({
  isLeftRailOpen,
  onOpenLeftRail,
  requestStatus,
  onRequestStatusChange
}: RequestDetailHeaderProps) {
  return (
    <div className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm flex items-center px-6 shrink-0 z-10">
      {!isLeftRailOpen && (
        <button
          onClick={onOpenLeftRail}
          className="p-1.5 mr-4 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <PanelLeftOpen size={20} />
        </button>
      )}
      <div className="flex items-center space-x-4">
        <h1 className="text-lg font-bold text-slate-100 truncate">零售业务域语义建模</h1>
        <span
          className={cn(
            "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 border",
            requestStatus === 'IN_PROGRESS'
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : requestStatus === 'PAUSED'
              ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
              : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
          )}
        >
          {requestStatus === 'IN_PROGRESS' ? '进行中' : requestStatus === 'PAUSED' ? '已暂停' : '已完成'}
        </span>
      </div>

      <div className="ml-auto flex items-center space-x-3">
        {requestStatus === 'IN_PROGRESS' && (
          <button
            onClick={() => onRequestStatusChange('PAUSED')}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg transition-colors border border-slate-700"
          >
            暂停需求
          </button>
        )}
        {requestStatus === 'PAUSED' && (
          <button
            onClick={() => onRequestStatusChange('IN_PROGRESS')}
            className="px-4 py-1.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-500 text-xs font-medium rounded-lg transition-colors border border-amber-500/30 flex items-center"
          >
            <PlayCircle size={14} className="mr-1.5" />
            恢复需求
          </button>
        )}
        {requestStatus !== 'COMPLETED' && (
          <button
            onClick={() => onRequestStatusChange('COMPLETED')}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition-colors"
          >
            完成交付
          </button>
        )}
        {requestStatus === 'COMPLETED' && (
          <div className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-xs font-medium rounded-lg border border-emerald-500/20 flex items-center">
            <CheckCircle2 size={14} className="mr-1.5" />
            已交付
          </div>
        )}
      </div>
    </div>
  );
}
