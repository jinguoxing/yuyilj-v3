import React from 'react';
import { Box, Network, Table } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BusinessObject } from '../../types';

interface ObjectCardProps {
  obj: BusinessObject;
  isSelected: boolean;
  hasRelationships: boolean;
  onSelect: () => void;
}

export default function ObjectCard({ obj, isSelected, hasRelationships, onSelect }: ObjectCardProps) {
  return (
    <div
      onClick={onSelect}
      className={cn(
        "p-3 rounded-xl border cursor-pointer transition-all group relative",
        isSelected
          ? "bg-indigo-900/20 border-indigo-500/50 shadow-sm"
          : "bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50"
      )}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center space-x-2 truncate">
          <Box size={14} className={cn(
            "shrink-0",
            obj.type === 'PRIMARY' ? "text-indigo-400" :
            obj.type === 'REFERENCE' ? "text-blue-400" :
            obj.type === 'LOG' ? "text-amber-400" : "text-slate-500"
          )} />
          <span className={cn(
            "text-sm font-semibold truncate",
            isSelected ? "text-indigo-200" : "text-slate-300"
          )}>{obj.name}</span>
          {obj.type === 'PRIMARY' && (
            <span className="text-[8px] bg-indigo-500/20 text-indigo-400 px-1 rounded border border-indigo-500/30">PRIMARY</span>
          )}
          {obj.type === 'REFERENCE' && (
            <span className="text-[8px] bg-blue-500/20 text-blue-400 px-1 rounded border border-blue-500/30">REF</span>
          )}
        </div>
        {hasRelationships && (
          <Network size={12} className="text-indigo-500/60 group-hover:text-indigo-400 transition-colors" />
        )}
      </div>
      <div className="flex items-center justify-between mt-2">
        <div className="text-[10px] text-slate-500 flex items-center space-x-1">
          <Table size={10} />
          <span className="truncate max-w-[100px]">{obj.description?.split(' ').pop()}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-[10px] text-slate-500">{obj.fieldCount} 属性</span>
          <div className="w-8 h-1 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500" style={{ width: obj.type === 'PRIMARY' ? '92%' : '75%' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
