import React from 'react';
import { GripVertical, AlertTriangle, FileText, Database } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UnassignedField } from '../../types';

interface UnassignedPoolProps {
  fields: UnassignedField[];
  onDragStart: (e: React.DragEvent, field: UnassignedField) => void;
  onAssign: (field: UnassignedField) => void;
  onIgnore: (field: UnassignedField) => void;
  onRestore: (field: UnassignedField) => void;
  isDraggingToPool: boolean;
}

export default function UnassignedPool({
  fields,
  onDragStart,
  onAssign,
  onIgnore,
  onRestore,
  isDraggingToPool
}: UnassignedPoolProps) {
  const unassignedFields = fields.filter(f => f.group === 'UNASSIGNED');
  const ignoredFields = fields.filter(f => f.group === 'IGNORED');
  const conflictFields = fields.filter(f => f.group === 'CONFLICT');
  const technicalFields = fields.filter(f => f.group === 'TECHNICAL');

  const FieldCard = ({ field, isConflict = false, isTechnical = false, isIgnored = false }: any) => (
    <div
      key={field.id}
      draggable
      onDragStart={(e) => onDragStart(e, field)}
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
        {!isIgnored && !isTechnical && (
          <button
            onClick={() => onIgnore(field)}
            className="p-1 hover:bg-slate-800 rounded text-slate-500 hover:text-amber-400"
            title="忽略"
          >
            <span className="text-xs">忽略</span>
          </button>
        )}
        {isIgnored && (
          <button
            onClick={() => onRestore(field)}
            className="p-1 hover:bg-slate-800 rounded text-slate-500 hover:text-green-400"
            title="恢复"
          >
            <span className="text-xs">恢复</span>
          </button>
        )}
        {!isTechnical && (
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

  return (
    <div className="w-80 border-l border-slate-800 bg-slate-900/30 flex flex-col shrink-0">
      <div className="p-4 border-b border-slate-800 bg-slate-900/50">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
          未分配字段池
        </h3>
        <p className="text-[10px] text-slate-600">拖拽字段到左侧对象区域进行分配</p>
      </div>

      <div
        className={cn(
          "flex-1 overflow-y-auto p-3 transition-colors",
          isDraggingToPool && "bg-amber-500/5"
        )}
      >
        {/* Unassigned */}
        {unassignedFields.length > 0 && (
          <div className="mb-4">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>待分配 ({unassignedFields.length})</span>
            </div>
            <div className="space-y-1.5">
              {unassignedFields.map(field => (
                <FieldCard key={field.id} field={field} />
              ))}
            </div>
          </div>
        )}

        {/* Conflicts */}
        {conflictFields.length > 0 && (
          <div className="mb-4">
            <div className="text-[10px] text-red-500 uppercase tracking-wider mb-2 flex items-center space-x-1">
              <AlertTriangle size={10} />
              <span>冲突 ({conflictFields.length})</span>
            </div>
            <div className="space-y-1.5">
              {conflictFields.map(field => (
                <FieldCard key={field.id} field={field} isConflict />
              ))}
            </div>
          </div>
        )}

        {/* Technical */}
        {technicalFields.length > 0 && (
          <div className="mb-4">
            <div className="text-[10px] text-slate-600 uppercase tracking-wider mb-2">
              技术字段 ({technicalFields.length})
            </div>
            <div className="space-y-1.5">
              {technicalFields.map(field => (
                <FieldCard key={field.id} field={field} isTechnical />
              ))}
            </div>
          </div>
        )}

        {/* Ignored */}
        {ignoredFields.length > 0 && (
          <div className="mb-4">
            <div className="text-[10px] text-slate-600 uppercase tracking-wider mb-2">
              已忽略 ({ignoredFields.length})
            </div>
            <div className="space-y-1.5">
              {ignoredFields.map(field => (
                <FieldCard key={field.id} field={field} isIgnored />
              ))}
            </div>
          </div>
        )}

        {fields.length === 0 && (
          <div className="text-center py-8">
            <p className="text-xs text-slate-600">所有字段已分配</p>
          </div>
        )}
      </div>
    </div>
  );
}
