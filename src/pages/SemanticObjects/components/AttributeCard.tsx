import React from 'react';
import { GripVertical, AlertTriangle, FileText, Database, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UnassignedField } from '../types';

interface AttributeCardProps {
  field: UnassignedField;
  onDragStart?: (e: React.DragEvent, field: UnassignedField) => void;
  onAssign?: (field: UnassignedField) => void;
  onIgnore?: (field: UnassignedField) => void;
  onRestore?: (field: UnassignedField) => void;
  isConflict?: boolean;
  isTechnical?: boolean;
  isIgnored?: boolean;
}

export default function AttributeCard({
  field,
  onDragStart,
  onAssign,
  onIgnore,
  onRestore,
  isConflict = false,
  isTechnical = false,
  isIgnored = false
}: AttributeCardProps) {
  return (
    <div
      draggable={!!onDragStart}
      onDragStart={(e) => onDragStart?.(e, field)}
      className={cn(
        "group flex items-center justify-between p-2 bg-slate-950 border rounded-lg cursor-grab active:cursor-grabbing transition-all",
        isConflict ? "border-red-500/30 bg-red-500/5" :
        isTechnical ? "border-slate-800/50" :
        isIgnored ? "border-slate-800/30 opacity-50" :
        "border-slate-800 hover:border-indigo-500/30"
      )}
    >
      <div className="flex items-center space-x-2 flex-1 min-w-0">
        <GripVertical size={12} className="text-slate-600 shrink-0" />
        {isConflict && <AlertTriangle size={12} className="text-red-500 shrink-0" />}
        {isTechnical && <Database size={12} className="text-slate-600 shrink-0" />}
        {!isConflict && !isTechnical && <FileText size={12} className="text-slate-500 shrink-0" />}
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-slate-300 truncate">{field.name}</div>
          <div className="text-[10px] text-slate-500 truncate">{field.dataType}</div>
        </div>
      </div>
      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {!isIgnored && !isTechnical && onIgnore && (
          <button
            onClick={() => onIgnore(field)}
            className="p-1 hover:bg-slate-800 rounded text-slate-500 hover:text-amber-400"
            title="忽略"
          >
            <span className="text-xs">忽略</span>
          </button>
        )}
        {isIgnored && onRestore && (
          <button
            onClick={() => onRestore(field)}
            className="p-1 hover:bg-slate-800 rounded text-slate-500 hover:text-green-400"
            title="恢复"
          >
            <span className="text-xs">恢复</span>
          </button>
        )}
        {!isTechnical && onAssign && (
          <button
            onClick={() => onAssign(field)}
            className="p-1 hover:bg-slate-800 rounded text-slate-500 hover:text-indigo-400"
            title="快速分配"
          >
            <span className="text-xs">+分配</span>
          </button>
        )}
      </div>
    </div>
  );
}
