import React from 'react';
import { Plus, Network } from 'lucide-react';
import { BusinessObject, SemanticData } from '../../types';
import ObjectCard from './ObjectCard';

interface ObjectListProps {
  objects: BusinessObject[];
  data: SemanticData | null;
  selectedObject: BusinessObject | null;
  onSelectObject: (obj: BusinessObject) => void;
  onOpenRelationship: () => void;
}

export default function ObjectList({
  objects,
  data,
  selectedObject,
  onSelectObject,
  onOpenRelationship
}: ObjectListProps) {
  return (
    <div className="w-64 border-r border-slate-800 bg-slate-900/30 flex flex-col shrink-0">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">生成对象 ({objects.length})</h3>
        <button className="p-1.5 hover:bg-slate-800 rounded text-slate-400 transition-colors">
          <Plus size={14} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {objects.map((obj: BusinessObject) => {
          const hasRelationships = data?.relationships?.some((r: any) => r.source === obj.name || r.target === obj.name);
          return (
            <ObjectCard
              key={obj.id}
              obj={obj}
              isSelected={selectedObject?.id === obj.id}
              hasRelationships={!!hasRelationships}
              onSelect={() => onSelectObject(obj)}
            />
          );
        })}
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
  );
}
