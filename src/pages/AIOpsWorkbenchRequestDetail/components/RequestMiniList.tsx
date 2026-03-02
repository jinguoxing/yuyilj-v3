import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, PanelLeftClose } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MOCK_REQUESTS, Request } from '../types';

interface RequestMiniListProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCreateModal: () => void;
  currentRequestId?: string;
}

export default function RequestMiniList({
  isOpen,
  onClose,
  onOpenCreateModal,
  currentRequestId
}: RequestMiniListProps) {
  const navigate = useNavigate();

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 280, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          className="border-r border-slate-800 bg-slate-900/50 flex flex-col shrink-0 overflow-hidden z-10"
        >
          <div className="h-14 border-b border-slate-800 flex items-center justify-between px-4 shrink-0">
            <span className="font-bold text-slate-200 text-sm">最近需求</span>
            <div className="flex items-center space-x-1">
              <button
                onClick={onOpenCreateModal}
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
                title="新建需求"
              >
                <Plus size={18} />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <PanelLeftClose size={18} />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
            {MOCK_REQUESTS.map((req) => (
              <div
                key={req.id}
                onClick={() => navigate(`/aiops/workbench/requests/${req.id}`)}
                className={cn(
                  "p-3 rounded-xl cursor-pointer transition-colors border",
                  req.id === currentRequestId
                    ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-100"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                )}
              >
                <div className="text-xs font-mono mb-1 opacity-70">{req.id}</div>
                <div className="text-sm font-medium truncate">{req.title}</div>
                <div className="mt-2 flex items-center space-x-2">
                  <span
                    className={cn(
                      "w-2 h-2 rounded-full",
                      req.status === 'COMPLETED'
                        ? "bg-emerald-500"
                        : req.status === 'IN_PROGRESS'
                        ? "bg-blue-500 animate-pulse"
                        : req.status === 'FAILED'
                        ? "bg-red-500"
                        : "bg-yellow-500"
                    )}
                  />
                  <span className="text-[10px] uppercase tracking-wider opacity-70">{req.status}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
