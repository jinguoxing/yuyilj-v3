import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Issues } from '../types';

interface IssuesCardProps {
  issues: Issues;
}

export default function IssuesCard({ issues }: IssuesCardProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
          <AlertCircle size={16} className="text-slate-400" />
          <span>阻塞项与建议</span>
        </h3>
        <button className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded border border-slate-700 transition-colors">
          批量修复
        </button>
      </div>
      <div className="space-y-3">
        {issues.must.map(issue => (
          <div key={issue.id} className="flex items-center justify-between p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
            <div className="flex items-center space-x-3">
              <span className="px-1.5 py-0.5 bg-red-500/20 text-red-400 text-[9px] font-bold uppercase rounded border border-red-500/30">MUST</span>
              <span className="text-sm text-slate-200">{issue.title}</span>
            </div>
            <button className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">{issue.action} &rarr;</button>
          </div>
        ))}
        {issues.review.map(issue => (
          <div key={issue.id} className="flex items-center justify-between p-3 bg-orange-500/5 border border-orange-500/20 rounded-lg">
            <div className="flex items-center space-x-3">
              <span className="px-1.5 py-0.5 bg-orange-500/20 text-orange-400 text-[9px] font-bold uppercase rounded border border-orange-500/30">REVIEW</span>
              <span className="text-sm text-slate-200">{issue.title}</span>
            </div>
            <button className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">{issue.action} &rarr;</button>
          </div>
        ))}
      </div>
    </div>
  );
}
