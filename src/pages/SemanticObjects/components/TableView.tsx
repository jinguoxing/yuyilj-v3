import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, Settings, ExternalLink, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BusinessObject, ViewMode } from '../types';

interface TableViewProps {
  objects: BusinessObject[];
  data: any;
  activeView: ViewMode;
  setActiveView: (view: ViewMode) => void;
}

export default function TableView({ objects, data, activeView, setActiveView }: TableViewProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const getStatusBadge = (obj: BusinessObject) => {
    const hasIssues = obj.attributes.some(a => a.status === 'SUGGESTED');
    if (hasIssues) {
      return (
        <span className="flex items-center space-x-1 text-xs text-amber-400">
          <AlertTriangle size={12} />
          <span>待确认</span>
        </span>
      );
    }
    return (
      <span className="flex items-center space-x-1 text-xs text-green-400">
        <CheckCircle2 size={12} />
        <span>已确认</span>
      </span>
    );
  };

  return (
    <div className="flex-1 bg-slate-950 overflow-auto">
      <div className="max-w-6xl mx-auto p-8">
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-900/50 border-b border-slate-800 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <div className="col-span-3">对象名称</div>
            <div className="col-span-2">类型</div>
            <div className="col-span-2">属性数量</div>
            <div className="col-span-2">状态</div>
            <div className="col-span-2">置信度</div>
            <div className="col-span-1">操作</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-slate-800">
            {objects.map((obj) => (
              <React.Fragment key={obj.id}>
                <div className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-slate-900/30 transition-colors">
                  <div className="col-span-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-slate-200">{obj.name}</span>
                      {obj.description && (
                        <span className="text-[10px] text-slate-500 truncate max-w-[150px]">{obj.description}</span>
                      )}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <span className={cn(
                      "text-xs px-2 py-1 rounded font-mono",
                      obj.type === 'PRIMARY' ? "bg-indigo-500/20 text-indigo-400" :
                      obj.type === 'REFERENCE' ? "bg-blue-500/20 text-blue-400" :
                      "bg-slate-800 text-slate-400"
                    )}>
                      {obj.type}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-sm text-slate-300">{obj.fieldCount}</span>
                  </div>
                  <div className="col-span-2">
                    {getStatusBadge(obj)}
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: '85%' }} />
                      </div>
                      <span className="text-xs text-slate-500">85%</span>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <button
                      onClick={() => toggleRow(obj.id)}
                      className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      <Settings size={14} />
                    </button>
                  </div>
                </div>

                {/* Expanded Row Details */}
                {expandedRows.has(obj.id) && (
                  <div className="px-6 py-4 bg-slate-900/20 border-t border-slate-800">
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <h4 className="text-xs font-semibold text-slate-500 mb-2">标识符</h4>
                        <div className="space-y-1">
                          {obj.attributes.filter(a => a.type === 'IDENTIFIER').slice(0, 3).map(attr => (
                            <div key={attr.id} className="text-xs text-slate-300 flex items-center space-x-2">
                              <span className="font-mono text-indigo-400">{attr.mappedField}</span>
                              <span className="text-slate-500">→</span>
                              <span>{attr.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-slate-500 mb-2">属性</h4>
                        <div className="space-y-1">
                          {obj.attributes.filter(a => a.type === 'ATTRIBUTE').slice(0, 3).map(attr => (
                            <div key={attr.id} className="text-xs text-slate-300 flex items-center space-x-2">
                              <span className="font-mono text-indigo-400">{attr.mappedField}</span>
                              <span className="text-slate-500">→</span>
                              <span>{attr.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-slate-500 mb-2">度量</h4>
                        <div className="space-y-1">
                          {obj.attributes.filter(a => a.type === 'MEASURE').slice(0, 3).map(attr => (
                            <div key={attr.id} className="text-xs text-slate-300 flex items-center space-x-2">
                              <span className="font-mono text-indigo-400">{attr.mappedField}</span>
                              <span className="text-slate-500">→</span>
                              <span>{attr.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-800 flex justify-end">
                      <button className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center space-x-1">
                        <ExternalLink size={12} />
                        <span>查看详情</span>
                      </button>
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
