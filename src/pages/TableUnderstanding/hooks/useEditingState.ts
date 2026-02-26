import { useState } from 'react';
import { EditingState } from '../types';

export function useEditingState(initialGrain: string, initialDescription: string) {
  const [state, setState] = useState<EditingState>({
    isEditingName: false,
    tableName: '员工维度表',
    isEditingGrain: false,
    grain: initialGrain,
    isEditingDesc: false,
    description: initialDescription
  });

  const setEditingName = (value: boolean) => setState(prev => ({ ...prev, isEditingName: value }));
  const setTableName = (value: string) => setState(prev => ({ ...prev, tableName: value }));

  const setEditingGrain = (value: boolean) => setState(prev => ({ ...prev, isEditingGrain: value }));
  const setGrain = (value: string) => setState(prev => ({ ...prev, grain: value }));

  const setEditingDesc = (value: boolean) => setState(prev => ({ ...prev, isEditingDesc: value }));
  const setDescription = (value: string) => setState(prev => ({ ...prev, description: value }));

  return {
    ...state,
    setEditingName,
    setTableName,
    setEditingGrain,
    setGrain,
    setEditingDesc,
    setDescription
  };
}
