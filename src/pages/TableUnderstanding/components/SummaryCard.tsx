import React from 'react';
import { Settings, Sparkles, Edit2 } from 'lucide-react';
import { Summary } from '../types';
import { EditingState } from '../types';

interface SummaryCardProps {
  summary: Summary;
  editingState: EditingState;
  onToggleEditName: () => void;
  onTableNameChange: (value: string) => void;
  onToggleEditGrain: () => void;
  onGrainChange: (value: string) => void;
  onToggleEditDesc: () => void;
  onDescriptionChange: (value: string) => void;
}

export default function SummaryCard({
  summary,
  editingState,
  onToggleEditName,
  onTableNameChange,
  onToggleEditGrain,
  onGrainChange,
  onToggleEditDesc,
  onDescriptionChange
}: SummaryCardProps) {
  const {
    isEditingName,
    tableName,
    isEditingGrain,
    grain,
    isEditingDesc,
    description
  } = editingState;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
            {isEditingName ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={tableName}
                  onChange={(e) => onTableNameChange(e.target.value)}
                  className="bg-slate-950 border border-indigo-500 rounded px-2 py-1 text-sm text-slate-200 focus:outline-none w-48"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') onToggleEditName();
                    if (e.key === 'Escape') onToggleEditName();
                  }}
                  onBlur={onToggleEditName}
                />
              </div>
            ) : (
              <>
                <span>{tableName}</span>
                <button
                  onClick={onToggleEditName}
                  className="text-slate-500 hover:text-indigo-400 transition-colors"
                  title="编辑表名"
                >
                  <Settings size={14} />
                </button>
              </>
            )}
          </h2>
          <div className="flex items-center space-x-2 mt-2">
            <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded text-xs font-bold tracking-wider">
              {summary.tableType.top1}
            </span>
            <span className="text-xs text-slate-500">置信度 {(summary.tableType.confidence * 100).toFixed(0)}%</span>
          </div>
        </div>
        <div className="flex gap-2">
          {summary.tags.map(t => (
            <span key={t} className="px-2 py-1 bg-slate-800 text-slate-300 rounded-md text-[10px] uppercase tracking-wider border border-slate-700">
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="group">
          <div className="flex items-center justify-between mb-1">
            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">粒度 (Grain)</div>
            {!isEditingGrain && (
              <button
                onClick={onToggleEditGrain}
                className="text-slate-500 hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Edit2 size={12} />
              </button>
            )}
          </div>
          {isEditingGrain ? (
            <div className="flex items-start space-x-2">
              <textarea
                value={grain}
                onChange={(e) => onGrainChange(e.target.value)}
                className="flex-1 bg-slate-950 border border-indigo-500 rounded p-2 text-sm text-slate-200 focus:outline-none resize-none h-16"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    onToggleEditGrain();
                  }
                  if (e.key === 'Escape') onToggleEditGrain();
                }}
                onBlur={onToggleEditGrain}
              />
            </div>
          ) : (
            <div
              className="text-sm text-slate-200 bg-slate-950 p-2 rounded border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors"
              onClick={onToggleEditGrain}
            >
              {grain}
            </div>
          )}
        </div>

        <div className="group">
          <div className="flex items-center justify-between mb-1">
            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">业务描述</div>
            {!isEditingDesc && (
              <button
                onClick={onToggleEditDesc}
                className="text-slate-500 hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Edit2 size={12} />
              </button>
            )}
          </div>
          {isEditingDesc ? (
            <div className="flex items-start space-x-2">
              <textarea
                value={description}
                onChange={(e) => onDescriptionChange(e.target.value)}
                className="flex-1 bg-slate-950 border border-indigo-500 rounded p-2 text-sm text-slate-200 focus:outline-none resize-none h-20"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    onToggleEditDesc();
                  }
                  if (e.key === 'Escape') onToggleEditDesc();
                }}
                onBlur={onToggleEditDesc}
              />
            </div>
          ) : (
            <div
              className="text-sm text-slate-300 leading-relaxed cursor-pointer hover:text-slate-200 transition-colors"
              onClick={onToggleEditDesc}
            >
              {description}
            </div>
          )}
        </div>

        <div className="bg-indigo-950/30 border border-indigo-500/20 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <Sparkles size={14} className="text-indigo-400" />
            <span className="text-xs font-bold text-indigo-300">AI 推理过程</span>
          </div>
          <p className="text-xs text-indigo-200/70 leading-relaxed">{summary.explain}</p>
        </div>
      </div>
    </div>
  );
}
