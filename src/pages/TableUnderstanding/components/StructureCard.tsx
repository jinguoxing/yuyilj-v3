import React from 'react';
import { Key, ShieldCheck, AlertTriangle, Link as LinkIcon } from 'lucide-react';
import { Structure } from '../types';

interface StructureCardProps {
  structure: Structure;
}

export default function StructureCard({ structure }: StructureCardProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
      <h3 className="text-sm font-bold text-slate-100 mb-4 flex items-center space-x-2">
        <Key size={16} className="text-slate-400" />
        <span>结构与联接键</span>
      </h3>

      <div className="grid grid-cols-2 gap-6">
        {/* PK */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">主键候选 (Primary Key)</div>
          {structure.pkCandidates.map((pk, i) => (
            <div key={i} className={`p-3 rounded-lg border ${pk.validator === 'PASS' ? 'bg-slate-950 border-green-500/30' : 'bg-slate-950 border-yellow-500/30'}`}>
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-sm text-slate-200">{pk.fields.join(', ')}</span>
                  {pk.validator === 'PASS' ? <ShieldCheck size={14} className="text-green-500" /> : <AlertTriangle size={14} className="text-yellow-500" />}
                </div>
                <span className="text-xs font-mono text-slate-400">{(pk.confidence * 100).toFixed(0)}%</span>
              </div>
              <div className="text-[11px] text-slate-500">{pk.evidence}</div>
              {pk.reason && <div className="text-[11px] text-yellow-500/80 mt-1">{pk.reason}</div>}
            </div>
          ))}
        </div>

        {/* FK */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">外键候选 (Foreign Keys)</div>
          {structure.fkCandidates.map((fk, i) => (
            <div key={i} className="p-3 rounded-lg border border-slate-800 bg-slate-950">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-mono text-sm text-slate-200">{fk.field}</span>
                <LinkIcon size={12} className="text-slate-500" />
                <span className="font-mono text-sm text-indigo-400">{fk.target}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-[11px] text-slate-500">{fk.evidence}</div>
                <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">Score: {fk.matchScore}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
