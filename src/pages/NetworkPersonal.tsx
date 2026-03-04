import React, { useState } from 'react';
import { 
  User, Zap, Layout, Settings, MessageSquare, UploadCloud, 
  Plus, Play, Search, ArrowRight, Star, Clock, 
  GitPullRequest, CheckCircle2, XCircle, ChevronRight,
  Sliders, FileJson, Bookmark
} from 'lucide-react';
import { motion } from 'motion/react';

export default function NetworkPersonal() {
  const [activeTab, setActiveTab] = useState('views');

  // Mock Data
  const shortcuts = [
    { id: 's1', label: 'New Analysis', icon: <Plus size={16} />, color: 'bg-indigo-600' },
    { id: 's2', label: 'Quick Fix Queue', icon: <Zap size={16} />, color: 'bg-amber-600' },
    { id: 's3', label: 'Search Personal', icon: <Search size={16} />, color: 'bg-slate-700' },
  ];

  const myViews = [
    { id: 'v1', name: 'My Order Analysis', updated: '2 hours ago', nodes: 12 },
    { id: 'v2', name: 'Customer Segmentation Draft', updated: '1 day ago', nodes: 8 },
    { id: 'v3', name: 'Q3 Revenue Debug', updated: '3 days ago', nodes: 24 },
  ];

  const myDefaults = [
    { id: 'd1', category: 'Thresholds', label: 'Risk Tolerance', value: 'Strict (< 5%)' },
    { id: 'd2', category: 'Automation', label: 'Auto-Confirm Confidence', value: '> 95%' },
    { id: 'd3', category: 'Visual', label: 'Default Layout', value: 'Radial' },
  ];

  const myFeedback = [
    { id: 'f1', action: 'Confirmed', target: 'Mapping: Order -> Cust', impact: 'Improved lineage accuracy', time: '10m ago' },
    { id: 'f2', action: 'Rejected', target: 'Rule: Amount < 0', impact: 'Prevented false positives', time: '2h ago' },
    { id: 'f3', action: 'Overridden', target: 'PII: Email', impact: 'Local unmasking enabled', time: '1d ago' },
  ];

  const promoteItems = [
    { id: 'p1', type: 'View', name: 'My Order Analysis', desc: 'Useful for Q3 reporting' },
    { id: 'p2', type: 'Rule', name: 'Custom DQ Check', desc: 'Validates shipping codes' },
  ];

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-200 overflow-hidden">
      {/* Header */}
      <div className="h-16 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between px-6 flex-shrink-0">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 rounded bg-amber-500/20 flex items-center justify-center text-amber-400 border border-amber-500/30">
            <User size={18} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">Personal Cockpit</h1>
            <p className="text-xs text-slate-400">My Workbench (PKN)</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="px-3 py-1 bg-slate-900 rounded-full border border-slate-800 text-xs text-slate-400 flex items-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
            Personal Overlay Active
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Shortcuts Section */}
          <section>
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center">
              <Zap size={16} className="mr-2" /> My Shortcuts
            </h2>
            <div className="grid grid-cols-4 gap-4">
              {shortcuts.map(s => (
                <button key={s.id} className="flex items-center p-4 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 hover:border-slate-700 transition-all group">
                  <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center text-white mr-3 shadow-lg group-hover:scale-110 transition-transform`}>
                    {s.icon}
                  </div>
                  <span className="font-medium text-slate-200 group-hover:text-white">{s.label}</span>
                </button>
              ))}
              <button className="flex items-center justify-center p-4 border border-slate-800 border-dashed rounded-xl text-slate-500 hover:text-slate-300 hover:border-slate-600 transition-colors">
                <Plus size={16} className="mr-2" /> Add Shortcut
              </button>
            </div>
          </section>

          <div className="grid grid-cols-3 gap-8">
            {/* Left Column: Views & Templates */}
            <div className="col-span-2 space-y-8">
              {/* My Views */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center">
                    <Layout size={16} className="mr-2" /> My Views
                  </h2>
                  <button className="text-xs text-indigo-400 hover:text-indigo-300">Manage All</button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {myViews.map(view => (
                    <div key={view.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-indigo-500/50 transition-colors cursor-pointer group">
                      <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-slate-800 rounded text-indigo-400 group-hover:text-white transition-colors">
                          <Bookmark size={18} />
                        </div>
                        <button className="text-slate-500 hover:text-white"><Star size={14} /></button>
                      </div>
                      <h3 className="font-medium text-slate-200 mb-1">{view.name}</h3>
                      <div className="flex items-center text-xs text-slate-500 space-x-3">
                        <span className="flex items-center"><Clock size={12} className="mr-1" /> {view.updated}</span>
                        <span>{view.nodes} nodes</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* My Templates */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center">
                    <FileJson size={16} className="mr-2" /> My Templates
                  </h2>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-1">
                  <div className="grid grid-cols-2 gap-1">
                    <button className="flex items-center p-3 hover:bg-slate-800 rounded-lg transition-colors text-left">
                      <div className="w-8 h-8 rounded bg-purple-500/20 text-purple-400 flex items-center justify-center mr-3">
                        <GitPullRequest size={16} />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-200">Data Quality Audit</div>
                        <div className="text-xs text-slate-500">Standard DQ workflow</div>
                      </div>
                    </button>
                    <button className="flex items-center p-3 hover:bg-slate-800 rounded-lg transition-colors text-left">
                      <div className="w-8 h-8 rounded bg-blue-500/20 text-blue-400 flex items-center justify-center mr-3">
                        <Search size={16} />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-200">Root Cause Analysis</div>
                        <div className="text-xs text-slate-500">Trace lineage & logs</div>
                      </div>
                    </button>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column: Defaults, Feedback, Promote */}
            <div className="space-y-8">
              {/* Promote Panel */}
              <section>
                <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/30 rounded-xl p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 opacity-10">
                    <UploadCloud size={80} />
                  </div>
                  <h2 className="text-sm font-semibold text-indigo-200 uppercase tracking-wider mb-4 flex items-center relative z-10">
                    <UploadCloud size={16} className="mr-2" /> Promote to DKN
                  </h2>
                  <div className="space-y-3 relative z-10">
                    <p className="text-xs text-indigo-100/70 mb-2">
                      You have 2 items ready to share with the domain.
                    </p>
                    {promoteItems.map(item => (
                      <div key={item.id} className="bg-slate-900/80 border border-indigo-500/20 rounded-lg p-3 flex items-center justify-between">
                        <div>
                          <div className="text-xs font-medium text-indigo-100">{item.name}</div>
                          <div className="text-[10px] text-indigo-300/60">{item.type}</div>
                        </div>
                        <input type="checkbox" className="rounded border-slate-600 bg-slate-800 text-indigo-500 focus:ring-indigo-500" />
                      </div>
                    ))}
                    <button className="w-full mt-2 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg shadow-lg shadow-indigo-500/20 transition-colors flex items-center justify-center">
                      Create ChangeSet & Submit
                      <ArrowRight size={12} className="ml-1" />
                    </button>
                  </div>
                </div>
              </section>

              {/* My Defaults */}
              <section>
                <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center">
                  <Sliders size={16} className="mr-2" /> My Defaults
                </h2>
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                  {myDefaults.map((def, idx) => (
                    <div key={def.id} className={`p-3 flex justify-between items-center ${idx !== myDefaults.length - 1 ? 'border-b border-slate-800' : ''}`}>
                      <div>
                        <div className="text-xs text-slate-500">{def.category}</div>
                        <div className="text-sm text-slate-300">{def.label}</div>
                      </div>
                      <div className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded">
                        {def.value}
                      </div>
                    </div>
                  ))}
                  <div className="p-2 bg-slate-950 border-t border-slate-800 text-center">
                    <button className="text-xs text-slate-500 hover:text-white flex items-center justify-center w-full">
                      <Settings size={12} className="mr-1" /> Configure
                    </button>
                  </div>
                </div>
              </section>

              {/* My Feedback */}
              <section>
                <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center">
                  <MessageSquare size={16} className="mr-2" /> My Feedback
                </h2>
                <div className="space-y-3">
                  {myFeedback.map(fb => (
                    <div key={fb.id} className="flex items-start space-x-3">
                      <div className="mt-0.5">
                        {fb.action === 'Confirmed' && <CheckCircle2 size={14} className="text-emerald-400" />}
                        {fb.action === 'Rejected' && <XCircle size={14} className="text-red-400" />}
                        {fb.action === 'Overridden' && <GitPullRequest size={14} className="text-amber-400" />}
                      </div>
                      <div>
                        <div className="text-xs text-slate-300">
                          <span className={`font-medium ${
                            fb.action === 'Confirmed' ? 'text-emerald-400' :
                            fb.action === 'Rejected' ? 'text-red-400' : 'text-amber-400'
                          }`}>{fb.action}</span> {fb.target}
                        </div>
                        <div className="text-[10px] text-slate-500">{fb.impact} • {fb.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
