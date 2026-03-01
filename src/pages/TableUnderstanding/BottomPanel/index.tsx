import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BottomTabType } from '../types';
import PreviewTab from './PreviewTab';
import AuditTab from './AuditTab';

interface BottomPanelProps {
  isOpen: boolean;
  activeTab: BottomTabType;
  onTabChange: (tab: BottomTabType) => void;
  onClose: () => void;
}

export default function BottomPanel({ isOpen, activeTab, onTabChange, onClose }: BottomPanelProps) {
  if (!isOpen) return null;

  return (
    <div className="h-64 border-t border-slate-800 bg-slate-900 flex flex-col shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.2)] z-20 relative">
      <div className="h-10 border-b border-slate-800 flex items-center justify-between px-4 bg-slate-900/80 backdrop-blur-sm">
        <div className="flex space-x-4">
          <button
            onClick={() => onTabChange('preview')}
            className={cn(
              "text-xs font-medium px-2 py-1 border-b-2 transition-colors",
              activeTab === 'preview'
                ? "border-indigo-500 text-indigo-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            )}
          >
            变更预览 (Diff)
          </button>
          <button
            onClick={() => onTabChange('audit')}
            className={cn(
              "text-xs font-medium px-2 py-1 border-b-2 transition-colors",
              activeTab === 'audit'
                ? "border-indigo-500 text-indigo-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            )}
          >
            审计与历史
          </button>
        </div>
        <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded">
          <ChevronDown size={16} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'preview' ? <PreviewTab /> : <AuditTab />}
      </div>
    </div>
  );
}
