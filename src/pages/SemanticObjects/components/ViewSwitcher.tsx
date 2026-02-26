import React from 'react';
import { Layout, Table } from 'lucide-react';
import { ViewMode } from '../types';
import { cn } from '@/lib/utils';

interface ViewSwitcherProps {
  activeView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export default function ViewSwitcher({ activeView, onViewChange }: ViewSwitcherProps) {
  return (
    <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800">
      <button
        onClick={() => onViewChange('object')}
        className={cn(
          "px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center space-x-1.5",
          activeView === 'object'
            ? "bg-indigo-600 text-white shadow-sm"
            : "text-slate-400 hover:text-slate-200"
        )}
      >
        <Layout size={14} />
        <span>结构视图</span>
      </button>
      <button
        onClick={() => onViewChange('table')}
        className={cn(
          "px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center space-x-1.5",
          activeView === 'table'
            ? "bg-indigo-600 text-white shadow-sm"
            : "text-slate-400 hover:text-slate-200"
        )}
      >
        <Table size={14} />
        <span>表格视图</span>
      </button>
    </div>
  );
}
