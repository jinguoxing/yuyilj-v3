import React from 'react';
import { Eye, Save, History } from 'lucide-react';
import { TableStrategy, RISK_TAGS } from '../constants';
import { Structure, Summary } from '../types';

interface ConfirmationPanelProps {
  summary: Summary;
  structure: Structure;
  tags: string[];
  onOpenBottomPanel: () => void;
  onConfirm: () => void;
  isSaving: boolean;
}

export default function ConfirmationPanel({
  summary,
  structure,
  tags,
  onOpenBottomPanel,
  onConfirm,
  isSaving
}: ConfirmationPanelProps) {
  return (
    <div className="w-[400px] border-l border-slate-800 bg-slate-900/50 flex flex-col shrink-0">
      <div className="h-14 border-b border-slate-800 flex items-center px-6 bg-slate-900 shrink-0">
        <h2 className="text-sm font-bold text-slate-100">确认表策略 (Table Strategy)</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* 1. Table Type */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>1. 表类型确认</span>
            <span className="text-[10px] text-indigo-400 font-normal">AI 推荐: {summary.tableType.top1}</span>
          </label>
          <select className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500">
            <option value="DIMENSION">维度表 (DIMENSION)</option>
            <option value="FACT">事实表 (FACT)</option>
            <option value="MASTER">主数据 (MASTER)</option>
          </select>
        </div>

        {/* 2. Grain */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">2. 粒度确认 (Grain)</label>
          <textarea
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 resize-none h-20"
            defaultValue={summary.grain}
          />
        </div>

        {/* 3. PK / FK */}
        <div className="space-y-4">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">3. 主键/外键确认</label>

          <div className="space-y-2">
            <div className="text-[11px] text-slate-500">主键 (Primary Key)</div>
            <select className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-slate-200 focus:outline-none focus:border-indigo-500">
              {structure.pkCandidates.map(pk => (
                <option key={pk.fields.join(',')} value={pk.fields.join(',')}>{pk.fields.join(', ')}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <div className="text-[11px] text-slate-500">外键 (Foreign Keys)</div>
            <div className="space-y-2">
              {structure.fkCandidates.map(fk => (
                <label key={fk.field} className="flex items-center space-x-2 p-2 bg-slate-950 border border-slate-800 rounded-lg cursor-pointer hover:border-slate-700">
                  <input type="checkbox" defaultChecked className="rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500/50" />
                  <div className="flex-1 flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-300">{fk.field}</span>
                    <span className="text-slate-500">&rarr;</span>
                    <span className="font-mono text-indigo-400">{fk.target}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Risk & Compliance */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">4. 风险与合规</label>
          <div className="flex flex-wrap gap-2">
            {RISK_TAGS.map(tag => (
              <label key={tag} className="flex items-center space-x-1.5 text-xs text-slate-300 cursor-pointer">
                <input type="checkbox" defaultChecked={tags.includes(tag)} className="rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500/50" />
                <span>{tag}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Action Area */}
      <div className="p-6 border-t border-slate-800 bg-slate-900 space-y-3 shrink-0">
        <button
          onClick={onOpenBottomPanel}
          className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-700 flex items-center justify-center space-x-2 mb-2"
        >
          <Eye size={16} />
          <span>查看变更预览</span>
        </button>
        <button
          onClick={onConfirm}
          disabled={isSaving}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-indigo-900/20 flex items-center justify-center space-x-2"
        >
          <Save size={16} />
          <span>{isSaving ? '保存中...' : '保存并确认策略'}</span>
        </button>
        <div className="flex space-x-2">
          <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-lg text-xs font-medium transition-colors border border-slate-700">
            保存草稿
          </button>
          <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-lg text-xs font-medium transition-colors border border-slate-700 flex items-center justify-center space-x-1">
            <History size={14} />
            <span>恢复AI建议</span>
          </button>
        </div>
      </div>
    </div>
  );
}
