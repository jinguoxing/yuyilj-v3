import React from 'react';
import { Box, Split, Merge, MoreHorizontal, Key, Layers, BarChart3, BrainCircuit, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { SemanticData, BusinessObject, Attribute, AttributeType } from '../../types';
import { DraggedField } from '../../hooks/useDragDrop';
import ObjectList from './ObjectList';
import AttributeZone from './AttributeZone';
import UnassignedPool from './UnassignedPool';

interface StructureViewProps {
  data: SemanticData | null;
  objects: BusinessObject[];
  unassignedFields: any[];
  selectedObject: BusinessObject | null;
  draggedField: DraggedField | null;
  dragOverGroup: string | null;
  isDraggingToPool: boolean;
  onSelectObject: (obj: BusinessObject) => void;
  onDragStart: (e: React.DragEvent, field: any, source: 'POOL' | 'STRUCTURE') => void;
  onDragOver: (e: React.DragEvent, groupType: string) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, groupType: string) => void;
  onPoolDragOver: (e: React.DragEvent) => void;
  onPoolDrop: (e: React.DragEvent) => void;
  onAssignField: (field: any, targetType: string) => void;
  onUnassignField: (attr: Attribute) => void;
  onIgnoreField: (field: any) => void;
  onRestoreField: (field: any) => void;
  onConfigAttribute: (attr: Attribute) => void;
  onSplit: () => void;
  onMerge: () => void;
  onOpenRelationship: () => void;
}

export default function StructureView({
  data,
  objects,
  unassignedFields,
  selectedObject,
  draggedField,
  dragOverGroup,
  isDraggingToPool,
  onSelectObject,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onPoolDragOver,
  onPoolDrop,
  onAssignField,
  onUnassignField,
  onIgnoreField,
  onRestoreField,
  onConfigAttribute,
  onSplit,
  onMerge,
  onOpenRelationship
}: StructureViewProps) {

  const handleDragStart = (e: React.DragEvent, attr: Attribute) => {
    onDragStart(e, attr, 'STRUCTURE');
  };

  const handlePoolDragStart = (e: React.DragEvent, field: any) => {
    onDragStart(e, field, 'POOL');
  };

  if (!selectedObject) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-950">
        <div className="text-center text-slate-500">
          <Box size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-sm">请从左侧选择一个对象</p>
        </div>
      </div>
    );
  }

  const identifierAttrs = selectedObject.attributes.filter(a => a.type === 'IDENTIFIER');
  const attributeAttrs = selectedObject.attributes.filter(a => a.type === 'ATTRIBUTE');
  const measureAttrs = selectedObject.attributes.filter(a => a.type === 'MEASURE');

  return (
    <div className="flex h-full w-full">
      {/* Object List Panel */}
      <ObjectList
        objects={objects}
        data={data}
        selectedObject={selectedObject}
        onSelectObject={onSelectObject}
        onOpenRelationship={onOpenRelationship}
      />

      {/* Object Structure Panel */}
      <div className="flex-1 flex flex-col bg-slate-950 min-w-0 border-r border-slate-800 relative">
        {/* Header */}
        <div className="h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/20 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-1.5 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
              <Box size={20} className="text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-slate-100">{selectedObject.name}</h2>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 border border-slate-700 text-slate-400 font-mono">
                  {selectedObject.type}
                </span>
              </div>
              <div className="text-[10px] text-slate-500 flex items-center space-x-1">
                <span>来源:</span>
                <span className="font-mono text-indigo-400/70">{data?.tableContext?.sourceTable || 't_employee_profile'}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 mr-32">
            <button
              onClick={onSplit}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <Split size={14} />
              <span>拆分</span>
            </button>
            <button
              onClick={onMerge}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <Merge size={14} />
              <span>合并</span>
            </button>
            <button className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400">
              <MoreHorizontal size={16} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-950/50">
          <div className="max-w-4xl mx-auto space-y-10">
            {/* AI Insight Banner */}
            {selectedObject.fieldCount > 10 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-indigo-950/30 border border-indigo-500/30 rounded-xl p-5 flex items-start justify-between shadow-sm relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                  <BrainCircuit size={64} />
                </div>
                <div className="flex items-start space-x-4 relative z-10">
                  <div className="p-2 bg-indigo-500/20 rounded-lg">
                    <Sparkles className="text-indigo-400" size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-indigo-300">AI 建议：检测到混合语义，建议拆分</h4>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed max-w-xl">
                      Reasoning LLM 分析发现该对象包含 <span className="text-indigo-200 font-medium">核心身份信息</span> 和 <span className="text-indigo-200 font-medium">敏感薪资</span> 两类语义簇。
                      拆分后可提升数据安全管控粒度，并降低下游模型理解风险。
                    </p>
                  </div>
                </div>
                <button
                  onClick={onSplit}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold whitespace-nowrap transition-all shadow-lg shadow-indigo-900/40 relative z-10"
                >
                  一键拆分建议
                </button>
              </motion.div>
            )}

            {/* Attribute Zones */}
            <div className="grid grid-cols-1 gap-8">
              <AttributeZone
                title="标识符 (IDENTIFIER)"
                icon={<Key size={14} />}
                attributes={identifierAttrs}
                type="IDENTIFIER"
                onDragStart={handleDragStart}
                onDragOver={(e) => onDragOver(e, 'IDENTIFIER')}
                onDrop={(e) => onDrop(e, 'IDENTIFIER')}
                onUnassign={onUnassignField}
                onConfig={onConfigAttribute}
                highlightBorder={dragOverGroup === 'IDENTIFIER'}
              />

              <AttributeZone
                title="属性 (ATTRIBUTE)"
                icon={<Layers size={14} />}
                attributes={attributeAttrs}
                type="ATTRIBUTE"
                onDragStart={handleDragStart}
                onDragOver={(e) => onDragOver(e, 'ATTRIBUTE')}
                onDrop={(e) => onDrop(e, 'ATTRIBUTE')}
                onUnassign={onUnassignField}
                onConfig={onConfigAttribute}
                highlightBorder={dragOverGroup === 'ATTRIBUTE'}
              />

              <AttributeZone
                title="度量 (MEASURE)"
                icon={<BarChart3 size={14} />}
                attributes={measureAttrs}
                type="MEASURE"
                onDragStart={handleDragStart}
                onDragOver={(e) => onDragOver(e, 'MEASURE')}
                onDrop={(e) => onDrop(e, 'MEASURE')}
                onUnassign={onUnassignField}
                onConfig={onConfigAttribute}
                highlightBorder={dragOverGroup === 'MEASURE'}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Unassigned Pool */}
      <div
        onDragOver={onPoolDragOver}
        onDrop={onPoolDrop}
      >
        <UnassignedPool
          fields={unassignedFields}
          onDragStart={handlePoolDragStart}
          onAssign={onAssignField}
          onIgnore={onIgnoreField}
          onRestore={onRestoreField}
          isDraggingToPool={isDraggingToPool}
        />
      </div>
    </div>
  );
}
