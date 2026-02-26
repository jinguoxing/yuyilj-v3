import React from 'react';
import { Activity } from 'lucide-react';
import { Usage } from '../types';

interface UsageCardProps {
  usage: Usage;
}

export default function UsageCard({ usage }: UsageCardProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
      <h3 className="text-sm font-bold text-slate-100 mb-4 flex items-center space-x-2">
        <Activity size={16} className="text-slate-400" />
        <span>使用与影响</span>
      </h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-slate-200">{usage.downstreams}</div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">下游引用</div>
        </div>
        <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-red-400">{usage.sensitiveFields}</div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">敏感字段 (PII)</div>
        </div>
      </div>
      <div className="space-y-3">
        <div>
          <div className="text-xs text-slate-500 mb-1">常见用法</div>
          <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
            {usage.usageSummary.map((u, i) => <li key={i}>{u}</li>)}
          </ul>
        </div>
        <div className="text-[11px] text-slate-400 bg-slate-800/50 p-2 rounded">
          {usage.explain}
        </div>
      </div>
    </div>
  );
}
