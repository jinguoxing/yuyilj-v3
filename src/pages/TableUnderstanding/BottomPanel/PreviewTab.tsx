import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function PreviewTab() {
  return (
    <div className="flex space-x-6 h-full">
      <div className="flex-1 space-y-4">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">本次将修改的内容</h4>
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-2 font-mono text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-slate-500 w-24">TableType:</span>
            <span className="text-red-400 line-through">UNKNOWN</span>
            <ArrowRight size={12} className="text-slate-600" />
            <span className="text-green-400">DIMENSION</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-slate-500 w-24">PrimaryKey:</span>
            <span className="text-red-400 line-through">None</span>
            <ArrowRight size={12} className="text-slate-600" />
            <span className="text-green-400">employee_id</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-slate-500 w-24">Grain:</span>
            <span className="text-green-400">+ 每个员工（Employee）一行</span>
          </div>
        </div>
      </div>
      <div className="w-64 space-y-4">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">预估影响</h4>
        <div className="space-y-2">
          <div className="bg-slate-800/50 p-2 rounded border border-slate-700 flex justify-between items-center">
            <span className="text-xs text-slate-400">MUST 阻塞项</span>
            <span className="text-xs font-bold text-green-400">-2</span>
          </div>
          <div className="bg-slate-800/50 p-2 rounded border border-slate-700 flex justify-between items-center">
            <span className="text-xs text-slate-400">覆盖率 (Coverage)</span>
            <span className="text-xs font-bold text-green-400">+15%</span>
          </div>
          <div className="bg-slate-800/50 p-2 rounded border border-slate-700 flex justify-between items-center">
            <span className="text-xs text-slate-400">风险等级 (Risk)</span>
            <span className="text-xs font-bold text-yellow-500">HIGH &rarr; MED</span>
          </div>
        </div>
      </div>
    </div>
  );
}
