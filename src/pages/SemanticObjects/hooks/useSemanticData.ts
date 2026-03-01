import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { SemanticApi } from '@/services/semanticApi';
import { SemanticData, BusinessObject, UnassignedField } from '../types';

export function useSemanticData() {
  const { lvId } = useParams();
  const [data, setData] = useState<SemanticData | null>(null);
  const [objects, setObjects] = useState<BusinessObject[]>([]);
  const [unassignedFields, setUnassignedFields] = useState<UnassignedField[]>([]);
  const [selectedObject, setSelectedObject] = useState<BusinessObject | null>(null);

  useEffect(() => {
    SemanticApi.getBusinessObjects(lvId || 'lv_005').then((res: SemanticData) => {
      setData(res);
      setObjects(res.objects);
      setUnassignedFields(res.unassignedFields);
      if (res.objects.length > 0) setSelectedObject(res.objects[0]);
    });
  }, [lvId]);

  const updateObjects = (updater: (prev: BusinessObject[]) => BusinessObject[]) => {
    setObjects(updater);
  };

  const updateUnassignedFields = (updater: (prev: UnassignedField[]) => UnassignedField[]) => {
    setUnassignedFields(updater);
  };

  return {
    data,
    objects,
    unassignedFields,
    selectedObject,
    setSelectedObject,
    updateObjects,
    updateUnassignedFields
  };
}
