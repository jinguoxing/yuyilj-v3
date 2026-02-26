import { useState } from 'react';
import { UnassignedField } from '../types';

export interface DraggedField extends UnassignedField {
  source: 'POOL' | 'STRUCTURE';
  originalType?: string;
}

export function useDragDrop() {
  const [draggedField, setDraggedField] = useState<DraggedField | null>(null);
  const [dragOverGroup, setDragOverGroup] = useState<string | null>(null);
  const [isDraggingToPool, setIsDraggingToPool] = useState(false);

  const handleDragStart = (e: React.DragEvent, field: UnassignedField, source: 'POOL' | 'STRUCTURE', originalType?: string) => {
    setDraggedField({ ...field, source, originalType });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, groupType: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverGroup(groupType);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverGroup(null);
  };

  const resetDragState = () => {
    setDraggedField(null);
    setDragOverGroup(null);
    setIsDraggingToPool(false);
  };

  return {
    draggedField,
    dragOverGroup,
    isDraggingToPool,
    setIsDraggingToPool,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    resetDragState
  };
}
