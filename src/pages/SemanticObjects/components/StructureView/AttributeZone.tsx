import React from 'react';
import { GripVertical, ChevronDown, MoreHorizontal, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Attribute, AttributeType } from '../../types';

interface AttributeZoneProps {
  title: string;
  icon: React.ReactNode;
  attributes: Attribute[];
  type: AttributeType;
  onDragStart: (e: React.DragEvent, attr: Attribute) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onUnassign: (attr: Attribute) => void;
  onConfig: (attr: Attribute) => void;
  dragOverClass?: string;
  highlightBorder?: boolean;
}

export default function AttributeZone({
  title,
  icon,
  attributes,
  type,
  onDragStart,
  onDragOver,
  onDrop,
  onUnassign,
  onConfig,
  dragOverClass,
  highlightBorder
}: AttributeZoneProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-slate-400">
          {icon}
          <span className="text-xs font-semibold uppercase tracking-wider">{title}</span>
          <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-500">
            {attributes.length}
          </span>
        </div>
        <button className="text-slate-600 hover:text-slate-400">
          <MoreHorizontal size={14} />
        </button>
      </div>

      <div
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={cn(
          "min-h-[80px] p-3 rounded-xl border-2 border-dashed transition-all",
          highlightBorder
            ? "border-indigo-500/50 bg-indigo-500/5"
            : "border-slate-800/50 bg-slate-900/30",
          dragOverClass
        )}
      >
        {attributes.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-xs text-slate-600">拖放字段到此处</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {attributes.map((attr: Attribute) => (
              <div
                key={attr.id}
                draggable
                onDragStart={(e) => onDragStart(e, attr)}
                className="group flex items-center justify-between p-2 bg-slate-950 border border-slate-800 rounded-lg hover:border-indigo-500/30 cursor-grab active:cursor-grabbing transition-all"
              >
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <GripVertical size={12} className="text-slate-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-slate-200 truncate">{attr.name}</div>
                    <div className="text-[10px] text-slate-500 truncate font-mono">{attr.mappedField}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {attr.status === 'SUGGESTED' && (
                    <button
                      onClick={() => onUnassign(attr)}
                      className="p-1 hover:bg-slate-800 rounded text-slate-500 hover:text-red-400"
                    >
                      <X size={12} />
                    </button>
                  )}
                  <button
                    onClick={() => onConfig(attr)}
                    className="p-1 hover:bg-slate-800 rounded text-slate-500 hover:text-indigo-400"
                  >
                    <MoreHorizontal size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
