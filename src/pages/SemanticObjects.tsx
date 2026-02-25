import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Layout, Network, CheckCircle2, AlertTriangle, 
  ArrowRight, Box, Layers, Database, Split, Merge, 
  MoreHorizontal, GripVertical, Plus, HelpCircle, X, Check,
  BrainCircuit, Sparkles, GitBranch, ShieldCheck,
  ChevronRight, Table, FileText, Trash2, RefreshCw,
  ArrowLeft, Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SemanticApi } from '@/services/semanticApi';
import { motion, AnimatePresence } from 'motion/react';

export default function SemanticObjects() {
  const { lvId } = useParams();
  const [data, setData] = useState<any>(null);
  const [objects, setObjects] = useState<any[]>([]);
  const [unassignedFields, setUnassignedFields] = useState<any[]>([]);
  const [activeView, setActiveView] = useState<'structure' | 'relationship'>('structure');
  const [selectedObject, setSelectedObject] = useState<any>(null);
  
  // Modal States
  const [isSplitModalOpen, setIsSplitModalOpen] = useState(false);
  const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);
  const [splitStrategy, setSplitStrategy] = useState<'sensitivity' | 'frequency'>('sensitivity');

  useEffect(() => {
    SemanticApi.getBusinessObjects(lvId || 'lv_005').then(res => {
      setData(res);
      setObjects(res.objects);
      setUnassignedFields(res.unassignedFields);
      if (res.objects.length > 0) setSelectedObject(res.objects[0]);
    });
  }, [lvId]);

  const handleAssignField = (field: any, targetType: string = 'ATTRIBUTE') => {
    if (!selectedObject) return;

    // Remove from unassigned
    setUnassignedFields(prev => prev.filter(f => f.id !== field.id));

    // Add to selected object as a new attribute
    const newAttribute = {
      id: `attr_${Date.now()}`,
      name: field.name, // Default to field name
      type: targetType, // Use target type
      mappedField: field.name,
      evidence: '人工拖拽分配',
      status: 'CONFIRMED',
      qualityRules: []
    };

    const updatedObject = {
      ...selectedObject,
      attributes: [...selectedObject.attributes, newAttribute],
      fieldCount: selectedObject.fieldCount + 1
    };

    // Update objects list
    setObjects(prev => prev.map(obj => obj.id === selectedObject.id ? updatedObject : obj));
    setSelectedObject(updatedObject);
  };

  const handleMoveField = (field: any, targetType: string) => {
    if (!selectedObject) return;

    // If type is same, do nothing (or implement reordering later)
    if (field.type === targetType) return;

    const updatedAttributes = selectedObject.attributes.map((attr: any) => 
      attr.id === field.id ? { ...attr, type: targetType } : attr
    );

    const updatedObject = {
      ...selectedObject,
      attributes: updatedAttributes
    };

    setObjects(prev => prev.map(obj => obj.id === selectedObject.id ? updatedObject : obj));
    setSelectedObject(updatedObject);
  };

  const handleSplitObject = () => {
    // Mock split logic: Create a new object with half the attributes
    if (!selectedObject) return;
    
    const attrs = [...selectedObject.attributes];
    const splitPoint = Math.floor(attrs.length / 2);
    const keepAttrs = attrs.slice(0, splitPoint);
    const moveAttrs = attrs.slice(splitPoint);

    const updatedOriginal = {
      ...selectedObject,
      attributes: keepAttrs,
      fieldCount: keepAttrs.length
    };

    const newObject = {
      id: `bo_${Date.now()}`,
      name: splitStrategy === 'sensitivity' ? `${selectedObject.name}_Sensitive` : `${selectedObject.name}_Detail`,
      type: selectedObject.type,
      description: splitStrategy === 'sensitivity' 
        ? `Split from ${selectedObject.name} based on sensitivity analysis`
        : `Split from ${selectedObject.name} based on access frequency`,
      fieldCount: moveAttrs.length,
      attributes: moveAttrs
    };

    setObjects(prev => prev.map(obj => obj.id === selectedObject.id ? updatedOriginal : obj).concat(newObject));
    setSelectedObject(updatedOriginal);
    setIsSplitModalOpen(false);
  };

  const handleMergeObject = (targetObj: any) => {
    if (!selectedObject) return;

    const mergedAttrs = [...selectedObject.attributes, ...targetObj.attributes];
    const updatedOriginal = {
      ...selectedObject,
      attributes: mergedAttrs,
      fieldCount: mergedAttrs.length,
      description: `Merged with ${targetObj.name}`
    };

    // Remove target object and update selected
    setObjects(prev => prev.filter(o => o.id !== targetObj.id).map(o => o.id === selectedObject.id ? updatedOriginal : o));
    setSelectedObject(updatedOriginal);
    setIsMergeModalOpen(false);
  };

  if (!data) return <div className="p-8 text-slate-400">Loading Objects...</div>;

  return (
    <div className="flex flex-col h-full bg-slate-950 relative">
      {/* Pipeline Status Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-slate-500">
            <CheckCircle2 size={12} className="text-green-500" />
            <span>字段裁决</span>
          </div>
          <ArrowRight size={10} className="text-slate-600" />
          <div className="flex items-center space-x-2 text-slate-500">
            <CheckCircle2 size={12} className="text-green-500" />
            <span>表级理解</span>
          </div>
          <ArrowRight size={10} className="text-slate-600" />
          <div className="flex items-center space-x-2 text-indigo-400 font-medium bg-indigo-950/30 px-2 py-0.5 rounded border border-indigo-500/30">
            <BrainCircuit size={12} />
            <span>对象候选生成 (Reasoning LLM)</span>
          </div>
          <ArrowRight size={10} className="text-slate-600" />
          <div className="flex items-center space-x-2 text-slate-500">
            <span className="w-3 h-3 rounded-full border border-slate-600 flex items-center justify-center text-[8px]">4</span>
            <span>人工确认</span>
          </div>
        </div>
        <div className="text-slate-500 flex items-center space-x-2">
           <Sparkles size={12} className="text-yellow-500" />
           <span>AI 已自动生成 3 个对象候选，建议拆分 1 个大对象</span>
        </div>
      </div>

      {/* Top Metric Bar */}
      <div className="h-16 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center space-x-8">
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">对象覆盖率</div>
            <div className="flex items-center space-x-2">
              <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full" 
                  style={{ width: `${(objects.reduce((acc, obj) => acc + obj.fieldCount, 0) / (objects.reduce((acc, obj) => acc + obj.fieldCount, 0) + unassignedFields.length)) * 100}%` }}
                />
              </div>
              <span className="text-sm font-bold text-slate-200">
                {((objects.reduce((acc, obj) => acc + obj.fieldCount, 0) / (objects.reduce((acc, obj) => acc + obj.fieldCount, 0) + unassignedFields.length)) * 100).toFixed(0)}%
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 uppercase tracking-wider">未归属字段</span>
              <span className="text-lg font-bold text-slate-300">{unassignedFields.length}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 uppercase tracking-wider">冲突归属</span>
              <span className="text-lg font-bold text-red-400">{data.metrics.conflictCount}</span>
            </div>
          </div>
        </div>

        <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveView('structure')}
            className={cn(
              "px-4 py-1.5 rounded-md text-sm font-medium flex items-center space-x-2 transition-all",
              activeView === 'structure' ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            )}
          >
            <Layout size={16} />
            <span>对象结构视图</span>
          </button>
          <button
            onClick={() => setActiveView('relationship')}
            className={cn(
              "px-4 py-1.5 rounded-md text-sm font-medium flex items-center space-x-2 transition-all",
              activeView === 'relationship' ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            )}
          >
            <Network size={16} />
            <span>对象关系视图</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {activeView === 'structure' ? (
          <StructureView 
            objects={objects}
            unassignedFields={unassignedFields}
            selectedObject={selectedObject} 
            onSelectObject={setSelectedObject}
            onAssignField={handleAssignField}
            onMoveField={handleMoveField}
            onSplit={() => setIsSplitModalOpen(true)}
            onMerge={() => setIsMergeModalOpen(true)}
          />
        ) : (
          <RelationshipView data={data} />
        )}
      </div>

      {/* Split Modal */}
      <AnimatePresence>
        {isSplitModalOpen && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-700 rounded-xl w-[600px] shadow-2xl"
            >
              <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                <div className="flex items-center space-x-2">
                  <BrainCircuit className="text-indigo-400" size={20} />
                  <h3 className="text-lg font-semibold text-slate-200">AI 对象拆分建议</h3>
                </div>
                <button onClick={() => setIsSplitModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-6">
                {/* Strategy Selector */}
                <div className="flex space-x-2 bg-slate-950 p-1 rounded-lg border border-slate-800">
                  <button
                    onClick={() => setSplitStrategy('sensitivity')}
                    className={cn(
                      "flex-1 py-1.5 px-3 rounded text-xs font-medium transition-all flex items-center justify-center space-x-2",
                      splitStrategy === 'sensitivity' ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
                    )}
                  >
                    <AlertTriangle size={12} />
                    <span>按敏感度拆分 (推荐)</span>
                  </button>
                  <button
                    onClick={() => setSplitStrategy('frequency')}
                    className={cn(
                      "flex-1 py-1.5 px-3 rounded text-xs font-medium transition-all flex items-center justify-center space-x-2",
                      splitStrategy === 'frequency' ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
                    )}
                  >
                    <Network size={12} />
                    <span>按访问频率拆分</span>
                  </button>
                </div>

                <div className="bg-indigo-950/30 border border-indigo-500/30 p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Sparkles className="text-yellow-400 mt-1 shrink-0" size={18} />
                    <div>
                      <h4 className="text-sm font-medium text-indigo-300">
                        {splitStrategy === 'sensitivity' ? '推理解释：高内聚 / 低耦合' : '推理解释：访问模式分析'}
                      </h4>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        {splitStrategy === 'sensitivity' ? (
                          <>
                            Reasoning LLM 分析发现该对象包含两组语义簇：
                            <br/>1. 核心身份信息 (Core Identity) - 高频访问
                            <br/>2. 敏感薪资信息 (Sensitive Compensation) - 低频且需权限控制
                            <br/>建议拆分为 <span className="font-mono text-indigo-300">Employee</span> 和 <span className="font-mono text-indigo-300">Employee_Sensitive</span> 以优化安全性和模型清晰度。
                          </>
                        ) : (
                          <>
                            Query Log 分析显示：
                            <br/>1. 基础信息 (Name, Dept) 在 90% 的查询中出现。
                            <br/>2. 详细档案 (Bio, History) 仅在 5% 的查询中出现。
                            <br/>建议拆分为 <span className="font-mono text-indigo-300">Employee_Core</span> 和 <span className="font-mono text-indigo-300">Employee_Detail</span> 以提升查询性能。
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center">
                  <div className="border border-slate-700 rounded-lg bg-slate-950/50 p-3 h-48 flex flex-col">
                    <div className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">当前对象 (保留)</div>
                    <div className="font-medium text-slate-200 mb-2">{selectedObject?.name}</div>
                    <div className="flex-1 overflow-y-auto space-y-1 pr-1">
                      <div className="text-xs text-slate-400 flex items-center"><Check size={10} className="mr-1 text-green-500"/> employee_id</div>
                      <div className="text-xs text-slate-400 flex items-center"><Check size={10} className="mr-1 text-green-500"/> full_name</div>
                      <div className="text-xs text-slate-400 flex items-center"><Check size={10} className="mr-1 text-green-500"/> hire_date</div>
                      <div className="text-xs text-slate-400 flex items-center"><Check size={10} className="mr-1 text-green-500"/> dept_code</div>
                      <div className="text-xs text-slate-500 italic pl-4">+ 3 more...</div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center text-slate-500 space-y-2">
                    <span className="text-[10px] uppercase tracking-wider">迁移</span>
                    <ArrowRight size={20} />
                  </div>

                  <div className="border border-indigo-500/30 rounded-lg bg-indigo-950/10 p-3 h-48 flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-1 bg-indigo-500/20 rounded-bl-lg">
                      <Sparkles size={12} className="text-indigo-400" />
                    </div>
                    <div className="text-xs font-semibold text-indigo-300 mb-2 uppercase tracking-wider">新对象 (建议)</div>
                    <div className="font-medium text-indigo-200 mb-2">
                      {splitStrategy === 'sensitivity' ? `${selectedObject?.name}_Sensitive` : `${selectedObject?.name}_Detail`}
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-1 pr-1">
                      {splitStrategy === 'sensitivity' ? (
                        <>
                          <div className="text-xs text-indigo-300/80 flex items-center"><Database size={10} className="mr-1"/> annual_salary</div>
                          <div className="text-xs text-indigo-300/80 flex items-center"><Database size={10} className="mr-1"/> ssn_number</div>
                          <div className="text-xs text-indigo-300/80 flex items-center"><Database size={10} className="mr-1"/> bonus_amt</div>
                          <div className="text-xs text-indigo-300/80 flex items-center"><Database size={10} className="mr-1"/> tax_bracket</div>
                        </>
                      ) : (
                        <>
                          <div className="text-xs text-indigo-300/80 flex items-center"><Database size={10} className="mr-1"/> biography_text</div>
                          <div className="text-xs text-indigo-300/80 flex items-center"><Database size={10} className="mr-1"/> previous_employment</div>
                          <div className="text-xs text-indigo-300/80 flex items-center"><Database size={10} className="mr-1"/> education_history</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-5 border-t border-slate-800 flex justify-end space-x-3 bg-slate-900/50">
                <button onClick={() => setIsSplitModalOpen(false)} className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">取消</button>
                <button onClick={handleSplitObject} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium shadow-lg shadow-indigo-900/20 flex items-center space-x-2">
                  <Split size={16} />
                  <span>确认拆分</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

       {/* Merge Modal */}
       <AnimatePresence>
        {isMergeModalOpen && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-700 rounded-xl w-[500px] shadow-2xl"
            >
              <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                <div className="flex items-center space-x-2">
                  <GitBranch className="text-blue-400" size={20} />
                  <h3 className="text-lg font-semibold text-slate-200">AI 对象合并建议</h3>
                </div>
                <button onClick={() => setIsMergeModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-blue-950/30 border border-blue-500/30 p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Sparkles className="text-blue-400 mt-1 shrink-0" size={18} />
                    <div>
                      <h4 className="text-sm font-medium text-blue-300">推理解释：语义重叠</h4>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        检测到 <span className="font-mono text-slate-200">{selectedObject?.name}</span> 与以下对象存在高度主键重叠 (95%) 且业务语义相似。建议合并以减少冗余。
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">可合并候选对象</p>
                  {objects.filter(o => o.id !== selectedObject?.id).map(obj => (
                    <button 
                      key={obj.id} 
                      onClick={() => handleMergeObject(obj)}
                      className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-blue-500 hover:bg-blue-900/10 transition-all group"
                    >
                      <div className="flex items-center space-x-3">
                        <Box size={16} className="text-slate-500 group-hover:text-blue-400" />
                        <div className="text-left">
                          <div className="text-sm font-medium text-slate-300 group-hover:text-blue-200">{obj.name}</div>
                          <div className="text-[10px] text-slate-500">{obj.fieldCount} fields • {obj.type}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs text-blue-400 font-mono">95% 匹配度</span>
                        <Merge size={16} className="text-blue-500" />
                      </div>
                    </button>
                  ))}
                  {objects.filter(o => o.id !== selectedObject?.id).length === 0 && (
                    <div className="text-center py-8 text-slate-500 text-sm italic">
                      暂无合适的合并候选对象
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StructureView({ objects, unassignedFields, selectedObject, onSelectObject, onAssignField, onMoveField, onSplit, onMerge }: any) {
  const [draggedField, setDraggedField] = useState<any>(null);
  const [dragOverGroup, setDragOverGroup] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, field: any, source: 'UNASSIGNED' | 'ASSIGNED') => {
    setDraggedField({ ...field, source });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, groupType: string) => {
    e.preventDefault();
    setDragOverGroup(groupType);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverGroup(null);
  };

  const handleDrop = (e: React.DragEvent, groupType: string) => {
    e.preventDefault();
    setDragOverGroup(null);
    if (draggedField) {
      if (draggedField.source === 'UNASSIGNED') {
        onAssignField(draggedField, groupType);
      } else if (draggedField.source === 'ASSIGNED') {
        onMoveField(draggedField, groupType);
      }
      setDraggedField(null);
    }
  };

  return (
    <div className="flex h-full">
      {/* Left: Object List */}
      <div className="w-64 border-r border-slate-800 bg-slate-900/30 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <h3 className="text-sm font-semibold text-slate-300">生成对象 ({objects.length})</h3>
          <button className="p-1.5 hover:bg-slate-800 rounded text-slate-400 transition-colors">
            <Plus size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {objects.map((obj: any) => (
            <div
              key={obj.id}
              onClick={() => onSelectObject(obj)}
              className={cn(
                "p-3 rounded-lg border cursor-pointer transition-all group relative",
                selectedObject?.id === obj.id
                  ? "bg-indigo-900/20 border-indigo-500/50 shadow-sm"
                  : "bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50"
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2 truncate">
                  <Box size={14} className={cn(
                    "shrink-0",
                    obj.type === 'PRIMARY' ? "text-indigo-400" : 
                    obj.type === 'REFERENCE' ? "text-blue-400" : "text-slate-500"
                  )} />
                  <span className={cn(
                    "text-sm font-medium truncate",
                    selectedObject?.id === obj.id ? "text-indigo-200" : "text-slate-300"
                  )}>{obj.name}</span>
                </div>
                <span className="text-[10px] text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 shrink-0">
                  {obj.fieldCount}
                </span>
              </div>
              <div className="text-[10px] text-slate-500 truncate pl-6 opacity-70">{obj.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Center: Attribute Tree */}
      <div className="flex-1 flex flex-col bg-slate-950 min-w-0 border-r border-slate-800">
        {selectedObject ? (
          <>
            <div className="h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/20 shrink-0">
              <div className="flex items-center space-x-3">
                <div className="p-1.5 bg-indigo-500/10 rounded-md border border-indigo-500/20">
                  <Box size={18} className="text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-slate-100 flex items-center space-x-2">
                    <span>{selectedObject.name}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 border border-slate-700 text-slate-400 font-normal">
                      {selectedObject.type}
                    </span>
                  </h2>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={onSplit}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  <Split size={14} />
                  <span>拆分</span>
                </button>
                <button 
                  onClick={onMerge}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  <Merge size={14} />
                  <span>合并</span>
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 bg-slate-950/50">
              <div className="max-w-3xl mx-auto space-y-8">
                
                {/* AI Insight Banner */}
                {selectedObject.fieldCount > 10 && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-indigo-950/30 border border-indigo-500/30 rounded-lg p-4 flex items-start justify-between shadow-sm"
                  >
                    <div className="flex items-start space-x-3">
                      <Sparkles className="text-indigo-400 mt-1 shrink-0" size={16} />
                      <div>
                        <h4 className="text-sm font-medium text-indigo-300">AI 洞察：检测到混合语义</h4>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          该对象同时包含 <span className="text-indigo-200">核心身份信息</span> 和 <span className="text-indigo-200">敏感薪资</span> 字段。
                          拆分该对象可以提升数据安全性和模型清晰度。
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={onSplit}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-medium whitespace-nowrap transition-colors shadow-lg shadow-indigo-900/20"
                    >
                      查看拆分方案
                    </button>
                  </motion.div>
                )}

                {/* Attribute Groups (Drop Zones) */}
                {['ID', 'ATTRIBUTE', 'DIMENSION', 'MEASURE'].map(type => {
                  const attrs = selectedObject.attributes.filter((a: any) => a.type === type);
                  const isOver = dragOverGroup === type;
                  
                  return (
                    <div 
                      key={type} 
                      className={cn(
                        "space-y-3 p-4 rounded-xl border-2 border-transparent transition-all",
                        isOver ? "border-indigo-500/50 bg-indigo-900/10" : "hover:bg-slate-900/30"
                      )}
                      onDragOver={(e) => handleDragOver(e, type)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, type)}
                    >
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-2 select-none">
                        <div className={cn("w-2 h-2 rounded-full", 
                          type === 'ID' ? "bg-indigo-500" :
                          type === 'ATTRIBUTE' ? "bg-slate-500" :
                          type === 'DIMENSION' ? "bg-blue-500" : "bg-emerald-500"
                        )} />
                        <span>{type === 'ID' ? '主标识 (Identifiers)' : type === 'ATTRIBUTE' ? '业务属性 (Attributes)' : type === 'DIMENSION' ? '维度 (Dimensions)' : '度量 (Measures)'}</span>
                        <div className="h-px flex-1 bg-slate-800/50"></div>
                        <span className="text-[10px] bg-slate-800 px-1.5 rounded text-slate-500">{attrs.length}</span>
                      </h4>
                      
                      {attrs.length === 0 && (
                        <div className="h-12 border border-dashed border-slate-800 rounded-lg flex items-center justify-center text-xs text-slate-600 italic">
                          拖拽字段到此处添加 {type.toLowerCase()}
                        </div>
                      )}

                      <div className="space-y-2">
                        {attrs.map((attr: any) => (
                          <div 
                            key={attr.id} 
                            draggable
                            onDragStart={(e) => handleDragStart(e, attr, 'ASSIGNED')}
                            className="flex items-center group relative cursor-grab active:cursor-grabbing"
                          >
                            <div className="absolute -left-6 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-600">
                              <GripVertical size={14} />
                            </div>
                            <div className="flex-1 flex items-center bg-slate-900 border border-slate-800 rounded-lg p-2.5 hover:border-indigo-500/30 transition-colors shadow-sm">
                              {/* Attribute Info */}
                              <div className="w-1/3 min-w-[140px]">
                                <div className="text-sm font-medium text-slate-200 truncate" title={attr.name}>{attr.name}</div>
                                <div className="text-[10px] text-slate-500 uppercase font-mono">{attr.type}</div>
                              </div>
                              
                              {/* Connector */}
                              <div className="px-3 text-slate-700">
                                <ArrowRight size={12} />
                              </div>

                              {/* Mapped Field Info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2">
                                  <Database size={12} className="text-slate-600 shrink-0" />
                                  <span className="text-xs font-mono text-indigo-300 truncate" title={attr.mappedField}>{attr.mappedField}</span>
                                </div>
                              </div>

                              {/* Quality Rules */}
                              {attr.qualityRules && attr.qualityRules.length > 0 && (
                                <div className="flex items-center space-x-1 mr-2 shrink-0">
                                  <ShieldCheck size={12} className="text-slate-500" />
                                  <div className="flex space-x-1">
                                    {attr.qualityRules.map((rule: string) => (
                                      <span key={rule} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 font-mono" title={rule}>
                                        {rule}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Evidence Badge */}
                              <div className="flex items-center space-x-2 ml-2">
                                <span className={cn(
                                  "text-[10px] px-1.5 py-0.5 rounded border whitespace-nowrap",
                                  attr.status === 'CONFIRMED' 
                                    ? "bg-green-500/10 text-green-400 border-green-500/20" 
                                    : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                                )}>
                                  {attr.evidence}
                                </span>
                                <button className="p-1 hover:bg-slate-800 rounded text-slate-500 transition-colors">
                                  <MoreHorizontal size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
              <Box size={32} className="text-slate-700" />
            </div>
            <p className="text-sm">选择左侧对象以查看详细结构</p>
          </div>
        )}
      </div>

      {/* Right: Unassigned Fields (Draggable Source) */}
      <div className="w-72 border-l border-slate-800 bg-slate-900/30 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div className="flex items-center space-x-2">
            <HelpCircle size={16} className="text-slate-400" />
            <h3 className="text-sm font-semibold text-slate-300">待处理字段</h3>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
            {unassignedFields.length}
          </span>
        </div>
        
        <div className="p-3 bg-slate-900/20 border-b border-slate-800">
          <p className="text-[10px] text-slate-500 leading-relaxed">
            拖拽字段到中间区域的相应分组 (ID, Attribute, Dimension, Measure) 以完成分配。
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {unassignedFields.map((f: any) => (
            <div 
              key={f.id} 
              draggable
              onDragStart={(e) => handleDragStart(e, f, 'UNASSIGNED')}
              className="group bg-slate-900 border border-slate-800 rounded-lg p-3 cursor-grab active:cursor-grabbing hover:border-indigo-500/50 hover:shadow-md transition-all relative overflow-hidden"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-800 group-hover:bg-indigo-500 transition-colors"></div>
              <div className="flex justify-between items-start pl-2">
                <div>
                  <div className="text-xs font-medium text-slate-200 font-mono mb-1">{f.name}</div>
                  <div className="text-[10px] text-slate-500 flex items-center space-x-1">
                    <AlertTriangle size={10} className="text-yellow-500" />
                    <span>{f.reason}</span>
                  </div>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); onAssignField(f, 'ATTRIBUTE'); }}
                  className="p-1 hover:bg-slate-800 rounded text-slate-500 hover:text-indigo-400 transition-colors"
                  title="Quick Assign"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          ))}
          {unassignedFields.length === 0 && (
            <div className="text-center py-10 text-slate-600 text-xs italic">
              所有字段已分配完毕
              <br/>
              <CheckCircle2 size={24} className="mx-auto mt-2 text-green-500/50" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const RelationshipDrawer = ({ isOpen, onClose, data }: any) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm z-40"
        />
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute top-0 right-0 bottom-0 w-[600px] bg-slate-900 border-l border-slate-700 shadow-2xl z-50 flex flex-col"
        >
          <div className="h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/50">
            <div className="flex items-center space-x-2">
              <Network className="text-indigo-400" size={20} />
              <h3 className="text-lg font-semibold text-slate-200">对象关系视图</h3>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white">
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 p-6 overflow-y-auto relative">
             <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none"></div>
             {/* Mock Graph Content */}
             <div className="flex flex-col items-center justify-center h-full space-y-12">
                <div className="p-4 bg-slate-800 border-2 border-indigo-500 rounded-xl shadow-xl w-64 relative z-10">
                   <div className="text-sm font-bold text-white mb-1">Employee</div>
                   <div className="text-xs text-slate-400">PK: employee_id</div>
                   <div className="mt-2 text-[10px] text-slate-500">t_hr_employee</div>
                </div>
                
                <div className="h-16 w-0.5 border-l-2 border-dashed border-slate-600 relative">
                   <div className="absolute top-1/2 left-2 -translate-y-1/2 bg-slate-900 px-2 py-1 rounded border border-slate-700 text-[10px] text-indigo-300 whitespace-nowrap">
                      1 : N (via dept_code)
                   </div>
                </div>

                <div className="p-4 bg-slate-800 border border-slate-700 rounded-xl shadow-xl w-64 relative z-10">
                   <div className="text-sm font-bold text-white mb-1">DepartmentRef</div>
                   <div className="text-xs text-slate-400">FK: dept_code</div>
                   <div className="mt-2 text-[10px] text-slate-500">t_hr_employee</div>
                </div>
             </div>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);
