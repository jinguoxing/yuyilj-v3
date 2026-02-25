import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Layout, Network, CheckCircle2, AlertTriangle, 
  ArrowRight, Box, Layers, Database, Split, Merge, 
  MoreHorizontal, GripVertical, Plus, HelpCircle, X, Check,
  BrainCircuit, Sparkles, GitBranch, ShieldCheck,
  ChevronRight, Table, FileText, Trash2, RefreshCw,
  ArrowLeft, Settings, Info, ExternalLink, Eye, List
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SemanticApi } from '@/services/semanticApi';
import { motion, AnimatePresence } from 'motion/react';

export default function SemanticObjects() {
  const { lvId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [objects, setObjects] = useState<any[]>([]);
  const [unassignedFields, setUnassignedFields] = useState<any[]>([]);
  const [activeView, setActiveView] = useState<'object' | 'table'>('object');
  const [isRelationshipOpen, setIsRelationshipOpen] = useState(false);
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
    <div className="flex flex-col h-full bg-slate-950 relative font-sans text-slate-200">
      {/* HeaderBar */}
      <header className="h-14 border-b border-slate-800 bg-slate-900 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div className="h-6 w-px bg-slate-800 mx-2" />
          <h1 className="text-sm font-semibold flex items-center space-x-2">
            <span>对象候选生成</span>
            <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-500/30 font-mono">Reasoning LLM</span>
          </h1>
        </div>

        {/* Steps */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 text-[11px] text-green-500 font-medium">
            <CheckCircle2 size={12} />
            <span>字段裁决</span>
          </div>
          <ChevronRight size={12} className="text-slate-700" />
          <div className="flex items-center space-x-1.5 text-[11px] text-green-500 font-medium">
            <CheckCircle2 size={12} />
            <span>表理解</span>
          </div>
          <ChevronRight size={12} className="text-slate-700" />
          <div className="flex items-center space-x-1.5 text-[11px] text-indigo-400 font-bold bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20">
            <BrainCircuit size={12} />
            <span>对象生成</span>
          </div>
          <ChevronRight size={12} className="text-slate-700" />
          <div className="flex items-center space-x-1.5 text-[11px] text-slate-500">
            <div className="w-3 h-3 rounded-full border border-slate-600 flex items-center justify-center text-[8px]">4</div>
            <span>人工确认</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <Sparkles size={14} className="text-yellow-500" />
            <span className="text-[11px] text-yellow-200/80">检测到混合语义，建议拆分 1 个对象</span>
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors">一键优化</button>
            <button className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium shadow-lg shadow-indigo-900/20 transition-colors">推进到可发布</button>
          </div>
        </div>
      </header>

      {/* TableContextBar */}
      <div className="h-12 border-b border-slate-800 bg-slate-900/50 flex items-center px-6 space-x-8 shrink-0">
        <div className="flex items-center space-x-2">
          <Table size={14} className="text-slate-500" />
          <span className="text-[11px] text-slate-500 uppercase tracking-wider">来源表:</span>
          <span className="text-xs font-mono text-indigo-300">{data.tableContext?.sourceTable || 't_customer_profile'}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Layers size={14} className="text-slate-500" />
          <span className="text-[11px] text-slate-500 uppercase tracking-wider">业务域:</span>
          <span className="text-xs text-slate-300">{data.tableContext?.businessDomain || '客户中心'}</span>
        </div>
        <div className="h-4 w-px bg-slate-800" />
        <div className="flex items-center space-x-6 text-[11px]">
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-500">字段总数:</span>
            <span className="font-bold text-slate-300">{data.tableContext?.totalFields || 24}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-500">生成对象:</span>
            <span className="font-bold text-slate-300">{objects.length}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-slate-500">对象覆盖率:</span>
            <div className="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-green-500" style={{ width: `${(data.tableContext?.objectCoverage || 0.875) * 100}%` }} />
            </div>
            <span className="font-bold text-green-400">{(data.tableContext?.objectCoverage || 0.875) * 100}%</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-500">未归属属性:</span>
            <span className="font-bold text-slate-300">{unassignedFields.filter(f => f.group === 'UNASSIGNED').length}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-500">冲突属性:</span>
            <span className="font-bold text-red-400">{data.tableContext?.conflictCount || 1}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex">
        {activeView === 'object' ? (
          <StructureView 
            objects={objects}
            unassignedFields={unassignedFields}
            selectedObject={selectedObject} 
            onSelectObject={setSelectedObject}
            onAssignField={handleAssignField}
            onMoveField={handleMoveField}
            onSplit={() => setIsSplitModalOpen(true)}
            onMerge={() => setIsMergeModalOpen(true)}
            activeView={activeView}
            setActiveView={setActiveView}
            onOpenRelationship={() => setIsRelationshipOpen(true)}
          />
        ) : (
          <TableView 
            data={data} 
            activeView={activeView}
            setActiveView={setActiveView}
          />
        )}
      </main>

      {/* RelationshipDrawer */}
      <RelationshipDrawer 
        isOpen={isRelationshipOpen} 
        onClose={() => setIsRelationshipOpen(false)} 
        data={data} 
      />

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

function StructureView({ 
  objects, 
  unassignedFields, 
  selectedObject, 
  onSelectObject, 
  onAssignField, 
  onMoveField, 
  onSplit, 
  onMerge,
  activeView,
  setActiveView,
  onOpenRelationship
}: any) {
  const [draggedField, setDraggedField] = useState<any>(null);
  const [dragOverGroup, setDragOverGroup] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, field: any, source: 'POOL' | 'STRUCTURE') => {
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
      if (draggedField.source === 'POOL') {
        onAssignField(draggedField, groupType);
      } else if (draggedField.source === 'STRUCTURE') {
        onMoveField(draggedField, groupType);
      }
      setDraggedField(null);
    }
  };

  return (
    <div className="flex h-full w-full">
      {/* 1. Object List Panel */}
      <div className="w-64 border-r border-slate-800 bg-slate-900/30 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">生成对象 ({objects.length})</h3>
          <button className="p-1.5 hover:bg-slate-800 rounded text-slate-400 transition-colors">
            <Plus size={14} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {objects.map((obj: any) => (
            <div
              key={obj.id}
              onClick={() => onSelectObject(obj)}
              className={cn(
                "p-3 rounded-xl border cursor-pointer transition-all group relative",
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
                    "text-sm font-semibold truncate",
                    selectedObject?.id === obj.id ? "text-indigo-200" : "text-slate-300"
                  )}>{obj.name}</span>
                  {obj.type === 'PRIMARY' && (
                    <span className="text-[8px] bg-indigo-500/20 text-indigo-400 px-1 rounded border border-indigo-500/30">PRIMARY</span>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="text-[10px] text-slate-500 flex items-center space-x-1">
                  <Table size={10} />
                  <span className="truncate max-w-[100px]">{obj.description.split(' ').pop()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] text-slate-500">{obj.fieldCount} 属性</span>
                  <div className="w-8 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500" style={{ width: '92%' }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={onOpenRelationship}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-medium text-slate-300 flex items-center justify-center space-x-2 transition-colors"
          >
            <Network size={14} />
            <span>查看对象关系</span>
          </button>
        </div>
      </div>

      {/* 2. Object Structure Panel (Core) */}
      <div className="flex-1 flex flex-col bg-slate-950 min-w-0 border-r border-slate-800 relative">
        {/* View Mode Switcher */}
        <div className="absolute top-4 right-6 z-10 flex bg-slate-900 p-1 rounded-lg border border-slate-800 shadow-xl">
          <button
            onClick={() => setActiveView('object')}
            className={cn(
              "px-3 py-1 rounded-md text-[11px] font-medium flex items-center space-x-1.5 transition-all",
              activeView === 'object' ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            )}
          >
            <Layout size={12} />
            <span>对象视图</span>
          </button>
          <button
            onClick={() => setActiveView('table')}
            className={cn(
              "px-3 py-1 rounded-md text-[11px] font-medium flex items-center space-x-1.5 transition-all",
              activeView === 'table' ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            )}
          >
            <Table size={12} />
            <span>表视图</span>
          </button>
        </div>

        {selectedObject ? (
          <>
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
                    <span className="font-mono text-indigo-400/70">t_employee_profile</span>
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

                {/* Attribute Sections */}
                {[
                  { id: 'ID', label: '主标识 (Identifiers)', color: 'bg-indigo-500' },
                  { id: 'ATTRIBUTE', label: '业务属性 (Attributes)', color: 'bg-slate-500' },
                  { id: 'DIMENSION', label: '维度 (Dimensions)', color: 'bg-blue-500' },
                  { id: 'MEASURE', label: '度量 (Measures)', color: 'bg-emerald-500' },
                  { id: 'AUDIT', label: '审计属性 (Audit)', color: 'bg-amber-500' },
                  { id: 'CONFLICT', label: '冲突属性 (Conflicts)', color: 'bg-red-500' }
                ].map(section => {
                  const attrs = selectedObject.attributes.filter((a: any) => a.type === section.id);
                  const isOver = dragOverGroup === section.id;
                  
                  if (attrs.length === 0 && section.id === 'CONFLICT') return null;

                  return (
                    <div 
                      key={section.id} 
                      className={cn(
                        "space-y-4 p-4 rounded-2xl border-2 border-transparent transition-all",
                        isOver ? "border-indigo-500/50 bg-indigo-900/10" : "hover:bg-slate-900/20"
                      )}
                      onDragOver={(e) => handleDragOver(e, section.id)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, section.id)}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.1em] flex items-center space-x-2 select-none">
                          <div className={cn("w-2 h-2 rounded-full shadow-sm", section.color)} />
                          <span>{section.label}</span>
                          <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded-full text-slate-400 font-mono ml-2">{attrs.length}</span>
                        </h4>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-3">
                        {attrs.map((attr: any) => (
                          <div 
                            key={attr.id} 
                            draggable
                            onDragStart={(e) => handleDragStart(e, attr, 'STRUCTURE')}
                            className="group flex items-center bg-slate-900/80 border border-slate-800 rounded-xl p-3 hover:border-indigo-500/40 hover:bg-slate-900 transition-all cursor-grab active:cursor-grabbing shadow-sm"
                          >
                            <div className="mr-3 text-slate-700 group-hover:text-slate-500 transition-colors">
                              <GripVertical size={14} />
                            </div>
                            
                            <div className="flex-1 grid grid-cols-[1.5fr,auto,1fr,auto] items-center gap-4">
                              {/* Attribute Name */}
                              <div className="min-w-0">
                                <div className="text-sm font-bold text-slate-200 truncate" title={attr.name}>{attr.name}</div>
                                <div className="flex items-center space-x-2 mt-0.5">
                                  <span className="text-[9px] text-slate-500 uppercase font-mono tracking-wider">{attr.type}</span>
                                  {attr.qualityRules?.length > 0 && (
                                    <div className="flex items-center space-x-1">
                                      <ShieldCheck size={10} className="text-slate-600" />
                                      <span className="text-[9px] text-slate-600">{attr.qualityRules.length} 规则</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <ArrowRight size={12} className="text-slate-700" />

                              {/* Physical Field */}
                              <div className="min-w-0">
                                <div className="flex items-center space-x-2">
                                  <Database size={12} className="text-slate-600 shrink-0" />
                                  <span className="text-xs font-mono text-indigo-300/80 truncate" title={attr.mappedField}>{attr.mappedField}</span>
                                </div>
                                <div className="text-[9px] text-slate-600 mt-0.5 flex items-center space-x-1">
                                  <Info size={8} />
                                  <span>证据: {attr.evidence}</span>
                                </div>
                              </div>

                              {/* Status & Actions */}
                              <div className="flex items-center space-x-3">
                                <div className={cn(
                                  "px-2 py-0.5 rounded-full text-[9px] font-bold border flex items-center space-x-1",
                                  attr.status === 'CONFIRMED' 
                                    ? "bg-green-500/10 text-green-400 border-green-500/20" 
                                    : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                                )}>
                                  {attr.status === 'CONFIRMED' ? <Check size={8} /> : <RefreshCw size={8} />}
                                  <span>{attr.status === 'CONFIRMED' ? '已确认' : '建议'}</span>
                                </div>
                                <button className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Settings size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                        {attrs.length === 0 && (
                          <div className="h-16 border border-dashed border-slate-800 rounded-xl flex items-center justify-center text-[11px] text-slate-600 italic bg-slate-900/20">
                            拖拽属性到此处添加
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 space-y-4">
            <div className="w-20 h-20 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-inner">
              <Box size={40} className="text-slate-700" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-slate-400">选择左侧对象以查看详细结构</p>
              <p className="text-xs text-slate-600 mt-1">您可以查看 AI 自动生成的对象候选并进行调整</p>
            </div>
          </div>
        )}
      </div>

      {/* 3. Attribute Pool Panel */}
      <div className="w-80 border-l border-slate-800 bg-slate-900/30 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div className="flex items-center space-x-2">
            <HelpCircle size={16} className="text-slate-400" />
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">属性池 (Attribute Pool)</h3>
          </div>
          <span className="text-[10px] font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded-full border border-slate-800">
            {unassignedFields.length}
          </span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Unassigned Section */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-slate-600 uppercase tracking-widest flex items-center justify-between">
              <span>未归属属性</span>
              <span className="text-slate-700">{unassignedFields.filter(f => f.group === 'UNASSIGNED').length}</span>
            </h4>
            {unassignedFields.filter(f => f.group === 'UNASSIGNED').map((f: any) => (
              <AttributeCard key={f.id} field={f} onDragStart={handleDragStart} onAssign={onAssignField} />
            ))}
          </div>

          {/* Conflict Section */}
          {unassignedFields.some(f => f.group === 'CONFLICT') && (
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-red-500/70 uppercase tracking-widest flex items-center justify-between">
                <span>冲突归属</span>
                <span className="text-red-900/50">{unassignedFields.filter(f => f.group === 'CONFLICT').length}</span>
              </h4>
              {unassignedFields.filter(f => f.group === 'CONFLICT').map((f: any) => (
                <AttributeCard key={f.id} field={f} onDragStart={handleDragStart} onAssign={onAssignField} isConflict />
              ))}
            </div>
          )}

          {/* Technical Section */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-slate-600 uppercase tracking-widest flex items-center justify-between">
              <span>技术字段 (建议忽略)</span>
              <span className="text-slate-700">{unassignedFields.filter(f => f.group === 'TECHNICAL').length}</span>
            </h4>
            {unassignedFields.filter(f => f.group === 'TECHNICAL').map((f: any) => (
              <AttributeCard key={f.id} field={f} onDragStart={handleDragStart} onAssign={onAssignField} isTechnical />
            ))}
          </div>
        </div>
        
        <div className="p-4 bg-indigo-950/20 border-t border-slate-800">
          <div className="flex items-start space-x-3">
            <Info size={14} className="text-indigo-400 mt-0.5 shrink-0" />
            <p className="text-[10px] text-slate-400 leading-relaxed">
              拖拽属性到中间区域的相应分组以完成分配。系统会自动计算覆盖率并更新 GateMetrics。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AttributeCard({ field, onDragStart, onAssign, isConflict, isTechnical }: any) {
  return (
    <div 
      draggable
      onDragStart={(e) => onDragStart(e, field, 'POOL')}
      className={cn(
        "group bg-slate-900 border border-slate-800 rounded-xl p-3 cursor-grab active:cursor-grabbing hover:border-indigo-500/50 hover:shadow-lg transition-all relative overflow-hidden",
        isConflict && "border-red-500/20 bg-red-500/5",
        isTechnical && "opacity-60 grayscale hover:grayscale-0 hover:opacity-100"
      )}
    >
      <div className={cn(
        "absolute left-0 top-0 bottom-0 w-1 bg-slate-800 group-hover:bg-indigo-500 transition-colors",
        isConflict && "bg-red-500",
        isTechnical && "bg-slate-700"
      )}></div>
      <div className="flex justify-between items-start pl-2">
        <div className="min-w-0 flex-1">
          <div className="text-xs font-bold text-slate-200 font-mono mb-1 truncate">{field.name}</div>
          <div className="flex items-center space-x-2">
            <span className="text-[9px] text-slate-500 font-mono uppercase">{field.dataType}</span>
            <div className="flex items-center space-x-1 text-[9px] text-slate-500 truncate">
              {isConflict ? <AlertTriangle size={10} className="text-red-500" /> : <Database size={10} className="text-slate-600" />}
              <span className="truncate">{field.reason}</span>
            </div>
          </div>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); onAssign(field, 'ATTRIBUTE'); }}
          className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-indigo-400 transition-colors shrink-0"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}

function TableView({ data, activeView, setActiveView }: any) {
  return (
    <div className="flex-1 flex flex-col bg-slate-950 relative">
      <div className="absolute top-4 right-6 z-10 flex bg-slate-900 p-1 rounded-lg border border-slate-800 shadow-xl">
        <button
          onClick={() => setActiveView('object')}
          className={cn(
            "px-3 py-1 rounded-md text-[11px] font-medium flex items-center space-x-1.5 transition-all",
            activeView === 'object' ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
          )}
        >
          <Layout size={12} />
          <span>对象视图</span>
        </button>
        <button
          onClick={() => setActiveView('table')}
          className={cn(
            "px-3 py-1 rounded-md text-[11px] font-medium flex items-center space-x-1.5 transition-all",
            activeView === 'table' ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
          )}
        >
          <Table size={12} />
          <span>表视图</span>
        </button>
      </div>

      <div className="h-14 border-b border-slate-800 flex items-center px-6 bg-slate-900/20 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="p-1.5 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
            <Table size={20} className="text-indigo-400" />
          </div>
          <h2 className="text-base font-bold text-slate-100">物理字段映射视图</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/50 border-b border-slate-800">
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">物理字段 (Physical Field)</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">逻辑属性 (Logical Attribute)</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">所属对象 (Target Object)</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-right">置信度</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {(data.tableView || []).map((row: any, i: number) => (
                  <tr key={i} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-500 font-mono text-[10px]">
                          {i + 1}
                        </div>
                        <span className="text-sm font-mono text-indigo-300/80">{row.field}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-slate-200">{row.attribute}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Box size={14} className="text-indigo-400" />
                        <span className="text-sm text-slate-300">{row.object}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-xs font-mono text-green-400">99%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}


const RelationshipDrawer = ({ isOpen, onClose, data }: any) => {
  const relationships = data?.relationships || [];
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute top-0 right-0 bottom-0 w-[600px] bg-slate-900 border-l border-slate-700 shadow-2xl z-50 flex flex-col"
          >
            <div className="h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center space-x-3">
                <div className="p-1.5 bg-indigo-500/20 rounded-lg">
                  <Network className="text-indigo-400" size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-100">对象关系可视化</h3>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 p-8 overflow-y-auto relative bg-slate-950">
               <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none"></div>
               
               <div className="relative z-10 space-y-12 flex flex-col items-center">
                  {relationships.length > 0 ? (
                    relationships.map((rel: any, idx: number) => {
                      const sourceObj = data.objects.find((o: any) => o.name === rel.source);
                      const targetObj = data.objects.find((o: any) => o.name === rel.target);

                      return (
                        <React.Fragment key={idx}>
                          {/* Source Node */}
                          <div className="w-72 bg-slate-900 border-2 border-indigo-500 rounded-2xl shadow-2xl overflow-hidden group hover:scale-[1.02] transition-transform">
                             <div className="bg-indigo-500/10 p-4 border-b border-indigo-500/20">
                                <div className="flex justify-between items-start">
                                   <div>
                                      <div className="text-sm font-bold text-white">{rel.source}</div>
                                      <div className="text-[10px] text-indigo-400 font-mono mt-0.5">{sourceObj?.type || 'OBJECT'}</div>
                                   </div>
                                   <Box size={18} className="text-indigo-400" />
                                </div>
                             </div>
                             <div className="p-4 space-y-3">
                                <div className="flex items-center justify-between text-[11px]">
                                   <span className="text-slate-500">来源表:</span>
                                   <span className="text-slate-300 font-mono truncate ml-2">{sourceObj?.description.split(' ').pop()}</span>
                                </div>
                                <div className="flex items-center justify-between text-[11px]">
                                   <span className="text-slate-500">属性数量:</span>
                                   <span className="text-slate-300">{sourceObj?.fieldCount}</span>
                                </div>
                             </div>
                          </div>
                          
                          {/* Edge */}
                          <div className="flex flex-col items-center space-y-2 relative">
                             <div className="h-20 w-0.5 bg-gradient-to-b from-indigo-500 to-blue-500 relative">
                                <div className="absolute top-1/2 left-4 -translate-y-1/2 bg-slate-900 border border-slate-700 rounded-xl p-3 shadow-xl min-w-[220px]">
                                   <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">关系类型: {rel.type}</div>
                                   <div className="text-xs text-slate-200 font-mono">{rel.keys}</div>
                                   <div className="mt-2 flex items-center justify-between">
                                      <span className="text-[9px] text-slate-500">置信度:</span>
                                      <span className="text-[9px] text-green-400 font-mono">{(rel.confidence * 100).toFixed(0)}%</span>
                                   </div>
                                </div>
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                                   <ChevronRight size={16} className="text-blue-500 rotate-90" />
                                </div>
                             </div>
                          </div>

                          {/* Target Node */}
                          <div className="w-72 bg-slate-900 border border-slate-700 rounded-2xl shadow-xl overflow-hidden hover:border-blue-500/50 transition-colors">
                             <div className="bg-slate-800/50 p-4 border-b border-slate-800">
                                <div className="flex justify-between items-start">
                                   <div>
                                      <div className="text-sm font-bold text-white">{rel.target}</div>
                                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">{targetObj?.type || 'OBJECT'}</div>
                                   </div>
                                   <Layers size={18} className="text-blue-400" />
                                </div>
                             </div>
                             <div className="p-4 space-y-3">
                                <div className="flex items-center justify-between text-[11px]">
                                   <span className="text-slate-500">来源表:</span>
                                   <span className="text-slate-300 font-mono truncate ml-2">{targetObj?.description.split(' ').pop()}</span>
                                </div>
                                <div className="flex items-center justify-between text-[11px]">
                                   <span className="text-slate-500">属性数量:</span>
                                   <span className="text-slate-300">{targetObj?.fieldCount}</span>
                                </div>
                             </div>
                          </div>
                        </React.Fragment>
                      );
                    })
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                      <Network size={48} className="opacity-20 mb-4" />
                      <p className="text-sm">暂无检测到的对象关系</p>
                    </div>
                  )}
               </div>
            </div>
            
            <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex justify-between items-center">
               <div className="text-[11px] text-slate-500">
                  基于 <span className="text-indigo-400 font-mono">Reasoning LLM</span> 语义关联推断
               </div>
               <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors flex items-center space-x-2">
                  <ExternalLink size={14} />
                  <span>导出关系图</span>
                </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
