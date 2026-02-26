import React from 'react';
import { X, GitBranch, Merge, Box, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { BusinessObject } from '../types';

interface MergeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (targetObj: BusinessObject) => void;
  objects: BusinessObject[];
  selectedObject: BusinessObject | null;
}

export default function MergeModal({
  isOpen,
  onClose,
  onConfirm,
  objects,
  selectedObject
}: MergeModalProps) {
  if (!isOpen || !selectedObject) return null;

  const otherObjects = objects.filter(o => o.id !== selectedObject.id);

  return (
    <AnimatePresence>
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
            <button onClick={onClose} className="text-slate-400 hover:text-white">
              <X size={20} />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <p className="text-sm text-slate-300">
              选择一个对象与 <span className="text-indigo-400 font-medium">{selectedObject.name}</span> 合并：
            </p>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {otherObjects.map((obj) => (
                <button
                  key={obj.id}
                  onClick={() => onConfirm(obj)}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg hover:border-indigo-500/30 hover:bg-slate-900/50 transition-all text-left group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-slate-800 rounded-lg border border-slate-700 group-hover:border-indigo-500/30 transition-colors">
                        <Box size={16} className="text-slate-400 group-hover:text-indigo-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-200">{obj.name}</div>
                        <div className="text-[10px] text-slate-500">{obj.fieldCount} 个属性</div>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-slate-600 group-hover:text-indigo-400 transition-colors" />
                  </div>
                </button>
              ))}
            </div>

            <div className="bg-blue-950/30 border border-blue-500/30 p-3 rounded-lg">
              <p className="text-xs text-blue-300">
                合并后将把目标对象的属性添加到当前对象，目标对象将被移除。
              </p>
            </div>
          </div>

          <div className="p-5 border-t border-slate-800 flex justify-end bg-slate-900/50">
            <button onClick={onClose} className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">
              取消
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
