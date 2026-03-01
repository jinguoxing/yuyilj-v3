import React from 'react';
import { BarChart3 } from 'lucide-react';
import { Composition } from '../types';

interface CompositionCardProps {
  composition: Composition;
}

export default function CompositionCard({ composition }: CompositionCardProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
      <h3 className="text-sm font-bold text-slate-100 mb-4 flex items-center space-x-2">
        <BarChart3 size={16} className="text-slate-400" />
        <span>字段分布与角色</span>
      </h3>
      <div className="space-y-4">
        <div>
          <div className="text-xs text-slate-500 mb-2">语义类型分布</div>
          <div className="flex flex-wrap gap-2">
            {composition.semanticTypes.map(st => (
              <div key={st.type} className="flex items-center space-x-1 text-xs bg-slate-950 border border-slate-800 px-2 py-1 rounded">
                <span className="text-slate-300">{st.type}</span>
                <span className="text-slate-500 font-mono">{st.count}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-500 mb-2">关键字段 (Key Fields)</div>
          <div className="flex flex-wrap gap-1">
            {composition.keyFields.map(kf => (
              <span key={kf} className="text-[11px] font-mono text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
                {kf}
              </span>
            ))}
          </div>
        </div>
        {composition.anomalies.length > 0 && (
          <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
            <div className="text-xs font-bold text-orange-400 mb-1">异常/缺失证据</div>
            <ul className="list-disc list-inside text-[11px] text-orange-300/80 space-y-1">
              {composition.anomalies.map((a, i) => <li key={i}>{a}</li>)}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
