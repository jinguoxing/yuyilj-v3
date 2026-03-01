import React, { useState } from 'react';
import { X, Settings, Save, Eye, ShieldCheck } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { Attribute } from '../types';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedAttr: Attribute) => void;
  attribute: Attribute | null;
}

export default function ConfigModal({ isOpen, onClose, onSave, attribute }: ConfigModalProps) {
  const [name, setName] = useState(attribute?.name || '');
  const [type, setType] = useState(attribute?.type || 'ATTRIBUTE');
  const [description, setDescription] = useState('');

  if (!isOpen || !attribute) return null;

  const handleSave = () => {
    onSave({
      ...attribute,
      name,
      type
    });
  };

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
              <Settings className="text-indigo-400" size={20} />
              <h3 className="text-lg font-semibold text-slate-200">属性配置</h3>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white">
              <X size={20} />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* Attribute Name */}
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                属性名称
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Attribute Type */}
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                属性类型
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="IDENTIFIER">标识符 (IDENTIFIER)</option>
                <option value="ATTRIBUTE">属性 (ATTRIBUTE)</option>
                <option value="MEASURE">度量 (MEASURE)</option>
              </select>
            </div>

            {/* Mapped Field */}
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                映射字段
              </label>
              <input
                type="text"
                value={attribute.mappedField}
                disabled
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-500 cursor-not-allowed"
              />
            </div>

            {/* Evidence */}
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                证据来源
              </label>
              <div className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-400">
                {attribute.evidence || 'AI 推断'}
              </div>
            </div>

            {/* Quality Rules */}
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                质量规则
              </label>
              <div className="space-y-2">
                <button className="w-full py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-400 text-left px-3 flex items-center space-x-2 hover:border-slate-700 transition-colors">
                  <ShieldCheck size={14} />
                  <span>添加数据质量规则</span>
                </button>
              </div>
            </div>
          </div>

          <div className="p-5 border-t border-slate-800 flex justify-end space-x-3 bg-slate-900/50">
            <button onClick={onClose} className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">
              取消
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium shadow-lg shadow-indigo-900/20 flex items-center space-x-2"
            >
              <Save size={16} />
              <span>保存更改</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
