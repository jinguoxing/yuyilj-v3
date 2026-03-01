import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, Sparkles } from 'lucide-react';
import Header from './components/Header';
import ViewSwitcher from './components/ViewSwitcher';
import StructureView from './components/StructureView';
import TableView from './components/TableView';
import RelationshipDrawer from './components/RelationshipDrawer';
import SplitModal from './modals/SplitModal';
import MergeModal from './modals/MergeModal';
import ConfigModal from './modals/ConfigModal';
import { useSemanticData } from './hooks/useSemanticData';
import { useObjectOperations } from './hooks/useObjectOperations';
import { useDragDrop } from './hooks/useDragDrop';
import { ViewMode, Attribute, BusinessObject, UnassignedField } from './types';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function SemanticObjects() {
  const navigate = useNavigate();

  const {
    data,
    objects,
    unassignedFields,
    selectedObject,
    setSelectedObject,
    updateObjects,
    updateUnassignedFields
  } = useSemanticData();

  const {
    splitStrategy,
    setSplitStrategy,
    handleAssignField,
    handleMoveField,
    handleSplitObject,
    handleUnassignField,
    handleIgnoreField,
    handleRestoreField,
    handleMergeObject,
    handleUpdateAttribute,
    handleAutoOptimize
  } = useObjectOperations({
    objects,
    unassignedFields,
    selectedObject,
    updateObjects,
    updateUnassignedFields,
    setSelectedObject
  });

  const {
    draggedField,
    dragOverGroup,
    isDraggingToPool,
    setIsDraggingToPool,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    resetDragState
  } = useDragDrop();

  // Modal states
  const [isRelationshipOpen, setIsRelationshipOpen] = React.useState(false);
  const [isSplitModalOpen, setIsSplitModalOpen] = React.useState(false);
  const [isMergeModalOpen, setIsMergeModalOpen] = React.useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = React.useState(false);
  const [configuringAttribute, setConfiguringAttribute] = React.useState<Attribute | null>(null);
  const [activeView, setActiveView] = React.useState<ViewMode>('object');

  const handleDragOverWithDrop = (e: React.DragEvent, groupType: string) => {
    handleDragOver(e, groupType);
    if (draggedField) {
      if (draggedField.source === 'POOL') {
        handleAssignField(draggedField, groupType);
      } else if (draggedField.source === 'STRUCTURE') {
        handleMoveField(draggedField, groupType);
      }
      resetDragState();
    }
  };

  const handlePoolDragOver = (e: React.DragEvent) => {
    if (draggedField?.source === 'STRUCTURE') {
      e.preventDefault();
      setIsDraggingToPool(true);
    }
  };

  const handlePoolDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingToPool(false);
    if (draggedField?.source === 'STRUCTURE') {
      handleUnassignField(draggedField);
      resetDragState();
    }
  };

  const handleConfigAttribute = (attr: Attribute) => {
    setConfiguringAttribute(attr);
    setIsConfigModalOpen(true);
  };

  const handleAutoOptimizeClick = () => {
    handleAutoOptimize();
  };

  const handlePublish = () => {
    navigate('/semantic/releases');
  };

  if (!data) return <div className="p-8 text-slate-400">Loading Objects...</div>;

  return (
    <div className="flex flex-col h-full bg-slate-950 relative font-sans text-slate-200">
      {/* Header */}
      <Header
        data={data}
        onOpenRelationship={() => setIsRelationshipOpen(true)}
        onPublish={handlePublish}
      />

      {/* View Switcher Bar */}
      <div className="h-14 border-b border-slate-800 bg-slate-900/30 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center space-x-4">
          <ViewSwitcher activeView={activeView} onViewChange={setActiveView} />
        </div>

        <div className="flex items-center space-x-3">
          {activeView === 'object' && (
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleAutoOptimizeClick}
              className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg text-xs font-medium transition-all flex items-center space-x-1.5 shadow-lg shadow-indigo-900/20"
            >
              <BrainCircuit size={14} />
              <span>AI 自动优化</span>
              <Sparkles size={12} className="text-yellow-300" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden relative">
        {activeView === 'object' ? (
          <StructureView
            data={data}
            objects={objects}
            unassignedFields={unassignedFields}
            selectedObject={selectedObject}
            draggedField={draggedField}
            dragOverGroup={dragOverGroup}
            isDraggingToPool={isDraggingToPool}
            onSelectObject={setSelectedObject}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDragOverWithDrop}
            onPoolDragOver={handlePoolDragOver}
            onPoolDrop={handlePoolDrop}
            onAssignField={handleAssignField}
            onUnassignField={handleUnassignField}
            onIgnoreField={handleIgnoreField}
            onRestoreField={handleRestoreField}
            onConfigAttribute={handleConfigAttribute}
            onSplit={() => setIsSplitModalOpen(true)}
            onMerge={() => setIsMergeModalOpen(true)}
            onOpenRelationship={() => setIsRelationshipOpen(true)}
          />
        ) : (
          <TableView
            objects={objects}
            data={data}
            activeView={activeView}
            setActiveView={setActiveView}
          />
        )}
      </div>

      {/* Relationship Drawer */}
      <RelationshipDrawer
        isOpen={isRelationshipOpen}
        onClose={() => setIsRelationshipOpen(false)}
        data={data}
      />

      {/* Split Modal */}
      <SplitModal
        isOpen={isSplitModalOpen}
        onClose={() => setIsSplitModalOpen(false)}
        onConfirm={handleSplitObject}
        selectedObject={selectedObject}
        strategy={splitStrategy}
        onStrategyChange={setSplitStrategy}
      />

      {/* Merge Modal */}
      <MergeModal
        isOpen={isMergeModalOpen}
        onClose={() => setIsMergeModalOpen(false)}
        onConfirm={handleMergeObject}
        objects={objects}
        selectedObject={selectedObject}
      />

      {/* Config Modal */}
      <ConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        onSave={handleUpdateAttribute}
        attribute={configuringAttribute}
      />
    </div>
  );
}
