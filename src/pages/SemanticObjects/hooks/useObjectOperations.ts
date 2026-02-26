import { useState } from 'react';
import { BusinessObject, UnassignedField, Attribute, SplitStrategy } from '../types';

interface UseObjectOperationsProps {
  objects: BusinessObject[];
  unassignedFields: UnassignedField[];
  selectedObject: BusinessObject | null;
  updateObjects: (updater: (prev: BusinessObject[]) => BusinessObject[]) => void;
  updateUnassignedFields: (updater: (prev: UnassignedField[]) => UnassignedField[]) => void;
  setSelectedObject: (obj: BusinessObject | null) => void;
}

export function useObjectOperations({
  objects,
  unassignedFields,
  selectedObject,
  updateObjects,
  updateUnassignedFields,
  setSelectedObject
}: UseObjectOperationsProps) {
  const [splitStrategy, setSplitStrategy] = useState<SplitStrategy>('sensitivity');

  const handleAssignField = (field: UnassignedField, targetType: string = 'ATTRIBUTE') => {
    if (!selectedObject) return;

    updateUnassignedFields(prev => prev.filter(f => f.id !== field.id));

    const newAttribute: Attribute = {
      id: `attr_${Date.now()}`,
      name: field.name,
      type: targetType as any,
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

    updateObjects(prev => prev.map(obj => obj.id === selectedObject.id ? updatedObject : obj));
    setSelectedObject(updatedObject);
  };

  const handleMoveField = (field: Attribute, targetType: string) => {
    if (!selectedObject) return;
    if (field.type === targetType) return;

    const updatedAttributes = selectedObject.attributes.map((attr: Attribute) =>
      attr.id === field.id ? { ...attr, type: targetType as any } : attr
    );

    const updatedObject = {
      ...selectedObject,
      attributes: updatedAttributes
    };

    updateObjects(prev => prev.map(obj => obj.id === selectedObject.id ? updatedObject : obj));
    setSelectedObject(updatedObject);
  };

  const handleSplitObject = () => {
    if (!selectedObject) return;

    const attrs = [...selectedObject.attributes];
    let moveAttrs: Attribute[] = [];
    let keepAttrs: Attribute[] = [];

    if (splitStrategy === 'sensitivity') {
      const sensitiveNames = ['annual_salary', 'ssn_number', 'bonus_amt', 'tax_bracket', 'salary', 'ssn', 'sensitive'];
      moveAttrs = attrs.filter(a => sensitiveNames.some(n => a.name.toLowerCase().includes(n)));
      keepAttrs = attrs.filter(a => !sensitiveNames.some(n => a.name.toLowerCase().includes(n)));
    } else {
      const detailNames = ['biography_text', 'previous_employment', 'education_history', 'notes', 'description', 'detail'];
      moveAttrs = attrs.filter(a => detailNames.some(n => a.name.toLowerCase().includes(n)));
      keepAttrs = attrs.filter(a => !detailNames.some(n => a.name.toLowerCase().includes(n)));
    }

    if (moveAttrs.length === 0) {
      const splitPoint = Math.floor(attrs.length / 2);
      keepAttrs = attrs.slice(0, splitPoint);
      moveAttrs = attrs.slice(splitPoint);
    }

    const updatedOriginal = {
      ...selectedObject,
      attributes: keepAttrs,
      fieldCount: keepAttrs.length
    };

    const newObject: BusinessObject = {
      id: `bo_${Date.now()}`,
      name: splitStrategy === 'sensitivity' ? `${selectedObject.name}_Sensitive` : `${selectedObject.name}_Detail`,
      type: selectedObject.type,
      description: splitStrategy === 'sensitivity'
        ? `Split from ${selectedObject.name} based on sensitivity analysis`
        : `Split from ${selectedObject.name} based on access frequency`,
      fieldCount: moveAttrs.length,
      attributes: moveAttrs
    };

    updateObjects(prev => prev.map(obj => obj.id === selectedObject.id ? updatedOriginal : obj).concat(newObject));
    setSelectedObject(updatedOriginal);
  };

  const handleUnassignField = (attribute: Attribute) => {
    if (!selectedObject) return;

    const updatedAttributes = selectedObject.attributes.filter((attr: Attribute) => attr.id !== attribute.id);
    const updatedObject = {
      ...selectedObject,
      attributes: updatedAttributes,
      fieldCount: selectedObject.fieldCount - 1
    };

    const newField: UnassignedField = {
      id: attribute.id,
      name: attribute.mappedField || attribute.name,
      dataType: 'STRING',
      reason: '人工移除归属',
      group: 'UNASSIGNED'
    };

    updateUnassignedFields(prev => [...prev, newField]);
    updateObjects(prev => prev.map(obj => obj.id === selectedObject.id ? updatedObject : obj));
    setSelectedObject(updatedObject);
  };

  const handleIgnoreField = (field: UnassignedField) => {
    updateUnassignedFields(prev => prev.map(f =>
      f.id === field.id ? { ...f, group: 'IGNORED' } : f
    ));
  };

  const handleRestoreField = (field: UnassignedField) => {
    updateUnassignedFields(prev => prev.map(f =>
      f.id === field.id ? { ...f, group: 'UNASSIGNED' } : f
    ));
  };

  const handleMergeObject = (targetObj: BusinessObject) => {
    if (!selectedObject) return;

    const existingMappedFields = new Set(selectedObject.attributes.map((a: Attribute) => a.mappedField));
    const newAttrs = targetObj.attributes.filter((a: Attribute) => !existingMappedFields.has(a.mappedField));

    const mergedAttrs = [...selectedObject.attributes, ...newAttrs];
    const updatedOriginal = {
      ...selectedObject,
      attributes: mergedAttrs,
      fieldCount: mergedAttrs.length,
      description: `Merged with ${targetObj.name}`
    };

    updateObjects(prev => prev.filter(o => o.id !== targetObj.id).map(o => o.id === selectedObject.id ? updatedOriginal : o));
    setSelectedObject(updatedOriginal);
  };

  const handleUpdateAttribute = (updatedAttr: Attribute) => {
    if (!selectedObject) return;
    const updatedAttributes = selectedObject.attributes.map((attr: Attribute) =>
      attr.id === updatedAttr.id ? updatedAttr : attr
    );
    const updatedObject = { ...selectedObject, attributes: updatedAttributes };
    updateObjects(prev => prev.map(obj => obj.id === selectedObject.id ? updatedObject : obj));
    setSelectedObject(updatedObject);
  };

  const handleAutoOptimize = () => {
    if (!selectedObject) return;

    const fieldsToMove = unassignedFields.filter(f => f.group === 'UNASSIGNED');
    if (fieldsToMove.length === 0) return;

    const newAttributes = fieldsToMove.map(f => ({
      id: `attr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: f.name,
      type: 'ATTRIBUTE' as const,
      mappedField: f.name,
      evidence: 'AI 自动优化分配',
      status: 'SUGGESTED' as const,
      qualityRules: []
    }));

    const updatedObject = {
      ...selectedObject,
      attributes: [...selectedObject.attributes, ...newAttributes],
      fieldCount: selectedObject.fieldCount + newAttributes.length
    };

    updateObjects(prev => prev.map(obj => obj.id === selectedObject.id ? updatedObject : obj));
    setSelectedObject(updatedObject);
    updateUnassignedFields(prev => prev.filter(f => f.group !== 'UNASSIGNED'));
  };

  return {
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
  };
}
