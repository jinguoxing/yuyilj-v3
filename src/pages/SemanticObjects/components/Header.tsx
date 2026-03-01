import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BrainCircuit, Network, RefreshCw, Share2 } from 'lucide-react';
import { SemanticData } from '../types';

interface HeaderProps {
  data: SemanticData | null;
  onRefresh?: () => void;
  onPublish?: () => void;
  onOpenRelationship?: () => void;
}

export default function Header({ data, onRefresh, onPublish, onOpenRelationship }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="h-14 border-b border-slate-800 bg-slate-900 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center space-x-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
          <ArrowLeft size={18} />
        </button>
        <div className="h-6 w-px bg-slate-800 mx-2" />
        <h1 className="text-sm font-semibold flex items-center space-x-2">
          <span>对象候选生成</span>
          <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-500/30 font-mono">
            Reasoning LLM
          </span>
        </h1>
        {data && (
          <>
            <div className="h-6 w-px bg-slate-800 mx-2" />
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold text-slate-100">{data.tableName}</span>
              <span className="text-[10px] text-slate-500 font-mono">{data.qualifiedName}</span>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-[10px] font-bold uppercase">
                {data.objects.length} Objects
              </span>
              <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded text-[10px] font-bold">
                {(data.confidence * 100).toFixed(0)}% Conf
              </span>
            </div>
          </>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={onOpenRelationship}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors border border-slate-700 flex items-center space-x-1.5"
        >
          <Network size={14} />
          <span>关系图</span>
        </button>
        <button
          onClick={onRefresh}
          className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors"
          title="重新生成对象"
        >
          <RefreshCw size={16} />
        </button>
        <button
          onClick={onPublish}
          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5 shadow-lg shadow-indigo-900/20"
        >
          <Share2 size={14} />
          <span>发布资产</span>
        </button>
      </div>
    </header>
  );
}
