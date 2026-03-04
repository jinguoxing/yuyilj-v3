import React, { useState, useRef, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  ZoomIn, ZoomOut, Move, MousePointer2, Layers, 
  Maximize, Minimize, Save, Share2, MoreHorizontal,
  Plus, Filter, Search, Building2, Box, User,
  LayoutTemplate, Network, GitCommit, Activity,
  Clock, Calendar, PlayCircle, PauseCircle, SkipBack, SkipForward,
  Database, Shield, FileText, Bookmark, ChevronRight, ChevronDown,
  AlertTriangle, CheckCircle2, X, Sparkles, MessageCircleQuestion, PenLine, Wrench,
  Link, History, FileSearch, GitPullRequest, Download, Trash2, Send, RefreshCw, ChevronUp, AlertOctagon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type ViewMode = 'Layered' | 'Story' | 'Dependency' | 'Quality';
type LayoutMode = 'Hierarchical' | 'Radial' | 'Clustered';
type InspectorTab = '属性' | '关系' | '断言' | '证据' | '运行';
type ChangeSetStep = 'review' | 'validating' | 'result';

interface NodeData {
  id: string;
  type: 'Asset' | 'Object' | 'Standard' | 'Assertion' | 'Run';
  label: string;
  details?: Record<string, string>;
  status?: 'Healthy' | 'Risk' | 'Unknown';
  x: number;
  y: number;
  expanded?: boolean;
}

interface EdgeData {
  id: string;
  source: string;
  target: string;
  type: 'Solid' | 'Dashed' | 'Glow';
}

export default function NetworkStudio() {
  const { networkMode } = useOutletContext<{ networkMode: 'GKN' | 'DKN' | 'PKN' }>();
  const [viewMode, setViewMode] = useState<ViewMode>('Layered');
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('Hierarchical');
  const [selectedScopes, setSelectedScopes] = useState<string[]>(['Assets', 'Objects']);
  const [timeValue, setTimeValue] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [expandedClusters, setExpandedClusters] = useState<string[]>(['Assets', 'Objects']);
  const [activeTab, setActiveTab] = useState<InspectorTab>('属性');
  const [showFixOptions, setShowFixOptions] = useState(false);
  
  // ChangeSet State
  const [isChangeSetOpen, setIsChangeSetOpen] = useState(false);
  const [changeSetStep, setChangeSetStep] = useState<ChangeSetStep>('review');

  // Graph State
  const [nodes, setNodes] = useState<NodeData[]>([
    { id: 'n1', type: 'Object', label: 'Customer', status: 'Healthy', x: 200, y: 150, details: { id: 'UUID', email: 'String', tier: 'Enum' } },
    { id: 'n2', type: 'Object', label: 'Order', status: 'Healthy', x: 500, y: 150, details: { id: 'UUID', total: 'Decimal', created_at: 'DateTime' } },
    { id: 'n3', type: 'Asset', label: 'Table: ORDERS', status: 'Risk', x: 500, y: 350, details: { db: 'Snowflake', schema: 'SALES', rows: '1.2M' } },
    { id: 'n4', type: 'Assertion', label: 'Total > 0', status: 'Unknown', x: 700, y: 150, details: { rule: 'val > 0', severity: 'High' } },
    { id: 'n5', type: 'Standard', label: 'ISO-8601', status: 'Healthy', x: 350, y: 50, details: { format: 'YYYY-MM-DD' } },
  ]);
  
  const [edges, setEdges] = useState<EdgeData[]>([
    { id: 'e1', source: 'n1', target: 'n2', type: 'Solid' },
    { id: 'e2', source: 'n3', target: 'n2', type: 'Dashed' },
    { id: 'e3', source: 'n2', target: 'n4', type: 'Glow' },
    { id: 'e4', source: 'n5', target: 'n2', type: 'Dashed' },
  ]);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  const scopes = ['Assets', 'Standards', 'Assertions', 'Objects', 'Runs'];

  // Mock ChangeSet Data
  const changes = [
    { id: 'c1', type: 'Node', action: 'Add', label: 'Table: SHIPPING_COSTS', desc: 'Added from Snowflake source' },
    { id: 'c2', type: 'Edge', action: 'Modify', label: 'Order -> Customer', desc: 'Changed cardinality to 1:N' },
    { id: 'c3', type: 'Policy', action: 'Add', label: 'PII Masking', desc: 'Applied to email field' },
    { id: 'c4', type: 'Assertion', action: 'Override', label: 'Total > 0', desc: 'Disabled for return orders' },
  ];

  const validationResults = [
    { id: 'v1', type: 'Schema', status: 'Pass', label: '本体约束检查 (Schema Check)', message: 'All types match ontology definitions.' },
    { id: 'v2', type: 'Consistency', status: 'Fail', label: '一致性检查 (Consistency Check)', message: 'Detected cyclic dependency in Order -> Payment -> Order.' },
    { id: 'v3', type: 'Risk', status: 'Warning', label: '风险检查 (Risk Check)', message: 'High sensitivity data exposed without masking.' },
  ];

  const handleApplyChanges = () => {
    setChangeSetStep('validating');
    setTimeout(() => {
      setChangeSetStep('result');
    }, 2000);
  };

  const toggleScope = (scope: string) => {
    if (selectedScopes.includes(scope)) {
      setSelectedScopes(selectedScopes.filter(s => s !== scope));
    } else {
      setSelectedScopes([...selectedScopes, scope]);
    }
  };

  const toggleCluster = (cluster: string) => {
    if (expandedClusters.includes(cluster)) {
      setExpandedClusters(expandedClusters.filter(c => c !== cluster));
    } else {
      setExpandedClusters([...expandedClusters, cluster]);
    }
  };

  const handleNodeClick = (id: string) => {
    setSelectedNodeId(id);
  };

  const handleNodeDoubleClick = (id: string) => {
    setNodes(nodes.map(n => n.id === id ? { ...n, expanded: !n.expanded } : n));
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedNodeId(null);
    }
  };

  // Helper to get node color based on type
  const getNodeColor = (type: string) => {
    switch (type) {
      case 'Asset': return 'border-slate-500 bg-slate-900 text-slate-300';
      case 'Object': return 'border-indigo-500 bg-slate-900 text-indigo-100';
      case 'Standard': return 'border-blue-400 bg-slate-900 text-blue-100';
      case 'Assertion': return 'border-amber-500 bg-slate-900 text-amber-100';
      case 'Run': return 'border-emerald-500 bg-slate-900 text-emerald-100';
      default: return 'border-slate-500 bg-slate-900 text-slate-300';
    }
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'Asset': return <Database size={14} className="text-slate-400" />;
      case 'Object': return <Box size={14} className="text-indigo-400" />;
      case 'Standard': return <FileText size={14} className="text-blue-400" />;
      case 'Assertion': return <Shield size={14} className="text-amber-400" />;
      case 'Run': return <Activity size={14} className="text-emerald-400" />;
      default: return <Box size={14} />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 relative overflow-hidden rounded-xl border border-slate-800">
      {/* Studio Toolbar */}
      <div className="h-16 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between px-4 flex-shrink-0 z-20">
        <div className="flex items-center space-x-4">
          {/* Network Indicator */}
          <div className="flex items-center space-x-2 text-sm font-medium text-slate-300 mr-2">
            {networkMode === 'GKN' && <Building2 size={16} className="text-indigo-400" />}
            {networkMode === 'DKN' && <Box size={16} className="text-emerald-400" />}
            {networkMode === 'PKN' && <User size={16} className="text-amber-400" />}
            <span className="hidden md:inline">{networkMode} Studio</span>
          </div>

          <div className="h-6 w-px bg-slate-800" />

          {/* View Switch */}
          <div className="flex bg-slate-800 rounded-lg p-0.5 border border-slate-700">
            <button 
              onClick={() => setViewMode('Layered')}
              className={`p-1.5 rounded transition-colors ${viewMode === 'Layered' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`} 
              title="Layered View"
            >
              <Layers size={16} />
            </button>
            <button 
              onClick={() => setViewMode('Story')}
              className={`p-1.5 rounded transition-colors ${viewMode === 'Story' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`} 
              title="Story View"
            >
              <GitCommit size={16} className="rotate-90" />
            </button>
            <button 
              onClick={() => setViewMode('Dependency')}
              className={`p-1.5 rounded transition-colors ${viewMode === 'Dependency' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`} 
              title="Dependency View"
            >
              <Network size={16} />
            </button>
            <button 
              onClick={() => setViewMode('Quality')}
              className={`p-1.5 rounded transition-colors ${viewMode === 'Quality' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`} 
              title="Quality View"
            >
              <Activity size={16} />
            </button>
          </div>

          {/* Layout Switch */}
          <div className="flex bg-slate-800 rounded-lg p-0.5 border border-slate-700 hidden lg:flex">
            <button 
              onClick={() => setLayoutMode('Hierarchical')}
              className={`px-2 py-1.5 rounded text-xs font-medium transition-colors ${layoutMode === 'Hierarchical' ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
            >
              Hierarchical
            </button>
            <button 
              onClick={() => setLayoutMode('Radial')}
              className={`px-2 py-1.5 rounded text-xs font-medium transition-colors ${layoutMode === 'Radial' ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
            >
              Radial
            </button>
            <button 
              onClick={() => setLayoutMode('Clustered')}
              className={`px-2 py-1.5 rounded text-xs font-medium transition-colors ${layoutMode === 'Clustered' ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
            >
              Clustered
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Scope Chips */}
          <div className="flex items-center space-x-1 hidden xl:flex">
            {scopes.map(scope => (
              <button
                key={scope}
                onClick={() => toggleScope(scope)}
                className={`px-2 py-1 rounded-full text-[10px] font-medium border transition-colors ${
                  selectedScopes.includes(scope)
                    ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                    : 'bg-slate-900 text-slate-500 border-slate-700 hover:border-slate-600'
                }`}
              >
                {scope}
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-slate-800 hidden xl:block" />

          {/* Standard Tools */}
          <div className="flex items-center space-x-2">
             <div className="flex bg-slate-800 rounded-lg p-0.5 border border-slate-700">
              <button className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors" title="Select">
                <MousePointer2 size={16} />
              </button>
              <button className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors" title="Pan">
                <Move size={16} />
              </button>
            </div>
            <button className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors shadow-lg shadow-indigo-500/20">
              <Plus size={14} />
              <span className="hidden sm:inline">Add Node</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Explorer Sidebar */}
        <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-30 flex-shrink-0">
          {/* Search */}
          <div className="p-4 border-b border-slate-800">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search nodes..." 
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 focus:ring-1 focus:ring-indigo-500 outline-none placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Clusters */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            <div className="px-2 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>Clusters</span>
              <Filter size={12} className="cursor-pointer hover:text-slate-300" />
            </div>
            
            {/* Assets Cluster */}
            <div>
              <button 
                onClick={() => toggleCluster('Assets')}
                className="w-full flex items-center justify-between px-2 py-1.5 text-sm text-slate-300 hover:bg-slate-800 rounded transition-colors"
              >
                <div className="flex items-center space-x-2">
                  {expandedClusters.includes('Assets') ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  <Database size={14} className="text-slate-400" />
                  <span>Assets</span>
                </div>
                <span className="text-xs text-slate-600">12</span>
              </button>
              {expandedClusters.includes('Assets') && (
                <div className="pl-9 pr-2 space-y-0.5 mt-0.5">
                   <div className="flex items-center text-xs text-slate-400 py-1 hover:text-white cursor-pointer truncate">
                     <div className="w-1.5 h-1.5 rounded-full bg-slate-600 mr-2 flex-shrink-0"></div>
                     <span className="truncate">DS: Snowflake_Prod</span>
                   </div>
                   <div className="flex items-center text-xs text-slate-400 py-1 hover:text-white cursor-pointer truncate">
                     <div className="w-1.5 h-1.5 rounded-full bg-slate-600 mr-2 flex-shrink-0"></div>
                     <span className="truncate">Table: ORDERS</span>
                   </div>
                   <div className="flex items-center text-xs text-slate-400 py-1 hover:text-white cursor-pointer truncate">
                     <div className="w-1.5 h-1.5 rounded-full bg-slate-600 mr-2 flex-shrink-0"></div>
                     <span className="truncate">Table: CUSTOMERS</span>
                   </div>
                </div>
              )}
            </div>

            {/* Objects Cluster */}
            <div>
              <button 
                onClick={() => toggleCluster('Objects')}
                className="w-full flex items-center justify-between px-2 py-1.5 text-sm text-slate-300 hover:bg-slate-800 rounded transition-colors"
              >
                <div className="flex items-center space-x-2">
                  {expandedClusters.includes('Objects') ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  <Box size={14} className="text-slate-400" />
                  <span>Objects</span>
                </div>
                <span className="text-xs text-slate-600">8</span>
              </button>
              {expandedClusters.includes('Objects') && (
                <div className="pl-9 pr-2 space-y-0.5 mt-0.5">
                   <div className="flex items-center text-xs text-slate-400 py-1 hover:text-white cursor-pointer truncate">
                     <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2 flex-shrink-0"></div>
                     <span className="truncate">Obj: Customer</span>
                   </div>
                   <div className="flex items-center text-xs text-slate-400 py-1 hover:text-white cursor-pointer truncate">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 flex-shrink-0"></div>
                     <span className="truncate">Obj: Order</span>
                   </div>
                </div>
              )}
            </div>

            {/* Assertions Cluster */}
            <div>
              <button 
                onClick={() => toggleCluster('Assertions')}
                className="w-full flex items-center justify-between px-2 py-1.5 text-sm text-slate-300 hover:bg-slate-800 rounded transition-colors"
              >
                <div className="flex items-center space-x-2">
                  {expandedClusters.includes('Assertions') ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  <Shield size={14} className="text-slate-400" />
                  <span>Assertions</span>
                </div>
                <span className="bg-amber-500/20 text-amber-400 text-[10px] px-1.5 rounded-full">3</span>
              </button>
            </div>

            {/* Standards Cluster */}
            <div>
              <button 
                onClick={() => toggleCluster('Standards')}
                className="w-full flex items-center justify-between px-2 py-1.5 text-sm text-slate-300 hover:bg-slate-800 rounded transition-colors"
              >
                <div className="flex items-center space-x-2">
                  {expandedClusters.includes('Standards') ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  <FileText size={14} className="text-slate-400" />
                  <span>Standards</span>
                </div>
              </button>
            </div>

            <div className="my-4 border-t border-slate-800 mx-2"></div>

            {/* Saved Views */}
            <div className="px-2 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Saved Views</div>
            <div className="space-y-0.5">
              {['订单对象全链路', '语义待办 Top20', '质量高风险子图'].map((view, i) => (
                <button key={i} className="w-full flex items-center space-x-2 px-2 py-1.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors text-left">
                  <Bookmark size={12} className="text-indigo-500" />
                  <span>{view}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Graph Canvas */}
        <div 
          className="flex-1 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-slate-950 relative overflow-hidden cursor-crosshair"
          onClick={handleCanvasClick}
        >
          {/* Dynamic Background based on Layout */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
            {layoutMode === 'Radial' ? (
              <div className="w-[800px] h-[800px] border border-slate-700 rounded-full border-dashed animate-spin-slow opacity-30"></div>
            ) : layoutMode === 'Hierarchical' ? (
              <div className="w-full h-full flex justify-around opacity-20">
                <div className="w-px h-full bg-slate-700 border-r border-dashed"></div>
                <div className="w-px h-full bg-slate-700 border-r border-dashed"></div>
                <div className="w-px h-full bg-slate-700 border-r border-dashed"></div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-20 opacity-20">
                <div className="w-40 h-40 border border-slate-700 rounded-full border-dashed"></div>
                <div className="w-40 h-40 border border-slate-700 rounded-full border-dashed"></div>
                <div className="w-40 h-40 border border-slate-700 rounded-full border-dashed"></div>
              </div>
            )}
          </div>

          {/* Edges Layer */}
          <svg className="absolute inset-0 pointer-events-none z-0 w-full h-full">
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
              </marker>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            {edges.map(edge => {
              const sourceNode = nodes.find(n => n.id === edge.source);
              const targetNode = nodes.find(n => n.id === edge.target);
              if (!sourceNode || !targetNode) return null;

              // Simple straight line calculation (center to center)
              // In a real app, this would be more sophisticated (e.g., edge routing, port handling)
              return (
                <g key={edge.id}>
                  <path 
                    d={`M ${sourceNode.x + 100} ${sourceNode.y + 40} L ${targetNode.x + 100} ${targetNode.y + 40}`}
                    stroke={edge.type === 'Glow' ? '#6366f1' : '#475569'}
                    strokeWidth={edge.type === 'Glow' ? 3 : 2}
                    strokeDasharray={edge.type === 'Dashed' ? '5,5' : '0'}
                    fill="none"
                    markerEnd="url(#arrowhead)"
                    filter={edge.type === 'Glow' ? 'url(#glow)' : undefined}
                    className="transition-all duration-300"
                  />
                </g>
              );
            })}
          </svg>
          
          {/* Nodes Layer */}
          {nodes.map(node => (
            <motion.div 
              key={node.id}
              drag
              dragMomentum={false}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onDrag={(event, info) => {
                // Update node position in state (simplified for mock)
                // In a real app, use a proper graph library's update mechanism
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleNodeClick(node.id);
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                handleNodeDoubleClick(node.id);
              }}
              style={{ left: node.x, top: node.y }}
              className={`absolute w-[200px] rounded-xl border-2 shadow-lg transition-all duration-200 cursor-grab active:cursor-grabbing z-10 group ${
                selectedNodeId === node.id 
                  ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-900 z-20' 
                  : 'hover:border-opacity-80'
              } ${getNodeColor(node.type)} ${
                node.status === 'Risk' ? 'border-amber-500/80 shadow-amber-500/10' : 
                node.status === 'Unknown' ? 'border-slate-600 border-dashed' : 
                'border-opacity-40'
              }`}
            >
              {/* Node Header */}
              <div className="p-3 flex items-center justify-between border-b border-black/10">
                <div className="flex items-center space-x-2 overflow-hidden">
                  <div className={`p-1 rounded-md ${
                    node.status === 'Risk' ? 'bg-amber-500/20 text-amber-400' : 'bg-black/20'
                  }`}>
                    {getNodeIcon(node.type)}
                  </div>
                  <span className="font-semibold text-sm truncate">{node.label}</span>
                </div>
                {node.status === 'Risk' && <AlertTriangle size={12} className="text-amber-500" />}
                {node.status === 'Unknown' && <div className="w-2 h-2 rounded-full bg-slate-500" />}
              </div>

              {/* Node Body (Details) */}
              <div className="p-3 space-y-1.5 bg-black/20">
                {node.details && Object.entries(node.details).slice(0, node.expanded ? undefined : 2).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-[10px] items-center">
                    <span className="text-slate-400 opacity-80">{key}</span>
                    <span className="font-mono opacity-60">{value}</span>
                  </div>
                ))}
                
                {/* Expand Indicator */}
                {!node.expanded && node.details && Object.keys(node.details).length > 2 && (
                  <div className="pt-1 flex justify-center">
                    <MoreHorizontal size={12} className="text-slate-500 opacity-50" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {/* Time Slider Overlay (Moved inside Canvas) */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-full max-w-lg px-4">
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-2xl p-3 shadow-2xl flex items-center space-x-4">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex-shrink-0"
              >
                {isPlaying ? <PauseCircle size={20} /> : <PlayCircle size={20} />}
              </button>
              
              <div className="flex-1">
                <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-mono">
                  <span>v1.0.0 (Jan 2024)</span>
                  <span className="text-indigo-400 font-bold">v2.4.0 (Current)</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={timeValue} 
                  onChange={(e) => setTimeValue(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
              
              <div className="flex items-center space-x-1 text-slate-400">
                <button className="p-1 hover:text-white"><SkipBack size={16} /></button>
                <button className="p-1 hover:text-white"><SkipForward size={16} /></button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Inspector */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div 
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              className="w-96 bg-slate-900 border-l border-slate-800 flex flex-col z-30 shadow-2xl"
            >
              {/* AI Copilot Header */}
              <div className="p-4 bg-indigo-900/20 border-b border-indigo-500/30">
                <div className="flex items-center space-x-2 text-indigo-400 mb-3">
                  <Sparkles size={16} />
                  <span className="font-semibold text-sm">AI Copilot</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button className="flex flex-col items-center justify-center p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors group border border-slate-700 hover:border-indigo-500/50">
                    <MessageCircleQuestion size={16} className="text-slate-400 group-hover:text-indigo-400 mb-1" />
                    <span className="text-[10px] text-slate-400 group-hover:text-slate-200">解释 (Explain)</span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors group border border-slate-700 hover:border-emerald-500/50">
                    <PenLine size={16} className="text-slate-400 group-hover:text-emerald-400 mb-1" />
                    <span className="text-[10px] text-slate-400 group-hover:text-slate-200">建议 (Draft)</span>
                  </button>
                  <div className="relative">
                    <button 
                      onClick={() => setShowFixOptions(!showFixOptions)}
                      className="w-full flex flex-col items-center justify-center p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors group border border-slate-700 hover:border-amber-500/50"
                    >
                      <Wrench size={16} className="text-slate-400 group-hover:text-amber-400 mb-1" />
                      <span className="text-[10px] text-slate-400 group-hover:text-slate-200">修复 (Fix)</span>
                    </button>
                    {showFixOptions && (
                      <div className="absolute top-full right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 p-1">
                        <div className="text-[10px] text-slate-500 px-2 py-1 uppercase font-semibold">Repair Paths</div>
                        <button className="w-full text-left px-2 py-1.5 text-xs text-slate-300 hover:bg-slate-700 hover:text-white rounded flex items-center">
                          <FileText size={12} className="mr-2 text-blue-400" /> 补标准 (Add Standard)
                        </button>
                        <button className="w-full text-left px-2 py-1.5 text-xs text-slate-300 hover:bg-slate-700 hover:text-white rounded flex items-center">
                          <Database size={12} className="mr-2 text-slate-400" /> 补样本 (Add Sample)
                        </button>
                        <button className="w-full text-left px-2 py-1.5 text-xs text-slate-300 hover:bg-slate-700 hover:text-white rounded flex items-center">
                          <Activity size={12} className="mr-2 text-emerald-400" /> 调阈值 (Adjust Threshold)
                        </button>
                        <button className="w-full text-left px-2 py-1.5 text-xs text-slate-300 hover:bg-slate-700 hover:text-white rounded flex items-center">
                          <Bookmark size={12} className="mr-2 text-amber-400" /> 入队待办 (Queue Triage)
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Node Header */}
              <div className="p-4 border-b border-slate-800">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-bold text-white flex items-center">
                    {selectedNode.label}
                  </h2>
                  <button onClick={() => setSelectedNodeId(null)} className="text-slate-500 hover:text-white transition-colors">
                    <X size={18} />
                  </button>
                </div>
                <div className="flex items-center space-x-3 text-xs">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-medium">{selectedNode.type}</span>
                  <span className={`px-2 py-0.5 rounded border font-medium flex items-center ${
                    selectedNode.status === 'Risk' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                    selectedNode.status === 'Unknown' ? 'bg-slate-700 text-slate-400 border-slate-600' : 
                    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  }`}>
                    {selectedNode.status === 'Risk' && <AlertTriangle size={10} className="mr-1" />}
                    {selectedNode.status === 'Healthy' && <CheckCircle2 size={10} className="mr-1" />}
                    {selectedNode.status || 'Healthy'}
                  </span>
                  <span className="text-slate-500 font-mono">v1.2</span>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-slate-800">
                {['属性', '关系', '断言', '证据', '运行'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as InspectorTab)}
                    className={`flex-1 py-3 text-xs font-medium transition-colors relative ${
                      activeTab === tab ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {activeTab === '属性' && (
                  <div className="space-y-4">
                    <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                      <div className="text-xs font-medium text-slate-500 uppercase mb-3 flex items-center">
                        <Database size={12} className="mr-1.5" />
                        基础属性 (Properties)
                      </div>
                      <div className="space-y-3">
                        {selectedNode.details && Object.entries(selectedNode.details).map(([key, value]) => (
                          <div key={key} className="group">
                            <label className="block text-[10px] text-slate-400 mb-1 uppercase tracking-wider">{key}</label>
                            <input 
                              type="text" 
                              defaultValue={value} 
                              className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-xs text-slate-200 focus:border-indigo-500 outline-none transition-colors"
                            />
                          </div>
                        ))}
                        <div className="group">
                          <label className="block text-[10px] text-slate-400 mb-1 uppercase tracking-wider">Description</label>
                          <textarea 
                            className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-xs text-slate-200 focus:border-indigo-500 outline-none transition-colors h-20 resize-none"
                            defaultValue="Core business entity representing a customer order in the sales system."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === '关系' && (
                  <div className="space-y-4">
                    <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                      <div className="text-xs font-medium text-slate-500 uppercase mb-3 flex items-center">
                        <Link size={12} className="mr-1.5" />
                        入边 (Inbound)
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-slate-900 rounded border border-slate-700 hover:border-indigo-500/50 cursor-pointer transition-colors">
                          <div className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-500"></div>
                            <span className="text-xs text-slate-300">Source_System_A</span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">DataFlow</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                      <div className="text-xs font-medium text-slate-500 uppercase mb-3 flex items-center">
                        <Link size={12} className="mr-1.5" />
                        出边 (Outbound)
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-slate-900 rounded border border-slate-700 hover:border-indigo-500/50 cursor-pointer transition-colors">
                          <div className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                            <span className="text-xs text-slate-300">Sales_Report_Daily</span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">Dependency</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === '断言' && (
                  <div className="space-y-3">
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                      <div className="flex items-start justify-between mb-1">
                        <span className="text-xs font-medium text-emerald-400">Data Quality Check</span>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 rounded">Pass</span>
                      </div>
                      <p className="text-xs text-slate-400">Null check on primary key 'id' passed.</p>
                    </div>
                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                      <div className="flex items-start justify-between mb-1">
                        <span className="text-xs font-medium text-amber-400">Business Rule</span>
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 rounded">Warning</span>
                      </div>
                      <p className="text-xs text-slate-400">Total amount exceeds daily average by 200%.</p>
                      <button className="mt-2 text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center">
                        <Wrench size={10} className="mr-1" /> 修复建议
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === '证据' && (
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 p-2 hover:bg-slate-800 rounded transition-colors">
                      <div className="mt-0.5"><FileSearch size={14} className="text-indigo-400" /></div>
                      <div>
                        <div className="text-xs font-medium text-slate-200">Data Profile Scan</div>
                        <div className="text-[10px] text-slate-500">Scanned 1.2M rows • 2 hours ago</div>
                        <div className="mt-1 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 w-3/4"></div>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">Contribution: 75%</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-2 hover:bg-slate-800 rounded transition-colors">
                      <div className="mt-0.5"><User size={14} className="text-slate-400" /></div>
                      <div>
                        <div className="text-xs font-medium text-slate-200">Manual Annotation</div>
                        <div className="text-[10px] text-slate-500">By Data Steward • 1 day ago</div>
                        <div className="mt-1 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-slate-500 w-1/4"></div>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">Contribution: 25%</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === '运行' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 hover:bg-slate-800 rounded transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="p-1.5 bg-emerald-500/20 rounded text-emerald-400"><PlayCircle size={12} /></div>
                        <div>
                          <div className="text-xs font-medium text-slate-200">Daily Sync</div>
                          <div className="text-[10px] text-slate-500">Success • 10 mins ago</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">240ms</span>
                    </div>
                    <div className="flex items-center justify-between p-2 hover:bg-slate-800 rounded transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="p-1.5 bg-red-500/20 rounded text-red-400"><AlertTriangle size={12} /></div>
                        <div>
                          <div className="text-xs font-medium text-slate-200">Quality Check</div>
                          <div className="text-[10px] text-slate-500">Failed • 2 hours ago</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">1.2s</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Status Bar */}
      <div className="h-8 bg-slate-900 border-t border-slate-800 flex items-center justify-between px-4 text-[10px] text-slate-500 flex-shrink-0 z-20">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-slate-400">Connected</span>
          </div>
          <div className="h-3 w-px bg-slate-800" />
          <span>Nodes: {nodes.length}</span>
          <span>Edges: {edges.length}</span>
          <div className="h-3 w-px bg-slate-800" />
          <span>Selection: {selectedNodeId || 'None'}</span>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setIsChangeSetOpen(!isChangeSetOpen)}
            className={`flex items-center space-x-2 px-2 py-0.5 rounded transition-colors ${isChangeSetOpen ? 'bg-indigo-500/20 text-indigo-300' : 'hover:bg-slate-800 hover:text-slate-300'}`}
          >
            <GitPullRequest size={12} />
            <span>ChangeSet (4)</span>
            {isChangeSetOpen ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
          </button>
          <div className="h-3 w-px bg-slate-800" />
          <span>Last Sync: 10:42 AM</span>
        </div>
      </div>

      {/* ChangeSet Drawer */}
      <AnimatePresence>
        {isChangeSetOpen && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute bottom-8 left-0 right-0 bg-slate-900 border-t border-slate-800 shadow-2xl z-40 flex flex-col max-h-[50vh]"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-indigo-400">
                  <GitPullRequest size={18} />
                  <span className="font-semibold text-sm">ChangeSet</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-medium border border-indigo-500/30">
                  4 Pending
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {changeSetStep === 'review' && (
                  <>
                    <button className="flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                      <Trash2 size={14} />
                      <span>Discard</span>
                    </button>
                    <button className="flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                      <Download size={14} />
                      <span>Export</span>
                    </button>
                    <button 
                      onClick={handleApplyChanges}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-lg shadow-indigo-500/20"
                    >
                      <Send size={14} />
                      <span>Apply Changes</span>
                    </button>
                  </>
                )}
                {changeSetStep === 'result' && (
                  <button className="flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-lg shadow-emerald-500/20">
                    <CheckCircle2 size={14} />
                    <span>Publish</span>
                  </button>
                )}
                <button onClick={() => setIsChangeSetOpen(false)} className="p-1.5 text-slate-500 hover:text-white rounded hover:bg-slate-800 ml-2">
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-0 bg-slate-950/50">
              {changeSetStep === 'review' && (
                <div className="divide-y divide-slate-800">
                  {changes.map(change => (
                    <div key={change.id} className="flex items-center px-4 py-3 hover:bg-slate-900/50 transition-colors group">
                      <div className="w-8 flex justify-center mr-3">
                        {change.action === 'Add' && <div className="w-6 h-6 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center"><Plus size={14} /></div>}
                        {change.action === 'Modify' && <div className="w-6 h-6 rounded bg-amber-500/20 text-amber-400 flex items-center justify-center"><PenLine size={14} /></div>}
                        {change.action === 'Override' && <div className="w-6 h-6 rounded bg-purple-500/20 text-purple-400 flex items-center justify-center"><Shield size={14} /></div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-0.5">
                          <span className="text-xs font-medium text-slate-200">{change.label}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">{change.type}</span>
                        </div>
                        <div className="text-xs text-slate-500 truncate">{change.desc}</div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-2">
                        <button className="text-xs text-indigo-400 hover:text-indigo-300 underline">Diff</button>
                        <button className="p-1 text-slate-500 hover:text-red-400"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {changeSetStep === 'validating' && (
                <div className="flex flex-col items-center justify-center h-48 space-y-4">
                  <RefreshCw size={32} className="text-indigo-500 animate-spin" />
                  <div className="text-sm text-slate-300 font-medium">Validating Changes...</div>
                  <div className="text-xs text-slate-500">Running schema checks and consistency analysis</div>
                </div>
              )}

              {changeSetStep === 'result' && (
                <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {validationResults.map(result => (
                    <div key={result.id} className={`p-4 rounded-xl border ${
                      result.status === 'Pass' ? 'bg-emerald-500/5 border-emerald-500/20' :
                      result.status === 'Fail' ? 'bg-red-500/5 border-red-500/20' :
                      'bg-amber-500/5 border-amber-500/20'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {result.status === 'Pass' && <CheckCircle2 size={18} className="text-emerald-500" />}
                          {result.status === 'Fail' && <AlertOctagon size={18} className="text-red-500" />}
                          {result.status === 'Warning' && <AlertTriangle size={18} className="text-amber-500" />}
                          <span className={`text-sm font-semibold ${
                            result.status === 'Pass' ? 'text-emerald-400' :
                            result.status === 'Fail' ? 'text-red-400' :
                            'text-amber-400'
                          }`}>{result.label}</span>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${
                          result.status === 'Pass' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          result.status === 'Fail' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                          'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>{result.status}</span>
                      </div>
                      <p className="text-xs text-slate-400 mb-3">{result.message}</p>
                      {result.status !== 'Pass' && (
                        <button className="text-xs flex items-center space-x-1 text-indigo-400 hover:text-indigo-300 transition-colors">
                          <Wrench size={12} />
                          <span>View Fix Suggestions</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
