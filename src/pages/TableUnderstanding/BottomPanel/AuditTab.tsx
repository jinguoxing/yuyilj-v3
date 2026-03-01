import React from 'react';
import { GitCommit, History } from 'lucide-react';

export default function AuditTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-start space-x-3">
        <div className="mt-1 bg-slate-800 p-1.5 rounded-full text-slate-400">
          <GitCommit size={14} />
        </div>
        <div>
          <div className="text-sm font-medium text-slate-200">系统自动生成策略 (AI 推断)</div>
          <div className="text-xs text-slate-500 mt-0.5">2023-10-25 14:30:00 • 关联 Run ID: run_98765</div>
        </div>
      </div>
      <div className="flex items-start space-x-3 opacity-50">
        <div className="mt-1 bg-slate-800 p-1.5 rounded-full text-slate-400">
          <History size={14} />
        </div>
        <div>
          <div className="text-sm font-medium text-slate-200">初始状态</div>
          <div className="text-xs text-slate-500 mt-0.5">2023-10-25 10:00:00</div>
        </div>
      </div>
    </div>
  );
}
