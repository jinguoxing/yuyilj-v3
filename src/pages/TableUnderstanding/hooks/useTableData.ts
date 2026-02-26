import { useState } from 'react';
import { BottomTabType } from '../types';

export function useTableData() {
  const [isSaving, setIsSaving] = useState(false);
  const [isBottomPanelOpen, setIsBottomPanelOpen] = useState(false);
  const [activeBottomTab, setActiveBottomTab] = useState<BottomTabType>('preview');

  const handleConfirm = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('策略已确认保存');
    }, 1000);
  };

  return {
    isSaving,
    isBottomPanelOpen,
    activeBottomTab,
    setIsSaving,
    setIsBottomPanelOpen,
    setActiveBottomTab,
    handleConfirm
  };
}
